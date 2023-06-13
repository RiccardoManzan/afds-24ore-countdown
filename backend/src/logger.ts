import winston from "winston";
import expressWinston from "express-winston";
import { Express } from "express";

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
export const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), simpleTimestamp()),
	transports: [new winston.transports.Console()],
});

export const registerErrorLogging = (app: Express) => {
	app.use(
		expressWinston.errorLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(winston.format.colorize(), winston.format.json()),
		})
	);
};
