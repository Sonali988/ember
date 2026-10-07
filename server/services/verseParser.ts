export interface ParsedReference {
  usfm: string
  book: string
  chapter: number
  startVerse: number
  endVerse: number
}

const BOOKS: { usfm: string; title: string; names: string[] }[] = [
  { usfm: 'GEN', title: 'Genesis', names: ['genesis', 'gen', 'gn', 'उत्पत्ति'] },
  { usfm: 'EXO', title: 'Exodus', names: ['exodus', 'exod', 'exo', 'ex', 'निर्गमन'] },
  { usfm: 'LEV', title: 'Leviticus', names: ['leviticus', 'lev', 'lv', 'लैव्यव्यवस्था'] },
  { usfm: 'NUM', title: 'Numbers', names: ['numbers', 'num', 'nm', 'गिनती'] },
  { usfm: 'DEU', title: 'Deuteronomy', names: ['deuteronomy', 'deut', 'deu', 'dt', 'व्यवस्थाविवरण'] },
  { usfm: 'JOS', title: 'Joshua', names: ['joshua', 'josh', 'jos', 'यहोशू'] },
  { usfm: 'JDG', title: 'Judges', names: ['judges', 'judg', 'jdg', 'न्यायियों'] },
  { usfm: 'RUT', title: 'Ruth', names: ['ruth', 'rut', 'ru', 'रूत'] },
  { usfm: '1SA', title: '1 Samuel', names: ['1 samuel', '1samuel', '1 sam', '1sam', 'i samuel', 'first samuel', '1 शमूएल'] },
  { usfm: '2SA', title: '2 Samuel', names: ['2 samuel', '2samuel', '2 sam', '2sam', 'ii samuel', 'second samuel', '2 शमूएल'] },
  { usfm: '1KI', title: '1 Kings', names: ['1 kings', '1kings', '1 kgs', '1ki', 'i kings', 'first kings', '1 राजा'] },
  { usfm: '2KI', title: '2 Kings', names: ['2 kings', '2kings', '2 kgs', '2ki', 'ii kings', 'second kings', '2 राजा'] },
  { usfm: '1CH', title: '1 Chronicles', names: ['1 chronicles', '1chronicles', '1 chr', '1ch', 'i chronicles', '1 इतिहास'] },
  { usfm: '2CH', title: '2 Chronicles', names: ['2 chronicles', '2chronicles', '2 chr', '2ch', 'ii chronicles', '2 इतिहास'] },
  { usfm: 'EZR', title: 'Ezra', names: ['ezra', 'ezr', 'एज्रा'] },
  { usfm: 'NEH', title: 'Nehemiah', names: ['nehemiah', 'neh', 'नहेमायाह'] },
  { usfm: 'EST', title: 'Esther', names: ['esther', 'est', 'एस्तेर'] },
  { usfm: 'JOB', title: 'Job', names: ['job', 'jb', 'अय्यूब'] },
  { usfm: 'PSA', title: 'Psalm', names: ['psalms', 'psalm', 'psa', 'ps', 'psm', 'भजन संहिता', 'भजन'] },
  { usfm: 'PRO', title: 'Proverbs', names: ['proverbs', 'prov', 'pro', 'prv', 'नीतिवचन'] },
  { usfm: 'ECC', title: 'Ecclesiastes', names: ['ecclesiastes', 'eccl', 'ecc', 'सभोपदेशक'] },
  { usfm: 'SNG', title: 'Song of Solomon', names: ['song of solomon', 'song of songs', 'song', 'sos', 'sng', 'श्रेष्ठगीत'] },
  { usfm: 'ISA', title: 'Isaiah', names: ['isaiah', 'isa', 'is', 'यशायाह'] },
  { usfm: 'JER', title: 'Jeremiah', names: ['jeremiah', 'jer', 'jr', 'यिर्मयाह'] },
  { usfm: 'LAM', title: 'Lamentations', names: ['lamentations', 'lam', 'विलापगीत'] },
  { usfm: 'EZK', title: 'Ezekiel', names: ['ezekiel', 'ezek', 'ezk', 'यहेजकेल'] },
  { usfm: 'DAN', title: 'Daniel', names: ['daniel', 'dan', 'dn', 'दानिय्येल'] },
  { usfm: 'HOS', title: 'Hosea', names: ['hosea', 'hos', 'होशे'] },
  { usfm: 'JOL', title: 'Joel', names: ['joel', 'jol', 'योएल'] },
  { usfm: 'AMO', title: 'Amos', names: ['amos', 'amo', 'am', 'आमोस'] },
  { usfm: 'OBA', title: 'Obadiah', names: ['obadiah', 'obad', 'oba', 'ओबद्दाह'] },
  { usfm: 'JON', title: 'Jonah', names: ['jonah', 'jon', 'योना'] },
  { usfm: 'MIC', title: 'Micah', names: ['micah', 'mic', 'मीका'] },
  { usfm: 'NAM', title: 'Nahum', names: ['nahum', 'nam', 'नहूम'] },
  { usfm: 'HAB', title: 'Habakkuk', names: ['habakkuk', 'hab', 'हबक्कूक'] },
  { usfm: 'ZEP', title: 'Zephaniah', names: ['zephaniah', 'zeph', 'zep', 'सपन्याह'] },
  { usfm: 'HAG', title: 'Haggai', names: ['haggai', 'hag', 'हाग्गै'] },
  { usfm: 'ZEC', title: 'Zechariah', names: ['zechariah', 'zech', 'zec', 'जकर्याह'] },
  { usfm: 'MAL', title: 'Malachi', names: ['malachi', 'mal', 'मलाकी'] },
  { usfm: 'MAT', title: 'Matthew', names: ['matthew', 'matt', 'mat', 'mt', 'मत्ती'] },
  { usfm: 'MRK', title: 'Mark', names: ['mark', 'mrk', 'mk', 'मरकुस'] },
  { usfm: 'LUK', title: 'Luke', names: ['luke', 'luk', 'lk', 'लूका'] },
  { usfm: 'JHN', title: 'John', names: ['john', 'jhn', 'jn', 'joh', 'यूहन्ना'] },
  { usfm: 'ACT', title: 'Acts', names: ['acts', 'act', 'ac', 'प्रेरितों'] },
  { usfm: 'ROM', title: 'Romans', names: ['romans', 'rom', 'ro', 'रोमियों'] },
  { usfm: '1CO', title: '1 Corinthians', names: ['1 corinthians', '1corinthians', '1 cor', '1cor', '1co', 'i corinthians', 'first corinthians', '1 कुरिन्थियों'] },
  { usfm: '2CO', title: '2 Corinthians', names: ['2 corinthians', '2corinthians', '2 cor', '2cor', '2co', 'ii corinthians', 'second corinthians', '2 कुरिन्थियों'] },
  { usfm: 'GAL', title: 'Galatians', names: ['galatians', 'gal', 'गलातियों'] },
  { usfm: 'EPH', title: 'Ephesians', names: ['ephesians', 'eph', 'इफिसियों'] },
  { usfm: 'PHP', title: 'Philippians', names: ['philippians', 'phil', 'php', 'फिलिप्पियों'] },
  { usfm: 'COL', title: 'Colossians', names: ['colossians', 'col', 'कुलुस्सियों'] },
  { usfm: '1TH', title: '1 Thessalonians', names: ['1 thessalonians', '1thessalonians', '1 thess', '1thess', '1th', 'i thessalonians', '1 थिस्सलुनीकियों'] },
  { usfm: '2TH', title: '2 Thessalonians', names: ['2 thessalonians', '2thessalonians', '2 thess', '2thess', '2th', 'ii thessalonians', '2 थिस्सलुनीकियों'] },
  { usfm: '1TI', title: '1 Timothy', names: ['1 timothy', '1timothy', '1 tim', '1tim', '1ti', 'i timothy', 'first timothy', '1 तीमुथियुस'] },
  { usfm: '2TI', title: '2 Timothy', names: ['2 timothy', '2timothy', '2 tim', '2tim', '2ti', 'ii timothy', 'second timothy', '2 तीमुथियुस'] },
  { usfm: 'TIT', title: 'Titus', names: ['titus', 'tit', 'तीतुस'] },
  { usfm: 'PHM', title: 'Philemon', names: ['philemon', 'phlm', 'phm', 'फिलेमोन'] },
  { usfm: 'HEB', title: 'Hebrews', names: ['hebrews', 'heb', 'इब्रानियों'] },
  { usfm: 'JAS', title: 'James', names: ['james', 'jas', 'jm', 'याकूब'] },
  { usfm: '1PE', title: '1 Peter', names: ['1 peter', '1peter', '1 pet', '1pet', '1pe', 'i peter', 'first peter', '1 पतरस'] },
  { usfm: '2PE', title: '2 Peter', names: ['2 peter', '2peter', '2 pet', '2pet', '2pe', 'ii peter', 'second peter', '2 पतरस'] },
  { usfm: '1JN', title: '1 John', names: ['1 john', '1john', '1 jn', '1jn', 'i john', 'first john', '1 यूहन्ना'] },
  { usfm: '2JN', title: '2 John', names: ['2 john', '2john', '2 jn', '2jn', 'ii john', 'second john', '2 यूहन्ना'] },
  { usfm: '3JN', title: '3 John', names: ['3 john', '3john', '3 jn', '3jn', 'iii john', 'third john', '3 यूहन्ना'] },
  { usfm: 'JUD', title: 'Jude', names: ['jude', 'jud', 'यहूदा'] },
  { usfm: 'REV', title: 'Revelation', names: ['revelation', 'revelations', 'rev', 're', 'प्रकाशितवाक्य'] },
]

