import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { songRoutes } from './routes/songs'
import { serviceOrderRoutes } from './routes/serviceOrders'
import { announcementRoutes } from './routes/announcements'
import { scriptureRoutes } from './routes/scriptures'
import { mediaRoutes } from './routes/media'
import { importRoutes } from './routes/import'
import { noteRoutes } from './routes/notes'
import { verseDetectionRoutes } from './routes/verseDetection'

config()

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Routes
app.use('/api/songs', songRoutes(prisma))
app.use('/api/service-orders', serviceOrderRoutes(prisma))
app.use('/api/announcements', announcementRoutes(prisma))
app.use('/api/scriptures', scriptureRoutes(prisma))
app.use('/api/media', mediaRoutes(prisma))
app.use('/api/import', importRoutes(prisma))
app.use('/api/notes', noteRoutes(prisma))
app.use('/api/verse-detection', verseDetectionRoutes(prisma))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
