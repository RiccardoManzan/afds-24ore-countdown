import basicAuth from "express-basic-auth";
import { logger } from "./logger.js";

const authRealm = process.env.AUTH_REALM ?? "24ore";

//NB: Not the best approach at all, but does the job and is enough secure for the usage
type Map = {[key: string]: string}
export const usersByRole: {admins: Map, voters: Map} = {admins: {}, voters: {}}

export const initializeAuth = () => {
    usersByRole.admins[process.env.ADMIN_USERNAME!!] = process.env.ADMIN_PASSWORD!!
    usersByRole.voters[process.env.VOTER_USERNAME!!] = process.env.VOTER_PASSWORD!!
    logger.info(`Admins loaded: ${Object.keys(usersByRole.admins)} , voters loaded: ${Object.keys(usersByRole.voters)}`)
}


export const getAuthMiddleware = (adminRestricted: boolean = false) => basicAuth({
    users: {
        ... ( !adminRestricted ? usersByRole.voters : {} ),
        ... usersByRole.admins,
    },
    challenge: true,
    realm: authRealm,
});


//Forse meglio? https://www.npmjs.com/package/fastify-basic-auth-middleware