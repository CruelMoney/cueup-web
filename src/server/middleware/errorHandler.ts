import path from 'path';
import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err: Error, _req: any, res, _next) =>
    res.status(404).json({
        status: 'error',
        message: err.message,
        stack:
            // print a nicer stack trace by splitting line breaks and making them array items
            process.env.NODE_ENV === 'development' &&
            (err.stack || '')
                .split('\n')
                .map((line: string) => line.trim())
                .map((line: string) => line.split(path.sep).join('/'))
                .map((line: string) => line.replace(process.cwd().split(path.sep).join('/'), '.')),
    });

export default errorHandler;
