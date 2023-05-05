import { extendType, nonNull, stringArg, objectType, intArg } from "nexus";
import { Context } from "../types/Context";
//import * as jwt from "jsonwebtoken";
//import argon2 from "argon2";
//import { User } from "../entities/User";
import { Movie } from "../entities/Movie";

export const UpdateMovieType = objectType({
  name: "UpdateMovieType",
  definition(t) {
    t.nonNull.string("message");
  },
});

export const updateMovieMutation = extendType({
  type: "Mutation",
  definition(t) {

    t.nonNull.field("updateMovie", {
      type: "UpdateMovieType",

      args: {
        id: nonNull(intArg()),
        movieName: nonNull(stringArg()),
        description: nonNull(stringArg()),
        directorName: nonNull(stringArg()),
        releaseDate: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {

        const { id, movieName, description, directorName, releaseDate } = args;

        const { userId } = context;
        let message = ""
        if (!userId) {
          throw new Error("Can't delete moview wothout login.");
        }


        const moviewForUpdate = await Movie.findOne({ where: { id } });


        if (!moviewForUpdate) {
          throw new Error("Movie not found");
        }

        let updated: number | undefined = 0;
        try {

          const result = await context.conn .
            createQueryBuilder()
            .update(Movie)
            .set({
              movieName,
              description,
              directorName,
              releaseDate,
            })
            .andWhere("id = :id", { id: moviewForUpdate.id })
            .execute();


          updated = result.affected
          if (updated && updated >= 1)
            message = "Moview Update Successfully"
          else
            message = "Moview Update failed"

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
