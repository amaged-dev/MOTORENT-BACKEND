import express from 'express';
const app = express();
const port = 3000;
import { appRouter } from './app.router.js';
import dbConnection from './DB/dbConnection.js';

dbConnection();
appRouter(app, express);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));