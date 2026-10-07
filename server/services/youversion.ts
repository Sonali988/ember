const API = 'https://api.youversion.com/v1'

export const EN_VERSION_ID = Number(process.env.YVP_EN_VERSION_ID || 1588)
export const HI_VERSION_ID = Number(process.env.YVP_HI_VERSION_ID || 819)

function appKey(): string {
  const key = process.env.YVP_APP_KEY
  if (!key) throw new Error('YVP_APP_KEY is not set')
  return key
}

async function yv<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { 'X-YVP-App-Key': appKey(), Accept: 'application/json' },
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`YouVersion ${response.status}: ${body.slice(0, 240)}`)
  }
  return response.json() as Promise<T>
}

export interface YvPassage {
  id: string
  content: string
  reference: string
}

export interface YvVersion {
  id: number
  abbreviation?: string
  copyright?: string
  title?: string
}

const versionCache = new Map<number, YvVersion>()

export async function getVersion(versionId: number): Promise<YvVersion> {
  const cached = versionCache.get(versionId)
  if (cached) return cached
  const version = await yv<YvVersion>(`/bibles/${versionId}`)
  versionCache.set(versionId, version)
  return version
}

export async function getPassage(versionId: number, usfm: string): Promise<YvPassage> {
  const passage = await yv<YvPassage>(
    `/bibles/${versionId}/passages/${encodeURIComponent(usfm)}?format=text`
  )
  return {
    ...passage,
    content: passage.content.replace(/<[^>]+>/g, '').trim(),
  }
}

export async function getPassageBoth(usfm: string) {
  const [en, hi, enVersion, hiVersion] = await Promise.all([
    getPassage(EN_VERSION_ID, usfm),
    getPassage(HI_VERSION_ID, usfm),
    getVersion(EN_VERSION_ID).catch(() => ({ id: EN_VERSION_ID, copyright: 'AMP' })),
    getVersion(HI_VERSION_ID).catch(() => ({ id: HI_VERSION_ID, copyright: 'HHBD' })),
  ])

  return {
    textEN: en.content,
    textHI: hi.content,
    reference: en.reference || usfm,
    attributionEN: enVersion.copyright || enVersion.abbreviation || 'AMP',
    attributionHI: hiVersion.copyright || hiVersion.abbreviation || 'HHBD',
  }
}
