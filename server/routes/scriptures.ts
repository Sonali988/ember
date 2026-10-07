import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export const scriptureRoutes = (prisma: PrismaClient) => {
  const router = Router()

  router.get('/', async (req: Request, res: Response) => {
    try {
      const scriptures = await prisma.scripture.findMany()
      res.json({ success: true, data: scriptures })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  router.post('/', async (req: Request, res: Response) => {
    try {
      const scripture = await prisma.scripture.create({
        data: {
          book: req.body.book,
          chapter: req.body.chapter,
          startVerse: req.body.startVerse,
          endVerse: req.body.endVerse,
          text: req.body.text,
          translation: req.body.translation || 'NIV',
          textStyle: JSON.stringify(req.body.textStyle),
          backgroundColor: req.body.backgroundColor?.type,
          backgroundValue: req.body.backgroundColor?.value,
        },
      })
      res.json({ success: true, data: scripture })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await prisma.scripture.delete({ where: { id: req.params.id } })
      res.json({ success: true, message: 'Scripture deleted' })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  return router
}
