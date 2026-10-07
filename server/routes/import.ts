import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { FileImportService } from '../../src/services/fileImport'

export const importRoutes = (prisma: PrismaClient) => {
  const router = Router()

  router.post('/propresenter', async (req: Request, res: Response) => {
    try {
      // File would be extracted from multipart form data
      const songs = req.body.songs || []
      
      // Save to database
      const created = await Promise.all(
        songs.map((song: any) =>
          prisma.song.create({
            data: {
              title: song.title,
              artist: song.artist,
              ccli: song.ccli,
              verses: {
                createMany: {
                  data: song.verses,
                },
              },
              slides: {
                createMany: {
                  data: song.slides.map((s: any) => ({
                    title: s.title,
                    content: s.content,
                    textStyle: JSON.stringify(s.textStyle),
                    order: s.order,
                  })),
                },
              },
            },
          })
        )
      )

      res.json({ success: true, data: { songs: created } })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  router.post('/powerpoint', async (req: Request, res: Response) => {
    try {
      const songs = req.body.songs || []
      
      const created = await Promise.all(
        songs.map((song: any) =>
          prisma.song.create({
            data: {
              title: song.title,
              slides: {
                createMany: {
                  data: song.slides.map((s: any) => ({
                    title: s.title,
                    content: s.content,
                    textStyle: JSON.stringify(s.textStyle),
                    order: s.order,
                  })),
                },
              },
            },
          })
        )
      )

      res.json({ success: true, data: { songs: created } })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  return router
}
