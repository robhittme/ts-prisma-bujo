import express, { Request, Response, NextFunction } from 'express';

const hostname = require('os').hostname();

const humanReadable: (n: number) => string = (() => {
    const prefixes: {[key: string]: string} = {
          '24': 'Y',
          '21': 'Z',
          '18': 'E',
          '15': 'P',
          '12': 'T',
          '9': 'G',
          '6': 'M',
          '3': 'K',
          '0': '',
          '-3': 'm',
          '-6': 'μ',
          '-9': 'n',
          '-12': 'p',
          '-15': 'f',
          '-18': 'a',
          '-21': 'z',
          '-24': 'y'
        };

    return (n: number): string => {
          if(!n) { return '0' };
          let value = Number.parseFloat(n.toPrecision(3));
          let exponent = Math.max(Math.min(
                                                3 * Math.floor(
                                                  Math.floor(Math.log10(Math.abs(value)))/3
                                                ),
            24),
            -24);
      return `${Number.parseFloat((value / Math.pow(10, exponent)).toPrecision(3))}${prefixes[exponent.toString()]}`;

    }
})();

const requestCounter = ((value: number = 0) => () => ++value)(0);

export const responseTimeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const requestId = requestCounter();
  const start = Date.now();

  console.log(`--> ${start} ${hostname} ${process.pid} ${requestId} ${req.method} ${req.url}`);

  res.on('finish', () => {
    const ms = Date.now() - start
    const rt = `${ms}ms`
    const size = humanReadable(Number(res.get('Content-Length')) || 0)
    console.log(`<-- ${start} ${hostname} ${process.pid} ${requestId} ${req.method} ${req.url} ${rt} ${size}B`)
  })

  next();
};

