import express from "express";
import { appRouter } from "./app.router.js";
import dbConnection from "./DB/dbConnection.js";

const app = express();
const port = process.env.PORT || 3000;
dbConnection();
appRouter(app, express);
app.listen(port, () => console.log(`Server is listening on port ${port}`));
