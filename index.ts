import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express';
import { init as server } from './server';
import { config } from './config';


(async () => {
    server(config)
})()
