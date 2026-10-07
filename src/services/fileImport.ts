import JSZip from 'jszip'
import { parseStringPromise } from 'xml2js'
import { Song, Slide, TextStyle } from '@types/index'
import { v4 as uuidv4 } from 'uuid'
import { colorForGroup, inferGroup } from '@utils/groups'

const defaultTextStyle: TextStyle = {
  fontFamily: 'Arial',
  fontSize: 48,
  fontWeight: 'normal',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: 1.25,
  letterSpacing: 0,
}

const PLACEHOLDER = /double-click to edit/i

const GROUP_NAME_RE =
  /^(Verse|Chorus|Bridge|Pre-?Chorus|Intro|Outro|Tag|Ending|Interlude|Instrumental|Vamp|Refrain|Blessing|Title|Blank|Closing|Opening|Hook|Channel|V|C|B|PC)(?:\s*\d+)?$/i

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function fileTitle(filename: string): string {
  return filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Untitled'
}

function makeSlide(content: string, order: number, group: string, notes?: string): Slide {
  const label = inferGroup(group)
  return {
    id: uuidv4(),
    title: label,
    content: content.trim(),
    group: label,
    groupColor: colorForGroup(label),
    textStyle: defaultTextStyle,
    notes,
    order,
  }
}

function makeSong(title: string, slides: Slide[], extra?: Partial<Song>): Song {
  return {
    id: uuidv4(),
    title: title || 'Untitled',
    verses: [],
    slides: slides.map((slide, index) => ({ ...slide, order: index })),
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...extra,
  }
}

function decodeBase64Binary(text: string): string {
  const cleaned = text.replace(/\s+/g, '')
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(cleaned, 'base64').toString('latin1')
    }
  } catch {
    // fall through
  }
  try {
    return atob(cleaned)
  } catch {
    return text
  }
}

function skipBraceGroup(source: string, start: number): number {
  let depth = 0
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    if (ch === '\\' && i + 1 < source.length) {
      i++
      continue
    }
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return i + 1
    }
  }
  return source.length
}

