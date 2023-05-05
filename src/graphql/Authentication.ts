import { extendType, nonNull, stringArg, objectType } from "nexus";
import { User } from "../entities/User";
import { Context } from "../types/Context";
import * as jwt from "jsonwebtoken";
import argon2 from "argon2";

export const AuthenticationType = objectType({
  name: "AuthenticationType",
  definition(t) {
    t.nonNull.string("token"),
      t.nonNull.field("user", {
        type: "User",
      });
  },
});

export const AuthenticationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: "AuthenticationType",
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, _context: Context, _info) {
        const { username, password } = args;
        const user = await User.findOne({ where: { username } });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await argon2.verify(user.password, password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { userId: user.id },
          process.env.TOKEN_SECRET as jwt.Secret
        );


        return {
          token,
          user,
        };
      },
    });
  },
});
