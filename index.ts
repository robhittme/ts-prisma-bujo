import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express';
import { responseTimeMiddleware } from './responseMiddleware';

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(responseTimeMiddleware)

app.get(`/entries`, async (req: Request, res: Response) => {
  const entries = await prisma.entries.findMany()
  const serializedEntries = entries.map((entry) => ({
    ...entry,
    created_timestamp: entry.created_timestamp.toString(),
    modified_timestamp: entry.modified_timestamp.toString()
  }))
  res.json(serializedEntries)
})
app.post(`/entry`, async (req: Request, res: Response) => {
  const { text } = req.body
  const result = await prisma.entries.create({
    data: {
      text,
    }
  })
  res.json(result)
})

const server = app.listen(3000, () =>
  console.log("🚀 Server ready at: http://localhost:3000"))
