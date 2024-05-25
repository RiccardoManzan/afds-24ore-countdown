import {Collection, Db, MongoClient, ServerApiVersion} from "mongodb";
import {logger} from "./logger";


export const mongo: {
  connection: MongoClient;
  db: Db;
  donations: Collection<{
    plasmaCount?: number;
    bloodCount?: number;
  }>;
  countdown: Collection<{
	  startDate: Date,
	  endDate: Date,
	  mode: "auto"|"manual"
  }>;
} = {} as any;

export const initializeMongo = async () =>  {

	logger.info("Initializing mongo connection")
	mongo.connection = await MongoClient.connect(process.env.MONGODB!!, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
	});

	mongo.db = mongo.connection.db("afds-countdown");

	mongo.donations = mongo.db.collection("donations")
	mongo.countdown = mongo.db.collection("countdown")

	logger.info("Mongo connection initialize")
}
