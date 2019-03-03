import express from "express";
import dotenv from "dotenv";
if (!process.env.NODE_ENVIROMENT)
    dotenv.config();
const app = express();
app.get("/", function (req, res) {
    res.send("Hello, World! \n" + process.env.SERVER_PORT);
});
app.listen(8080, function () {
    console.log("Server listening on port 8080");
    console.log("Hey");
});
//# sourceMappingURL=server.js.map