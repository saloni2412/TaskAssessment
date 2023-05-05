import { extendType, nonNull, stringArg, objectType } from "nexus";
import { Context } from "../types/Context";
import * as jwt from "jsonwebtoken";
import argon2 from "argon2";
import { User } from "../entities/User";

export const ChangePasswordType = objectType({
  name: "ChangePasswordType",
  definition(t) {
      t.nonNull.string("token"),
      t.nonNull.string("username"),
      t.nonNull.string("password"),
      t.nullable.string("newpassword");
  },
});

// export const ChangePasswordResponseType = objectType({
//   name: "ChangePasswordResponseType",
//   definition(t) {
//       t.nonNull.string("token"),
//       t.nullable.string("username"),
//       t.nullable.string("password"),
//      t.nullable.string("rowUpdated")
//   },
// });

export const changepasswordMutation = extendType({
  type: "Mutation",
  definition(t) {

    t.nonNull.field("changepassword", {
      type: "ChangePasswordType",
      
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        newpassword: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        const { username, password, newpassword } = args;
        
        const user1 = await User.findOne({ where: { username } });
        if (!user1) {
          throw new Error("User not found");
        }
        const isValid = await argon2.verify(user1.password, password);

        if (!isValid) {
          throw new Error("Invalid password can not set new password");
        }

        const hashedPassword = await argon2.hash(newpassword);
        
        let token;
        let updated:number|undefined=0;
        try {
         
          const result = await context.conn
            .
            createQueryBuilder()
            .update(User)
            .set({
              password : hashedPassword
            })
            .andWhere("id = :id",{id :user1.id } )
            .execute();
          

            updated =result.affected
            
          token = jwt.sign(
            { userId: user1.id },
            process.env.TOKEN_SECRET as jwt.Secret
          );
          
        } catch (err) {
          console.log(err);
        }

        return {

          'username': username, 
'password': hashedPassword
,          'token': token
        };
      },
    });
  },
});
