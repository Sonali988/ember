import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export const songRoutes = (prisma: PrismaClient) => {
  const router = Router()

  // Get all songs
  router.get('/', async (req: Request, res: Response) => {
    try {
      const songs = await prisma.song.findMany({
        include: {
          verses: true,
          slides: true,
        },
        orderBy: { order: 'asc' },
      })

      const formatted = songs.map((song) => ({
        ...song,
        slides: song.slides.map((slide) => ({
          ...slide,
          textStyle: JSON.parse(slide.textStyle),
          backgroundColor: slide.backgroundColor ? {
            type: slide.backgroundColor,
            value: slide.backgroundValue || '',
            opacity: slide.backgroundOpacity,
          } : undefined,
        })),
      }))

      res.json({ success: true, data: formatted })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  // Get single song
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const song = await prisma.song.findUnique({
        where: { id: req.params.id },
        include: {
          verses: true,
          slides: true,
        },
      })

      if (!song) {
        return res.status(404).json({ success: false, error: 'Song not found' })
      }

      const formatted = {
        ...song,
        slides: song.slides.map((slide) => ({
          ...slide,
          textStyle: JSON.parse(slide.textStyle),
        })),
      }

      res.json({ success: true, data: formatted })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  // Create song
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { title, artist, ccli, verses, slides } = req.body

      const song = await prisma.song.create({
        data: {
          title,
          artist,
          ccli,
          order: 0,
          verses: {
            createMany: {
              data: verses.map((v: any) => ({
                type: v.type,
                number: v.number,
                content: v.content,
              })),
            },
          },
          slides: {
            createMany: {
              data: slides.map((s: any) => ({
                title: s.title,
                content: s.content,
                textStyle: JSON.stringify(s.textStyle),
                backgroundColor: s.backgroundColor?.type,
                backgroundValue: s.backgroundColor?.value,
                backgroundOpacity: s.backgroundColor?.opacity || 1,
                notes: s.notes,
                order: s.order,
              })),
            },
          },
        },
        include: { verses: true, slides: true },
      })

      res.json({ success: true, data: song })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  // Update song
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const song = await prisma.song.update({
        where: { id: req.params.id },
        data: req.body,
        include: { verses: true, slides: true },
      })

      res.json({ success: true, data: song })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  // Delete song
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await prisma.song.delete({
        where: { id: req.params.id },
      })

      res.json({ success: true, message: 'Song deleted' })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  return router
}
