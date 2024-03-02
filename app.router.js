import AppError from "./src/utils/appError.js";
import carRouter from "./src/modules/car/car.routes.js";
import userRouter from "./src/modules/user/user.routes.js";
import cors from "cors";
import { errorController } from './src/utils/globalErrorHandler.js';

export function appRouter(app, express) {
  // Global Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.static('uploads'));

  // home page
  app.get("/", (req, res) => res.send("Hello World!"));

  // user
  app.use("/api/v1/users", userRouter);
  // cars
  app.use("/api/v1/cars", carRouter);

  //Not Found
  app.all("*", (req, res, next) => {
    next(new AppError(`Can't find the requested page ${req.originalUrl}`, 404));
  });

  app.use(errorController);
}