function stripRtfDestinations(source: string): string {
  let output = ''
  let i = 0
  while (i < source.length) {
    if (source[i] === '{') {
      const peek = source.slice(i, i + 48)
      if (
        peek.startsWith('{\\*') ||
        /^\{(?:\\\*)?\\(?:fonttbl|colortbl|expandedcolortbl|stylesheet|info|generator|xmlnstbl|colorschememapping|latentstyles|listtable|listoverridetable|rsidtbl|themedata|datastoreitem)/.test(
          peek
        )
      ) {
        i = skipBraceGroup(source, i)
        continue
      }
    }
    output += source[i]
    i++
  }
  return output
}

function skipRtfFallback(source: string, start: number, count: number): number {
  let i = start
  let skipped = 0
  while (skipped < count && i < source.length) {
    if (source[i] === '\\' && source[i + 1] === "'") {
      i += 4
      skipped++
      continue
    }
    if (source[i] === '\\' || source[i] === '{' || source[i] === '}') break
    i++
    skipped++
  }
  return i
}

function decodeHexRun(hexes: string[]): string {
  const bytes = Uint8Array.from(hexes.map((hex) => parseInt(hex, 16)))
  try {
    const utf8 = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    if (utf8) return utf8
  } catch {
    // use the code-page fallback below
  }
  try {
    return new TextDecoder('windows-1252').decode(bytes)
  } catch {
    return Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  }
}

function rtfToText(input: string): string {
  let source = input
  const binaryEndPos = source.search(/[\x00-\x08\x0B\x0C\x0E-\x1F]+$/)
  if (binaryEndPos > -1) source = source.slice(0, binaryEndPos)
  source = stripRtfDestinations(source)

  let i = 0
  let uc = 1
  let output = ''

  while (i < source.length) {
    const ch = source[i]

    if (ch === '\\') {
      const next = source[i + 1]
      if (next === '\\' || next === '{' || next === '}') {
        output += next
        i += 2
        continue
      }
      if (next === "'" && /[0-9a-fA-F]{2}/.test(source.slice(i + 2, i + 4))) {
        const hexes: string[] = []
        while (
          source[i] === '\\' &&
          source[i + 1] === "'" &&
          /[0-9a-fA-F]{2}/.test(source.slice(i + 2, i + 4))
        ) {
          hexes.push(source.slice(i + 2, i + 4))
          i += 4
        }
        output += decodeHexRun(hexes)
        continue
      }
      if (next === '\n' || next === '\r') {
        output += '\n'
        i += 2
        continue
      }

      const control = /^\\([a-z]+)(-?\d+)?[ ]?/i.exec(source.slice(i))
      if (control) {
        const word = control[1].toLowerCase()
        const arg = control[2] != null ? parseInt(control[2], 10) : undefined
        i += control[0].length

        if (word === 'uc') {
          uc = arg ?? 1
        } else if (word === 'u') {
          const code = (arg ?? 0) < 0 ? (arg ?? 0) + 65536 : arg ?? 0
          if (code === 8232 || code === 8233) output += '\n'
          else output += String.fromCodePoint(code)
          i = skipRtfFallback(source, i, uc)
        } else if (word === 'par' || word === 'line' || word === 'page') {
          output += '\n'
        } else if (word === 'tab' || word === 'emspace' || word === 'enspace') {
          output += ' '
        }
        continue
      }

      i += 1
      continue
    }

    if (ch === '{' || ch === '}') {
      i += 1
      continue
    }
    if (ch === '\r' || ch === '\n') {
      i += 1
      continue
    }

    output += ch
    i += 1
  }

  return output
    .replace(/(\p{Script=Devanagari})\s*\?\s*/gu, '$1')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

const FONT_JUNK_RE =
  /^(Arial|ArialMT|Helvetica|HelveticaNeue|Tahoma|Roboto|Calibri|Times|TimesNewRoman|Georgia|Verdana|Impact|NotoSans|Nirmala|Mangal|LucidaGrande|SystemFont)(?:MT|Neue|UI)?[,;.\s]*$/i

function isJunkSlideText(text: string): boolean {
  const compact = text.replace(/\s+/g, '')
  if (!compact || PLACEHOLDER.test(text)) return true
  if (FONT_JUNK_RE.test(compact)) return true
  if (/^(fonttbl|colortbl|stylesheet|expandedcolortbl)[,;]*$/i.test(compact)) return true
  if (/^[,;?]+$/.test(compact)) return true
  const punct = (compact.match(/[,;]/g) || []).length
  if (punct >= 4 && punct / compact.length > 0.45) return true
  const letters = compact.replace(/[^\p{L}\p{N}]/gu, '')
  return !letters
}

function decodeProText(raw: string): string {
  if (!raw) return ''
  const binary =
    /[^A-Za-z0-9+/=]/.test(raw.slice(0, 80)) && !raw.includes('\\rtf')
      ? raw
      : decodeBase64Binary(raw)
  const source =
    binary.includes('rtf') || binary.includes('\\par')
      ? binary
      : raw.includes('\\rtf')
        ? raw
        : binary
  if (source.includes('rtf') || source.includes('\\par')) return rtfToText(source)

  const bytes = Uint8Array.from(source, (c) => c.charCodeAt(0) & 0xff)
  try {
    const utf8 = new TextDecoder('utf-8').decode(bytes)
    if (!utf8.includes('\uFFFD')) return utf8.replace(/\r\n/g, '\n').trim()
  } catch {
    // ignore
  }
  return source.replace(/\r\n/g, '\n').trim()
}

function nodeText(node: any): string {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (typeof node._ === 'string') return node._
  if (typeof node['#text'] === 'string') return node['#text']
  return ''
}

function findIvar(node: any, name: string): any | undefined {
  return asArray(node?.array).find((item: any) => item?.$?.rvXMLIvarName === name)
}

function collectXmlText(element: any): string {
  const strings = asArray(element?.NSString)
  if (!strings.length && element?.$?.RTFData) {
    return decodeProText(element.$.RTFData)
  }

  const named = strings.filter(Boolean)
  const rtf = named.find((item) => item?.$?.rvXMLIvarName === 'RTFData')
  const plain = named.find((item) => item?.$?.rvXMLIvarName === 'PlainText')
  const preferred = rtf || plain || named[0]
  if (!preferred) return ''
  return decodeProText(nodeText(preferred) || nodeText(element))
}

function extractXmlSlideContent(slide: any): string {
  const displayElements =
    findIvar(slide, 'displayElements') ||
    slide?.displayElements ||
    slide?.array?.find?.((item: any) => item?.RVTextElement)

  const textElements = [
    ...asArray(displayElements?.RVTextElement),
    ...asArray(slide?.RVTextElement),
  ]

  return textElements
    .map(collectXmlText)
    .map((text) => text.trim())
    .filter((text) => text && !isJunkSlideText(text))
    .join('\n')
}

function extractXmlGroups(doc: any, extension: string): any[] {
  if (extension === 'pro4' || extension === 'pro5x') {
    return asArray(doc?.slides?.RVDisplaySlide)
  }

  const groupsIvar = findIvar(doc, 'groups')
  const groups = asArray(groupsIvar?.RVSlideGrouping).length
    ? asArray(groupsIvar?.RVSlideGrouping)
    : asArray(doc?.groups?.RVSlideGrouping)

  if (groups.length) return groups
  return asArray(doc?.slides?.RVDisplaySlide)
}

function extractGroupSlides(group: any): any[] {
  const slidesIvar = findIvar(group, 'slides')
  const slides = asArray(slidesIvar?.RVDisplaySlide).length
    ? asArray(slidesIvar?.RVDisplaySlide)
    : asArray(group?.slides?.RVDisplaySlide)

  if (slides.length) return slides
  if (group?.$ && (group.RVTextElement || findIvar(group, 'displayElements'))) return [group]
  return []
}

async function importProXml(xml: string, filename: string): Promise<Song[]> {
  const data = await parseStringPromise(xml, { explicitArray: true, mergeAttrs: false })
  const doc =
    data.RVPresentationDocument?.[0] ||
    data.RVPresentationDocument ||
    data.RVSongDocument?.[0] ||
    data.RVSongDocument
  if (!doc) {
    throw new Error('Not an Ember XML document')
  }

  const attrs = doc.$ || {}
  const title = attrs.CCLISongTitle || attrs.title || fileTitle(filename)
  const artist = attrs.CCLIArtistCredits || attrs.CCLIAuthor || attrs.artist
  const ccli = attrs.CCLISongNumber
  const extension = filename.split('.').pop()?.toLowerCase() || 'pro6'
  const groups = extractXmlGroups(doc, extension)
  const slides: Slide[] = []

  groups.forEach((group: any) => {
    const groupName = group?.$?.name || group?.$?.label || 'Slide'
    const groupSlides = extractGroupSlides(group)
    const targets = groupSlides.length ? groupSlides : group?.$ ? [group] : []

    targets.forEach((slideNode: any) => {
      const content = extractXmlSlideContent(slideNode)
      if (slideNode?.$?.enabled === 'false') return
      if (!content) return
      slides.push(
        makeSlide(content, slides.length, slideNode?.$?.label || groupName, slideNode?.$?.notes)
      )
    })
  })

  if (!slides.length) {
    throw new Error('No slides found in this Ember file')
  }

  return [makeSong(title, slides, { artist, ccli })]
}

function extractRtfBlocks(latin1: string): { text: string; index: number }[] {
  const blocks: { text: string; index: number }[] = []
  let searchFrom = 0

  while (searchFrom < latin1.length) {
    const start = latin1.indexOf('{\\rtf', searchFrom)
    if (start === -1) break

    let depth = 0
    let end = start
    for (let i = start; i < latin1.length; i++) {
      const ch = latin1[i]
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) {
          end = i
          break
        }
      }
    }

    const raw = latin1.slice(start, end + 1)
    const text = rtfToText(raw)
    if (text && !isJunkSlideText(text)) {
      blocks.push({ text, index: start })
    }
    searchFrom = end + 1
  }

  return blocks
}

