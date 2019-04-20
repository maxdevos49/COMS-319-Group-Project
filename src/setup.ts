import express from "express";
import mongoose from "mongoose";
import socketIO from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";

import homeController from "./controllers/HomeController";
import gameController from "./controllers/GameController";
import authController from "./controllers/AuthController";

import { localStrat } from "./middleware/passport";
import { authentication } from "./middleware/authentication";

import "./helpers/vash/lib/helpers";
import { config } from "./config";
import { GameMatchmaking } from "./game/GameMatchmaking";

const router: express.Router = express.Router();

export default function (server: http.Server) {
    //database
    mongoose.connect(config.database.dbUrl, { useNewUrlParser: true });

    //passport
    let sessionMiddleware = session({ secret: config.session.secret, resave: false, saveUninitialized: false });
    router.use(sessionMiddleware);
    localStrat(passport);

    //middleware
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    router.use(passport.initialize());
    router.use(passport.session());
    router.use(authentication);

    //game controllers and sockets
    const io = socketIO(server);
    io.use(function (socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    new GameMatchmaking(io);

    //web page controllers
    router.use("/Home", homeController);
    router.use("/Game", gameController);
    router.use("/Auth", authController);

    //redirect to a known route for the home controller
    router.get("/", (req: express.Request, res: express.Response) => {
        res.redirect("/Home/");
    });

    //respond with a 404 request if the document was not found
    router.use((req: express.Request, res: express.Response) => {
        res.status(404);
        res.render("Shared/404");
    });

    return router;
}
