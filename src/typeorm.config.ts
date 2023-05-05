import { DataSource} from "typeorm";
import dotenv from 'dotenv';
import { User } from "./entities/User";
import {Movie} from "./entities/Movie";

dotenv.config();

export default new DataSource({
    type: "postgres",
    url: process.env.CONNECTION_STRING,
    entities: [User, Movie],
    synchronize: true
}) 