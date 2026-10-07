import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export const announcementRoutes = (prisma: PrismaClient) => {
  const router = Router()

  router.get('/', async (req: Request, res: Response) => {
    try {
      const announcements = await prisma.announcement.findMany()
      res.json({ success: true, data: announcements })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  router.post('/', async (req: Request, res: Response) => {
    try {
      const announcement = await prisma.announcement.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          textStyle: JSON.stringify(req.body.textStyle),
          backgroundColor: req.body.backgroundColor?.type,
          backgroundValue: req.body.backgroundColor?.value,
          duration: req.body.duration || 10,
        },
      })
      res.json({ success: true, data: announcement })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await prisma.announcement.delete({ where: { id: req.params.id } })
      res.json({ success: true, message: 'Announcement deleted' })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  return router
}
