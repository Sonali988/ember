import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export const serviceOrderRoutes = (prisma: PrismaClient) => {
  const router = Router()

  // Get all service orders
  router.get('/', async (req: Request, res: Response) => {
    try {
      const orders = await prisma.serviceOrder.findMany({
        include: { items: true },
        orderBy: { date: 'desc' },
      })
      res.json({ success: true, data: orders })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  // Create service order
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { name, date, items } = req.body

      const order = await prisma.serviceOrder.create({
        data: {
          name,
          date: new Date(date),
          items: {
            createMany: {
              data: items.map((item: any) => ({
                type: item.type,
                songId: item.songId,
                announcementId: item.announcementId,
                scriptureId: item.scriptureId,
                mediaId: item.mediaId,
                duration: item.duration,
                notes: item.notes,
                order: item.order,
              })),
            },
          },
        },
        include: { items: true },
      })

      res.json({ success: true, data: order })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  // Delete service order
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await prisma.serviceOrder.delete({
        where: { id: req.params.id },
      })
      res.json({ success: true, message: 'Service order deleted' })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  })

  return router
}
