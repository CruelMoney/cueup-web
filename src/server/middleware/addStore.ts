import { RequestHandler } from 'express';
import { configureStore } from '../../shared/store';

const addStore: RequestHandler = (req, res, next): void => {
    res.locals.store = configureStore({}, req);
    next();
};

export default addStore;
