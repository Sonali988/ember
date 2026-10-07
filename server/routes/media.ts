import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export const mediaRoutes = (prisma: PrismaClient) => {
  const router = Router()

  router.get('/', async (req: Request, res: Response) => {
    try {
      const media = await prisma.mediaFile.findMany()
      res.json({ success: true, data: media })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  // File upload would be handled by a file storage service
  router.post('/upload', async (req: Request, res: Response) => {
    try {
      const mediaFile = await prisma.mediaFile.create({
        data: {
          name: req.body.name,
          path: req.body.path,
          type: req.body.type,
          duration: req.body.duration,
        },
      })
      res.json({ success: true, data: mediaFile })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await prisma.mediaFile.delete({ where: { id: req.params.id } })
      res.json({ success: true, message: 'Media deleted' })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  return router
}
