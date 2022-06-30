import express, { NextFunction } from "express";
import { Request, Response } from "express";
import * as fs from "fs/promises";
import { webshopRouter } from "./route.js";
import cors from "cors";


const app = express();
const PORT = 3000;

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads.
app.use(express.json());

// Adding middleware that allow CORS
app.use(cors());

// defining middleware that logs to log.json on every access
app.use(middlewareLog)

/** 
 * MiddlewareLog function logs to log.json with every access
 * @param req - Request Object: containing the direct URL of the resource you want to fetch
 * @param res - Response Object: represents the response to a request
 * @param next - In case the current middleware function does not end the request-response cycle
 */
async function middlewareLog(req: Request, res: Response, next: NextFunction) {
    let log: Object[];
    
    let entry: Object = {
        time: new Date().toUTCString(),
        url: req.url
    }
    try {
        let logString: string = await fs.readFile("log.json", "utf8");
        log = JSON.parse(logString);
        log.push(entry);

        await fs.writeFile("log.json", JSON.stringify(log));
    } catch (err) {
        await fs.writeFile("log.json", JSON.stringify([entry]));
    }
    next();
}

// paths handled by webshopRouter
app.use(webshopRouter);

app.get("/", (req: Request, res: Response) => res.send("Try another request :)"));

// For invalid routes
app.get("*", (req: Request, res: Response) => {
	res.send("404! This is an invalid URL.");
});

app.listen(PORT, function () {
	console.log("Server listening on Port", PORT);
});