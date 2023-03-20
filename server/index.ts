import * as Koa from 'koa';
import * as mount from 'koa-mount';
import { responseTimeMiddleware } from '../responseMiddleware';
import { init as entries } from './entries.service';
import type { Config } from '../config'
import { PrismaClient } from '@prisma/client';

export const init = (config: Config) => {
    const prisma = new PrismaClient();
    const app = new Koa();
    app.use(responseTimeMiddleware)
    app.use(mount('/bujo', entries(prisma)));
    app.listen(config.http.port, undefined, undefined, () =>
        console.log(`🚀 Server ready at: http://localhost:${config.http.port}`))
}


