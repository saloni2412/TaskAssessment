import { extendType, nonNull,nullable, objectType, stringArg } from "nexus";
import { Movie } from "../entities/Movie";
import { Context } from "../types/Context";
//import * as jwt from "jsonwebtoken";
//import argon2 from "argon2";
//import { objectType } from "nexus";

//export const MovieType = objectType({
//  name: "Movie",
//  definition(t) {
 //   t.nonNull.int("id");
  //  t.nonNull.string("movieName");
 //   t.nonNull.string("description");
  //  t.nonNull.string("directorName");
  //  t.nonNull.string("releaseDate");
 // },
//});


export const CreateMovieType = objectType({
  name: "CreateMovieType",
  definition(t) {
    //t.nonNull.string("token"),
      t.nonNull.field("movie", {
        type: "Movie",
      });
  },
});

export const createMovieMutation = extendType({
  type: "Mutation",
  definition(t) {

    t.nonNull.field("createmovie", { 
      type: "CreateMovieType",
      args: {
        movieName: nonNull(stringArg()),
        description: nonNull(stringArg()),
        directorName: nonNull(stringArg()),
        releaseDate: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        const { movieName, description, directorName, releaseDate } = args;
        let movie;

        const { userId } = context;

        if (!userId) {
          throw new Error("Can't get moview wothout login.");
        }

        try {
         
          const result = await context.conn
            .createQueryBuilder()
            .insert()
            .into(Movie)
            .values({
                movieName,
                description,
                directorName,
                releaseDate,
                creatorId: userId
                
            })
            .returning("*")
            .execute();

          movie = result.raw[0];
          console.log(movie)
          //token = jwt.sign(
            //{ userId: user.id },
            //process.env.TOKEN_SECRET as jwt.Secret
          //);
          
        } catch (err) {
          console.log(err);
        } 

        return{
             movie   ,      
           //token
        };
      },
    });
  },
});

