import express, {Router, Request, Response } from "express";
const router: Router = express.Router();

//controllers
import homeController from "./controllers/Home";

export default function() {

    //Home
    router.use("/Home", homeController);

    //redirect to a known route for the home controller
    router.get("/", (req: Request, res: Response) => {
        res.redirect("/Home/");
    });

    //respond with a 404 request if the document was not found
    router.use((req: Request, res: Response) => {
        res.status(404);
        res.render("shared/404");
    });

    return router;
}
