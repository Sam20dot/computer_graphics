
import { rechargeUser } from "./transaction.service.js";
import dotenv from "dotenv";
dotenv.config("../../env")
import {initDatabase} from "../model/init.model.js"
await initDatabase()


const recharge= await rechargeUser("68cbc791198526e062e1eb59","68cbd3015310622c8733e743",5000)
console.log(recharge)