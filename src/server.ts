import express from "express";
import http from "http";
import ip from "ip";

//config
import config from "./config";
import setup from "./setup";

const app: express.Application = express();
const server: http.Server = http.createServer(app);

//view engine
app.set("view engine", "vash");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/public'));

//set the routes for the server to use
app.use("/", setup());

//start the server
server.listen(config.server.port, function() {
    console.log(`CS319 Project running at ${ip.address()}:${config.server.port}`);
});

// Catch Errors
server.on("error", function(error: any) {
    if (error.code === "EADDRINUSE") {
        console.error(`Current port address is in use. Try closing any other servers that could be using the same port as : ${config.server.port}`);
    }
});
