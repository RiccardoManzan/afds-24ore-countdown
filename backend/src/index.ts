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

	app.get("/api/state", async (req: Request, res: Response) => {
		const donations = await mongo.donations
			.find()
			.sort({ _id: -1 })
			.limit(1)
			.toArray();

		const countdown = await mongo.countdown
			.find()
			.sort({ _id: -1 })
			.limit(1)
			.toArray();
		const donationDoc = donations[0];
		const countdownDoc = countdown[0];
		res.send({
			donations: {
				plasmaCount: donationDoc?.plasmaCount ?? 0,
				bloodCount: donationDoc?.bloodCount ?? 0
			},
			countdown: {
				startDate: countdownDoc?.startDate?? new Date(process.env.START_DATE as string),
				endDate:  countdownDoc?.endDate?? new Date(process.env.END_DATE as string),
				mode: countdownDoc?.mode ?? "auto"
			}
		});
	});


	// region admin

	app.post("/api/remove-donation/:type", getAuthMiddleware(true), async (req: Request, res: Response) => {
		switch (req.params.type) {
			case "blood":
				logger.info("removing a blood donation");
				await mongo.donations.findOneAndUpdate({}, {$inc: {bloodCount: -1}}, {
					sort: {_id: -1},
					upsert: true
				});
				break;
			case "plasma":
				logger.info("removing a plasma donation");
				await mongo.donations.findOneAndUpdate({}, { $inc: { plasmaCount: -1 } }, { sort: { _id: -1 }, upsert: true });
				break;
			default:
				res.sendStatus(400);
		}
		res.sendStatus(204);
	});

	app.post("/api/countdown/:type", getAuthMiddleware(true), async (req: Request, res: Response) => {
		switch (req.params.type) {
			case "stop":
				logger.info("stopping countdown (manual mode)");
				await mongo.countdown.findOneAndUpdate({}, {$set: {
						startDate: new Date("2100-01-01 00:00:00"),
						endDate: new Date("2100-01-01 00:00:00"),
						mode: "manual"
					}}, {
					sort: {_id: -1},
					upsert: true
				});
				break;
			case "restart":
				logger.info("restarting countdown in 15 seconds (manual mode)");
				const start = new Date()
				start.setTime(start.getTime() + 15 * 1000)
				const end = new Date()
				end.setTime(start.getTime() + (24*60*60*1000))

				await mongo.countdown.findOneAndUpdate({}, {$set: {
						startDate: start,
						endDate: end,
						mode: "manual"
					}}, {
					sort: {_id: -1},
					upsert: true
				});
				break;
			case "resume":
				logger.info("resuming countdown (auto mode)");
				await mongo.countdown.findOneAndUpdate(
					{},
					{
						$set: {
							mode: "auto"
						},
						$unset:{
							startDate: "",
							endDate: ""
						}
					},
					{ sort: {_id: -1}, upsert: true}
				);
				break;
			case "end":
				logger.info("terminating countdown (manual mode)");
				await mongo.countdown.findOneAndUpdate({}, {$set: {
						startDate: new Date("2000-01-01 00:00:00"),
						endDate: new Date("2000-01-01 00:00:00"),
						mode: "manual"
					}}, {
					sort: {_id: -1},
					upsert: true
				});
				break;
			default:
				res.sendStatus(400);
		}
		res.sendStatus(204);
	});

	// endregion admin


	const port = process.env.PORT ?? 8080;
	app.listen(port, () => {
		logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
	});

})()
