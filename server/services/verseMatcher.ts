import { USFM_BOOKS, type ParsedReference } from './verseParser'

interface KjvBook {
  abbrev: string
  chapters: string[][]
}

const STOP = new Set(
  'a an the of and to in for that is was he she it his her they them their this those with from as by or on at be not you your we our but if so do did has have had'.split(
    ' '
  )
)

let corpus: { ref: ParsedReference; words: Set<string> }[] | null = null
let loading: Promise<void> | null = null

async function loadCorpus() {
  if (corpus) return
  if (!loading) {
    loading = (async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json'
      )
      if (!response.ok) throw new Error('Could not load verse index')
      const books = (await response.json()) as KjvBook[]
      const rows: { ref: ParsedReference; words: Set<string> }[] = []
      books.forEach((book, bookIndex) => {
        const usfm = USFM_BOOKS[bookIndex]
        if (!usfm) return
        book.chapters.forEach((chapter, chapterIndex) => {
          chapter.forEach((text, verseIndex) => {
            const words = tokenize(text)
            if (words.size < 4) return
            rows.push({
              ref: {
                usfm: `${usfm}.${chapterIndex + 1}.${verseIndex + 1}`,
                book: usfm,
                chapter: chapterIndex + 1,
                startVerse: verseIndex + 1,
                endVerse: verseIndex + 1,
              },
              words,
            })
          })
        })
      })
      corpus = rows
    })()
  }
  await loading
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP.has(word))
  )
}

export async function matchSpokenVerse(text: string): Promise<(ParsedReference & { confidence: number }) | null> {
  const query = tokenize(text)
  if (query.size < 4) return null
  await loadCorpus()
  if (!corpus) return null

  let best: { ref: ParsedReference; score: number } | null = null
  for (const row of corpus) {
    let overlap = 0
    query.forEach((word) => {
      if (row.words.has(word)) overlap++
    })
    const score = overlap / query.size
    if (!best || score > best.score) best = { ref: row.ref, score }
  }

  if (!best || best.score < 0.62 || query.size < 5) return null
  return { ...best.ref, confidence: Number(best.score.toFixed(2)) }
}
