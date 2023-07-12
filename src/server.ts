import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import HealthChecker from "./routes";
import Router from "./routes/routeV1";
import { connectToDatabase } from "./db/ConnectionFactory";
import session from 'express-session';
import googleAuth from "./middlewares/GoogleAuth";
import facebookAuth from "./middlewares/FacebookAuth";
import config from "./config";

const app = express();
dotenv.config();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
    })
);
app.use(passport.initialize());
googleAuth();
facebookAuth();

app.use("/", HealthChecker);
app.use("/api", Router);

connectToDatabase();

const { PORT = 4000 } = process.env;
app.listen(PORT, () => {
    console.log(`Server started: listening on port ${PORT}`)
});
