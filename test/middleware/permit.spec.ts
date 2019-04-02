import express, { Response, Request, NextFunction } from "express";
import http from "http";
import { expect } from "chai";
import permit from "../../src/middleware/permit";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT = 7890;

//mock role
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.role = "public";
    next();
});

//public route test
app.get("/public", permit(["public"], "/"), (req: Request, res: Response) => {
    res.send("public");
});

//user only test
app.get("/usersonly", permit(["user"], "/"), (req: Request, res: Response) => {
    res.send("usersonly");
});

app.get("/multi", permit(["user", "public", "admin"], "/"), (req: Request, res: Response) => {
    res.send("multi");
});

app.get("/multi2", permit(["user", "tom", "admin"], "/"), (req: Request, res: Response) => {
    res.send("multi2");
});

//root route
app.get("/", (req: Request, res: Response) => {
    res.send("/");
});

server.listen(PORT);

describe("Permit Middleware", () => {
    it('Should allow role "public"', done => {
        http.get(`http://localhost:${PORT}/public`, (res: any) => {
            expect(res.headers.location).equals(undefined);
            done();
        });
    });

    it('Should deny role "public"', done => {
        http.get(`http://localhost:${PORT}/usersonly`, (res: http.IncomingMessage) => {
            expect(res.headers.location).equals("/");
            done();
        });
    });

    it("Should allow the page '/'", done => {
        http.get(`http://localhost:${PORT}/`, (res: http.IncomingMessage) => {
            expect(res.headers.location).equals(undefined);
            done();
        });
    });

    it(`Should allow multiple roles`, done => {
        http.get(`http://localhost:${PORT}/multi`, (res: http.IncomingMessage) => {
            expect(res.headers.location).equals(undefined);
            done();
        });
    });

    it(`Should deny multiple roles`, done => {
        http.get(`http://localhost:${PORT}/multi2`, (res: http.IncomingMessage) => {
            expect(res.headers.location).equals("/");
            done();
        });
    });
});
