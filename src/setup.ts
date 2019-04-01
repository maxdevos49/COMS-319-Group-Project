import express from "express";
import mongoose from "mongoose";
import socketIO from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import config from "./config";
import GameMatchmaking from "./controllers/GameMatchmaking";
import homeController from "./controllers/Home";
import gameController from "./controllers/Game";

const router: express.Router = express.Router();

export default function(server: http.Server) {
    //database
    if (!config.database.dbUrl) throw "Database string is not valid";
    mongoose.connect(config.database.dbUrl, { useNewUrlParser: true });

    //middleware
    router.use(cookieParser());
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    //game controllers and sockets
    const io = socketIO(server);
    const gamesController: GameMatchmaking = new GameMatchmaking(io);

    //web page controllers
    router.use("/Home", homeController);
    router.use("/Game", gameController);

    //redirect to a known route for the home controller
    router.get("/", (req: express.Request, res: express.Response) => {
        res.redirect("/Home/");
    });

    //respond with a 404 request if the document was not found
    router.use((req: express.Request, res: express.Response) => {
        res.status(404);
        res.render("shared/404");
    });

    return router;
}