const aliases = BOOKS.flatMap((book) =>
  book.names.map((name) => ({ usfm: book.usfm, title: book.title, name }))
).sort((a, b) => b.name.length - a.name.length)

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function parseReference(text: string): ParsedReference | null {
  const source = text.replace(/(\p{L})\.(?=\s|\p{L}|$)/gu, '$1')
  let best: { index: number; ref: ParsedReference } | null = null

  for (const alias of aliases) {
    const pattern = new RegExp(
      `(?:^|[^\\p{L}\\p{N}])(${escapeRegExp(alias.name)})\\s+(\\d{1,3})\\s*[:.]\\s*(\\d{1,3})(?:\\s*[-–—]\\s*(\\d{1,3}))?`,
      'giu'
    )
    for (const match of source.matchAll(pattern)) {
      const index = match.index ?? 0
      if (best && index <= best.index) continue
      const chapter = Number(match[2])
      const startVerse = Number(match[3])
      const endVerse = match[4] ? Number(match[4]) : startVerse
      if (!chapter || !startVerse) continue
      const versePart = endVerse !== startVerse ? `${startVerse}-${endVerse}` : `${startVerse}`
      best = {
        index,
        ref: {
          usfm: `${alias.usfm}.${chapter}.${versePart}`,
          book: alias.title,
          chapter,
          startVerse,
          endVerse,
        },
      }
    }
  }

  return best?.ref ?? null
}

export const USFM_BOOKS = BOOKS.map((book) => book.usfm)
