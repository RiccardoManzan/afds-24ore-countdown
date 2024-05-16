import express, { Express, Request, Response } from "express";
import basicAuth from "express-basic-auth";
import cors from "cors";
import { logger, registerErrorLogging } from "./logger.js";
import mongo from "./mongo.js";
const app: Express = express();
const port = process.env.PORT ?? 8080;
const authRealm = process.env.AUTH_REALM ?? "24ore";

const origins = process.env.ORIGINS?.split(",") ?? [];
logger.info("configure cors to use origins", origins);
app.use(
	cors({
		origin: origins,
	})
);

//NB: Not the best approach at all, but does the job and is enough secure for the usage
const admins: {[key: string]: string} = {}
const voters: {[key: string]: string} = {}
admins[process.env.ADMIN_USERNAME!!] = process.env.ADMIN_PASSWORD!!
voters[process.env.VOTER_USERNAME!!] = process.env.VOTER_PASSWORD!!
logger.info(`Admins loaded: ${Object.keys(admins)} , voters loaded: ${Object.keys(voters)}`)
const getAuthMiddleware = (adminRestricted: boolean = true) => basicAuth({
	users: {
		... ( !adminRestricted ? voters : {} ),
		...admins,
	},
	challenge: true,
	realm: authRealm,
});

app.get("/api/ping", (req: Request, res: Response) => {
	logger.info("received ping");
	res.send("pong");
});

app.get("/api/login", getAuthMiddleware(), (req: Request, res: Response) => {
	logger.info("login success");
	res.sendStatus(204);
});

app.post("/api/register-donation/:type", getAuthMiddleware(), async (req: Request, res: Response) => {
	switch (req.params.type) {
		case "blood":
			logger.info("registering new blood donation");
			(await mongo).collection("donations").findOneAndUpdate({}, { $inc: { bloodCount: 1 } }, { sort: { _id: -1 }, upsert: true });
			break;
		case "plasma":
			logger.info("registering new plasma donation");
			(await mongo).collection("donations").findOneAndUpdate({}, { $inc: { plasmaCount: 1 } }, { sort: { _id: -1 }, upsert: true });
			break;
		default:
			res.sendStatus(400);
	}
	res.sendStatus(204);
});

app.get("/api/donations", async (req: Request, res: Response) => {
	const results = await (await mongo).collection("donations").find().sort({ _id: -1 }).limit(1).toArray();
	const result = results[0] as any|undefined;
	res.send({ plasmaCount: result?.plasmaCount ?? 0, bloodCount: result?.bloodCount ?? 0 });
});

registerErrorLogging(app);

app.listen(port, () => {
	logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
