import express from "express";
import mongoose from "mongoose";
import socketIO from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";

import { config } from "./config";
import { GameMatchmaking } from "./game/GameMatchmaking";
import homeController from "./controllers/Home";
import gameController from "./controllers/Game";
import authController from "./controllers/Auth";

import localStrat from "./middleware/passport";
import authentication from "./middleware/authentication";

import "./helpers/vash/lib/helpers";

const router: express.Router = express.Router();

export default function (server: http.Server) {
	//database
	if (!config.database.dbUrl) throw "Database string is not valid";
	mongoose.connect(config.database.dbUrl, { useNewUrlParser: true });

	//passport
	if (!config.session.secret) throw "Session secret is invalid";
	router.use(session({ secret: config.session.secret, resave: false, saveUninitialized: false }));
	// Make sure this comes after the express session

	localStrat(passport);

	//middleware
	router.use(bodyParser.urlencoded({ extended: false }));
	router.use(bodyParser.json());
	router.use(passport.initialize());
	router.use(passport.session());
	router.use(authentication);

	//game controllers and sockets
	const io = socketIO(server);
	const gamesController: GameMatchmaking = new GameMatchmaking(io);

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
