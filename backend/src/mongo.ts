import { MongoClient, ServerApiVersion } from "mongodb";

const conn = MongoClient.connect(process.env.MONGODB!!, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

let db = conn.then((x) => x.db("afds-countdown"));

export default db;
