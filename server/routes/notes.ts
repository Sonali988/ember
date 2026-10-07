import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

async function ensureService(prisma: PrismaClient, serviceOrderId?: string) {
  if (serviceOrderId) {
    const existing = await prisma.serviceOrder.findUnique({ where: { id: serviceOrderId } })
    if (existing) return existing
  }

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const today = await prisma.serviceOrder.findFirst({
    where: { name: 'Live Service', date: { gte: start } },
    orderBy: { createdAt: 'desc' },
  })
  if (today) return today

  return prisma.serviceOrder.create({
    data: { name: 'Live Service', date: new Date() },
  })
}

export const noteRoutes = (prisma: PrismaClient) => {
  const router = Router()

  router.get('/', async (req: Request, res: Response) => {
    try {
      const serviceOrderId = String(req.query.serviceOrderId || '')
      const notes = await prisma.note.findMany({
        where: serviceOrderId ? { serviceOrderId } : undefined,
        orderBy: { timestamp: 'desc' },
        take: 50,
      })
      res.json({ success: true, data: notes })
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : error })
    }
  })

  router.post('/', async (req: Request, res: Response) => {
    try {
      const content = String(req.body.content || '')
      const service = await ensureService(prisma, req.body.serviceOrderId)
      const note = req.body.id
        ? await prisma.note.update({
            where: { id: req.body.id },
            data: { content, timestamp: new Date() },
          })
        : await prisma.note.create({
            data: { content, serviceOrderId: service.id },
          })
      res.json({ success: true, data: note })
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : error })
    }
  })

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const note = await prisma.note.update({
        where: { id: req.params.id },
        data: { content: String(req.body.content || ''), timestamp: new Date() },
      })
      res.json({ success: true, data: note })
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : error })
    }
  })

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await prisma.note.delete({ where: { id: req.params.id } })
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : error })
    }
  })

  return router
}
