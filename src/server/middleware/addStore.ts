import * as express from 'express';
import { configureStore } from '../../shared/store';

const addStore = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void => {
    res.locals.store = configureStore({}, req);
    next();
};

export default addStore;
