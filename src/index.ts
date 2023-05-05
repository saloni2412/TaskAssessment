import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import typeOrmConfig from "./typeorm.config";
import dotenv from "dotenv";
import { Context } from "./types/Context";
import { auth } from "./middlewares/auth";

dotenv.config();

const boot = async () => {
    try {
      const conn = await typeOrmConfig.initialize();
        

      const server = new ApolloServer({
        schema,
         //context: ({ req }): Context => ({conn}),
        context: ({ req }): Context => {
          const token =
            req && req.headers?.authorization
              ? auth(req.headers.authorization)
              : null;
          return { conn, userId: token?.userId };
        }
      });
  
      server.listen(5000).then(({ url }) => {
        console.log("server running at " + url);
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  boot();