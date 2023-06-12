import express, { Express, Request, Response } from "express";
import basicAuth from "express-basic-auth";
import winston from "winston";
import expressWinston from "express-winston";

const app: Express = express();
const port = process.env.PORT ?? 8080;
const authRealm = process.env.AUTH_REALM ?? "24ore";

const simpleFormat = winston.format.simple();
const MESSAGE = Symbol.for("message");
const simpleTimestamp = winston.format((info) => {
	const { timestamp, ...rest } = info;
	const simpled = simpleFormat.transform(rest);
	if (typeof simpled !== "boolean") {
		simpled[MESSAGE] = `${timestamp} ${simpled[MESSAGE]}`;
	}
	return simpled;
});
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), simpleTimestamp()),
	transports: [
		//
		// - Write all logs with importance level of `error` or less to `error.log`
		// - Write all logs with importance level of `info` or less to `combined.log`
		//
		new winston.transports.Console(),
	],
});

const authMiddleware = basicAuth({
	users: { usr: "pwd" },
	challenge: true,
	realm: authRealm,
});

app.get("/ping", (req: Request, res: Response) => {
	logger.info("received ping");
	res.send("pong");
});

app.get("/login", authMiddleware, (req: Request, res: Response) => {
	logger.info("login success");
	res.sendStatus(204);
});

app.post("/register-donation/:type", authMiddleware, (req: Request, res: Response) => {
	switch (req.params.type) {
		case "blood":
			logger.info("registering new blood donation");
			break;
		case "plasma":
			logger.info("registering new plasma donation");
			break;
		default:
			res.sendStatus(400);
	}
	res.sendStatus(204);
});

app.get("/donations", (req: Request, res: Response) => {
	res.send({ plasmaCount: 20, bloodCount: 50 });
});

app.use(
	expressWinston.errorLogger({
		transports: [new winston.transports.Console()],
		format: winston.format.combine(winston.format.colorize(), winston.format.json()),
	})
);

app.listen(port, () => {
	logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
