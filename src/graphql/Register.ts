import { extendType, nonNull, stringArg, objectType } from "nexus";
//import { ResponseHelper } from "../Helper/ResponseHelper";
import { User } from "../entities/User";
import { Context } from "../types/Context";
import * as jwt from "jsonwebtoken";
import argon2 from "argon2";

export const RegisterType = objectType({
  name: "RegisterType",
  definition(t) {
    //t.nonNull.string("token"),
      t.nonNull.field("user", {
        type: "User",
      });
  },
});

export const Register = extendType({
  type: "Mutation",
  definition(t) {

    t.nonNull.field("register", {
      type: "RegisterType",
      args: {
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) { 
        const { username, password, email } = args;
        const hashedPassword = await argon2.hash(password);
        let user;
        let token;
        
        try {
         
          const result = await context.conn
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
              username,
              password: hashedPassword,
              email,
            })
            .returning("*")
            .execute();
          user = result.raw[0];
          token = jwt.sign(
            { userId: user.id },
            process.env.TOKEN_SECRET as jwt.Secret
          );
          
        } catch (err) {
          console.log(err);
        }

        return {
//          return ResponseHelper.successResponse("User succefully saved");
          user
           ,
           token
        };
      },
    });
  },
});
