import express, { Express, Request, Response } from "express";
import cors from "cors";
import { logger, registerErrorLogging } from "./logger.js";
import { initializeMongo, mongo } from "./mongo.js";
import {getAuthMiddleware, initializeAuth, usersByRole} from "./auth";

(async () => {
	logger.info("Startup in progress 🚀")
	await initializeMongo().catch((error: Error) => {
		logger.error("Database connection failed", error);
		process.exit();
	});

	initializeAuth();

	const app: Express = express();
	registerErrorLogging(app);

	const origins = process.env.ORIGINS?.split(",") ?? [];
	logger.info("configure cors to use origins", origins);
	app.use(
		cors({
			origin: origins,
		})
	);

	app.get("/api/ping", (req: Request, res: Response) => {
		logger.info("received ping");
		res.send("pong");
	});

	app.get("/api/login", getAuthMiddleware(), (req: Request, res: Response) => {
		logger.info(`login success for ${(req as any).auth.user}`);
		res.sendStatus(204);
	});

	app.get("/api/role", getAuthMiddleware(), (req: Request, res: Response) => {
		const username = (req as any).auth.user;
		const role = usersByRole.admins[username] != undefined ? "admin" : "voter"
		res.send({role})
	});

	app.post("/api/register-donation/:type", getAuthMiddleware(), async (req: Request, res: Response) => {
		switch (req.params.type) {
			case "blood":
				logger.info("registering new blood donation");
				await mongo.donations.findOneAndUpdate({}, {$inc: {bloodCount: 1}}, {
					sort: {_id: -1},
					upsert: true
				});
				break;
			case "plasma":
				logger.info("registering new plasma donation");
				await mongo.donations.findOneAndUpdate({}, { $inc: { plasmaCount: 1 } }, { sort: { _id: -1 }, upsert: true });
				break;
			default:
				res.sendStatus(400);
		}
		res.sendStatus(204);
	});

	app.get("/api/donations", async (req: Request, res: Response) => {
		const results = await mongo.donations.find().sort({ _id: -1 }).limit(1).toArray();
		const result = results[0] as any|undefined;
		res.send({ plasmaCount: result?.plasmaCount ?? 0, bloodCount: result?.bloodCount ?? 0 });
	});


	const port = process.env.PORT ?? 8080;
	app.listen(port, () => {
		logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
	});

})()
