import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

const API_URL = process.env.REACT_APP_CUEUP_GQL_DOMAIN;
const target = API_URL;
console.log({ target });
const apiProxy = createProxyMiddleware({ target });

const addTestEndpoints = (app) => {
    app.use('/test', apiProxy);
};

export default addTestEndpoints;
