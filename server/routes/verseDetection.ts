import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { parseReference } from '../services/verseParser'
import { matchSpokenVerse } from '../services/verseMatcher'
import { getPassageBoth } from '../services/youversion'

export const verseDetectionRoutes = (prisma: PrismaClient) => {
  const router = Router()

  router.post('/', async (req: Request, res: Response) => {
    try {
      const text = String(req.body.text || '').trim()
      if (!text) {
        res.status(400).json({ success: false, error: 'text is required' })
        return
      }

      const parsed = parseReference(text)
      const fuzzy = parsed ? null : await matchSpokenVerse(text).catch(() => null)
      const found = parsed || fuzzy
      if (!found) {
        res.json({ success: true, data: null, message: 'No verse detected' })
        return
      }

      const passage = await getPassageBoth(found.usfm)
      const detected = {
        reference: passage.reference,
        usfm: found.usfm,
        book: parsed?.book || found.book,
        chapter: found.chapter,
        startVerse: found.startVerse,
        endVerse: found.endVerse,
        textEN: passage.textEN,
        textHI: passage.textHI,
        attributionEN: passage.attributionEN,
        attributionHI: passage.attributionHI,
        confidence: parsed ? 1 : fuzzy?.confidence || 0,
        matchType: parsed ? 'reference' : 'text',
        rawSpeech: text,
      }

      let saved = detected
      if (req.body.serviceOrderId) {
        try {
          const row = await prisma.verseDetection.create({
            data: {
              reference: detected.reference,
              book: detected.book,
              chapter: detected.chapter,
              startVerse: detected.startVerse,
              endVerse: detected.endVerse,
              textEN: detected.textEN,
              textHI: detected.textHI,
              rawSpeech: text,
              detectedFromSpeech: true,
              confidence: detected.confidence,
              serviceOrderId: req.body.serviceOrderId,
            },
          })
          saved = { ...detected, id: row.id }
        } catch (error) {
          console.error('Verse detection was not saved', error)
        }
      }

      res.json({ success: true, data: saved })
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : error })
    }
  })

  return router
}
