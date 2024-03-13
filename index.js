import dotenv from 'dotenv';
import express from "express";
import dbConnection from "./DB/dbConnection.js";
import { appRouter } from "./app.router.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
dbConnection();
appRouter(app, express);
app.listen(port, () => console.log(`Server is listening on port ${port}`));