function extractGroupTokens(latin1: string): { value: string; index: number }[] {
  const tokens: { value: string; index: number }[] = []
  const re =
    /(Verse|Chorus|Bridge|Pre-?Chorus|Intro|Outro|Tag|Ending|Interlude|Instrumental|Vamp|Refrain|Blessing|Title|Blank|Closing|Opening)(?:\s+\d+)?/gi

  let match: RegExpExecArray | null
  while ((match = re.exec(latin1))) {
    const value = match[0]
    const start = match.index
    const lengthByte = latin1.charCodeAt(start - 1)
    if (
      lengthByte === value.length ||
      lengthByte === value.length + 1 ||
      lengthByte === value.length + 2
    ) {
      if (GROUP_NAME_RE.test(value)) {
        tokens.push({ value, index: start })
      }
    }
  }
  return tokens
}

function readProtobufName(bytes: Uint8Array): string | undefined {
  if (bytes[0] !== 0x0a) return undefined
  let shift = 0
  let length = 0
  let offset = 1
  while (offset < bytes.length) {
    const byte = bytes[offset++]
    length |= (byte & 0x7f) << shift
    if ((byte & 0x80) === 0) break
    shift += 7
    if (shift > 28) return undefined
  }
  if (length <= 0 || length > 200 || offset + length > bytes.length) return undefined
  const name = new TextDecoder('utf-8').decode(bytes.slice(offset, offset + length)).trim()
  if (!name || /[^\x20-\x7E\u00A0-\uFFFF]/.test(name.slice(0, 1))) return undefined
  return name
}

