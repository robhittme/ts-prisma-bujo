import { init as server } from './server';
import { config } from './config';
import prisma from './lib/prisma';

(async () => {
    server(config)
})()
