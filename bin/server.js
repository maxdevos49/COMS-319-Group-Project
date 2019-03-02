"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
if (!process.env.NODE_ENVIROMENT)
    dotenv_1.default.config();
const app = express_1.default();
app.get("/", function (req, res) {
    res.send("Hello, World! \n" + process.env.PORT);
});
app.listen(8080, function () {
    console.log("Server listening on port 8080");
    console.log("Hey");
});
//# sourceMappingURL=server.js.map