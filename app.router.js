import cors from "cors";
import createDOMPurify from "dompurify";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { JSDOM } from "jsdom";
import carRouter from "./src/modules/car/car.routes.js";
import userRouter from "./src/modules/user/user.routes.js";
import AppError from "./src/utils/appError.js";
import { errorController } from "./src/utils/globalErrorHandler.js";
import hpp from "hpp";

const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);

export function appRouter(app, express) {
  // Global Middlewares
  app.use(cors());
  const limiter = rateLimit({
    max: 100, // limit each IP to 100 requests per windowMs
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from this IP, please try again after an hour!",
  });
  app.use("/api", limiter);
  app.use(express.static("uploads"));

  // data sanitization against NoSQL query injection => clean data from malicious MongoDB operators
  app.use(mongoSanitize());

  // data sanitization against XSS => clean data from malicious HTML code
  app.use((req, res, next) => {
    if (req.body) req.body = DOMPurify.sanitize(req.body);
    next();
  });

  app.use(express.json());

  // prevent parameter pollution => remove duplicate fields from the query string
  app.use(
    hpp({
      // whitelist: [] => add fields to whitelist
    })
  );

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
