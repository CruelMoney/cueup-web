import fetch from 'node-fetch';

const clearDB = async (_req, res) => {
    const API_URL = process.env.REACT_APP_CUEUP_GQL_DOMAIN;
    await fetch(API_URL + '/clearDB', { method: 'POST' });
    return res.sendStatus(200);
};

const addTestEndpoints = (app) => {
    app.post('/test/clearDB', clearDB);
};

export default addTestEndpoints;
