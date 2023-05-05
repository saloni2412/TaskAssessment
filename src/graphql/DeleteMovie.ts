import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { Movie } from "../entities/Movie";
import { Context } from "../types/Context";



export const DeleteMovieType = objectType({
  name: "DeleteMovieType",
  definition(t) {
    t.nonNull.string("message");
  },
});

export const deleteMovieMutation = extendType({
  type: "Mutation",
  definition(t) {

    t.nonNull.field("deletemovie", {
      type: "DeleteMovieType",
      args: {
        id: nonNull(intArg())
      },
      async resolve(_parent, args, context: Context, _info) {
        const { id } = args;
        let message = "";

        const { userId } = context;

        if (!userId) {
          throw new Error("Can't delete moview wothout login.");
        }

        try {

          const result = await context.conn
            .createQueryBuilder()
            .delete()
            .from(Movie)
            .where("id = :id", { id: id })
            .execute();

          if (result.affected && result.affected >= 1) {
            message = "Moview Delete"
          }
          else {
            message = "Failed, Moview can not be found"
          }
       
        } catch (err) {
          console.log(err);
        }

        return {
          'message': message
        };
      },
    });
  },
});
