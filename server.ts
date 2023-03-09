import { PrismaClient, Prisma } from '@prisma/client'
import { responseTimeMiddleware } from './responseMiddleware';
import express, { Request, Response } from 'express';
import type { Config } from './config'

type Entry = {
  id: number,
  text: string,
  entry_type: string,
  completed: boolean,
  priority: boolean,
  created_timestamp: string,
  modified_timestamp: string,
} 

const serializeResponse = (entry: any): Entry => {
  return {
    ...entry,
    created_timestamp: entry.created_timestamp.toString(),
    modified_timestamp: entry.modified_timestamp.toString()
  } 
}

export const init = (config: Config) => {
  const prisma = new PrismaClient()
  const app = express()

  app.use(express.json())
  app.use(responseTimeMiddleware)

  app.get(`/entries`, async (req: Request, res: Response) => {
    try {
      const entries = await prisma.entries.findMany()
      const serializedEntries = entries.map((entry:any) => serializeResponse(entry))
      res.json(serializedEntries)
    } catch(err: unknown) {
      res.status(500)
      res.json(err)
    }
  })

  app.post(`/entry`, async (req: Request, res: Response) => {
    const { text } = req.body
    const entry = await prisma.entries.create({
      data: {
        text
      }
    })

    res.json(serializeResponse(entry))
  })

  app.put(`/entry/:entryId`, async (req: Request, res: Response) => {
    const entryId = req.params.entryId
    const { text, completed } = req.body
    const result = await prisma.entries.update({
      where: {
        id: Number(entryId)
      },
      data: {
        text,
        completed
      }
    })
    res.json(serializeResponse(result))
  })

  app.delete(`/entry/:entryId`, async (req: Request, res: Response) => {
    const entryId = req.params.entryId
    const result = await prisma.entries.delete({
      where: {
        id: Number(entryId)
      },
    })
    res.json(result)
  })
  app.listen(config.http.port, () =>
    console.log(`🚀 Server ready at: http://localhost:${config.http.port}`))
}

