import * as Koa from 'koa';
import { Context, DefaultState } from 'koa';
import * as Router from '@koa/router';
import * as cors from '@koa/cors';

type Entry = {
  id: number,
  text: string,
  entry_type: string,
  completed: boolean,
  priority: boolean,
  created_timestamp: string,
  modified_timestamp: string,
} 

type Collection = {
  name: string
}

const serializeResponse = (entry: any): Entry => {
  return {
    ...entry,
    created_timestamp: entry.created_timestamp.toString(),
    modified_timestamp: entry.modified_timestamp.toString()
  } 
}
const entryTypeConverter = (text: string): Array<string> => {
  const [sym, ...rest] = text.split('');
  switch(sym) {
    case '.':
      return ['task', rest.join('').trim()]
    case 'o':
      return ['event', rest.join('').trim()]
    case '-':
      return ['note', rest.join('').trim()]
  }
  return ['task', text];
}

export const init = (prisma: any): Koa => {

  const app = new Koa();

  const router = new Router<DefaultState, Context>();
  router.get(`/entries`, async (ctx: Koa.Context) => {
    try {
      const entries = await prisma.entries.findMany()
      const serializedEntries = entries.map((entry:any) => serializeResponse(entry))
      ctx.response.body = serializedEntries
      ctx.response.status = 200 
    } catch(err: unknown) {
      ctx.response.body = err
      ctx.response.status = 200 
    }
  })

  router.post(`/entry`, async (ctx: Koa.Context) => {
    const { text }= ctx.request.body as Entry
    const [entryType, txt] = entryTypeConverter(text);
    const entry = await prisma.entries.create({
      data: {
        text: txt,
        entry_type: entryType
      }
    })

    ctx.response.body = serializeResponse(entry)
    ctx.response.status = 200 
  })

  router.put(`/entry/:entryId`, async (ctx: Koa.Context) => {
    const entryId = ctx.params.entryId
    const { text, completed } = ctx.Request.body
    const result = await prisma.entries.update({
      where: {
        id: Number(entryId)
      },
      data: {
        text,
        completed
      }
    })
    ctx.resonse.body = serializeResponse(result)
    ctx.resonse.status = 200 
  })

  router.delete(`/entry/:entryId`, async (ctx: Koa.Context) => {
    const entryId = ctx.params.entryId
    const result = await prisma.entries.delete({
      where: {
        id: Number(entryId)
      },
    })
    ctx.resonse.body = serializeResponse(result)
    ctx.resonse.status = 200 
  })
  router.post('/collection/:collectionId/entry', async (ctx: Koa.Context) => {
    try {
      const collectionId = ctx.params.collectionId; 
      const { text } = ctx.request.body as Entry;
      const newEntryInCollection = await prisma.list_item.create({
        data: {
          text,
          collectionId: Number(collectionId)
        }
      })
      ctx.response.body = newEntryInCollection 
      ctx.response.status = 200;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = error;
      console.log(error)
    }

  })

  router.post('/collection', async (ctx: Koa.Context) => {
    try {
      const {name}= ctx.request.body as Collection;
      const newEntry = await prisma.collections.create({
        data: {
          name
        }
      })
      ctx.response.body = newEntry;
      ctx.response.status = 200;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = error;
      console.log(error)
    }

  })
  app.use(cors())
    //.use(authorizationMiddleware(db))
    //.use(authenticationMiddleware)
    .use(require('koa-bodyparser')())
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
}