function importPro7Binary(bytes: Uint8Array, filename: string): Song[] {
  const latin1 = new TextDecoder('latin1').decode(bytes)
  const rtfBlocks = extractRtfBlocks(latin1)
  if (!rtfBlocks.length) {
    throw new Error('Could not read slides from this .pro file')
  }

  const groups = extractGroupTokens(latin1)
  const events = [
    ...groups.map((token) => ({ kind: 'group' as const, ...token })),
    ...rtfBlocks.map((block) => ({ kind: 'text' as const, value: block.text, index: block.index })),
  ].sort((a, b) => a.index - b.index)

  const slides: Slide[] = []
  let currentGroup = 'Slide'
  events.forEach((event) => {
    if (event.kind === 'group') {
      currentGroup = event.value
      return
    }
    slides.push(makeSlide(event.value, slides.length, currentGroup))
  })

  const unique = slides.filter((slide, index, list) => {
    if (index === 0) return true
    return slide.content !== list[index - 1].content
  })

  return [makeSong(readProtobufName(bytes) || fileTitle(filename), unique)]
}

async function importProBundle(file: ArrayBuffer, filename: string): Promise<Song[]> {
  const zip = await JSZip.loadAsync(file)
  const songs: Song[] = []
  const entries = Object.values(zip.files).filter((entry) =>
    /\.(pro|pro6|pro5|pro5x)$/i.test(entry.name)
  )

  for (const entry of entries) {
    const bytes = await entry.async('uint8array')
    const copy = new ArrayBuffer(bytes.byteLength)
    new Uint8Array(copy).set(bytes)
    const nested = new File([copy], entry.name.split('/').pop() || entry.name)
    songs.push(...(await FileImportService.importEmberFile(nested)))
  }

  if (!songs.length) {
    throw new Error(`No presentations found in ${filename}`)
  }
  return songs
}

export class FileImportService {
  static async importEmberFile(file: File): Promise<Song[]> {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
      return importProBundle(buffer, file.name)
    }

    const head = new TextDecoder('utf-8').decode(bytes.slice(0, 400)).replace(/^\uFEFF/, '')
    const looksXml =
      head.includes('<?xml') ||
      head.includes('RVPresentationDocument') ||
      head.includes('RVSongDocument')

    if (looksXml) {
      try {
        return await importProXml(new TextDecoder('utf-8').decode(bytes), file.name)
      } catch (xmlError) {
        try {
          return importPro7Binary(bytes, file.name)
        } catch {
          throw xmlError
        }
      }
    }

    return importPro7Binary(bytes, file.name)
  }

  static async importPowerPointFile(file: File): Promise<Song[]> {
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(file)
    const slides: Slide[] = []

    const presentationXml = await zipContent.file('ppt/presentation.xml')?.async('text')
    if (!presentationXml) throw new Error('Invalid PowerPoint file')

    const presentationData = await parseStringPromise(presentationXml)
    const slideRels = presentationData['p:presentation']['p:sldIdLst']?.[0]['p:sldId'] || []

    for (let i = 0; i < slideRels.length; i++) {
      const slideContent = await zipContent.file(`ppt/slides/slide${i + 1}.xml`)?.async('text')
      if (!slideContent) continue

      const slideData = await parseStringPromise(slideContent)
      const textElements = slideData['p:sld']['p:cSld']?.[0]['p:spTree']?.[0]['p:sp'] || []
      let content = ''

      asArray(textElements).forEach((element: any) => {
        const paragraphs = element['p:txBody']?.[0]?.['a:p'] || []
        asArray(paragraphs).forEach((para: any) => {
          asArray(para['a:r']).forEach((run: any) => {
            content += run['a:t']?.[0] || ''
          })
          content += '\n'
        })
      })

      const text = content.replace(/\n+/g, '\n').trim()
      if (text) {
        slides.push(makeSlide(text, slides.length, `Slide ${slides.length + 1}`))
      }
    }

    if (!slides.length) throw new Error('No text slides found in this PowerPoint file')
    return [makeSong(fileTitle(file.name), slides)]
  }

  static async importJsonFile(file: File): Promise<Song[]> {
    const text = await file.text()
    const data = JSON.parse(text)

    if (Array.isArray(data)) {
      return data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }))
    }

    return [data]
  }

  static async importFile(file: File): Promise<Song[]> {
    const extension = file.name.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'pro':
      case 'pro6':
      case 'pro5':
      case 'pro5x':
      case 'probundle':
        return this.importEmberFile(file)
      case 'pptx':
        return this.importPowerPointFile(file)
      case 'json':
        return this.importJsonFile(file)
      default:
        throw new Error(`Unsupported file format: .${extension}`)
    }
  }
}
