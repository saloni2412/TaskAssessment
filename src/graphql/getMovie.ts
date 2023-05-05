import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Movie } from "../entities/Movie";
import { Context } from "../types/Context";
import { User } from "../entities/User";

export const GetMovieType = objectType({
  name: "GetMovieType",
  definition(t) {
    //t.nonNull.string("token"),
    t.nullable.string("movieName"),
      t.nullable.string("description"),
      t.nullable.string("directorName"),
      t.nullable.string("releaseData");
    t.nullable.string("createdby");
  },
});


export const MovieQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("getmovie", {
      type: "Movie",
      resolve(_parent, _args, context: Context, _info): Promise<Movie[]> {
        //const { conn } = _context;
        //return conn.query(`select * from movie`);

        const { userId } = context;

        if (!userId) {
          throw new Error("Can't get moview wothout login.");
        }
        return Movie.find();
      },
    });

    t.nonNull.list.nonNull.field("getusersmovie", {
      type: "Movie",
      args: {
        createdby: nonNull(stringArg())

      },
      async resolve(parent, args, context: Context, info): Promise<Movie[]> {


        const { createdby } = args;

        const user = await User.findOne({ where: { username: createdby } });

        const { userId } = context;

        if (!userId) {
          throw new Error("Can't get moview wothout login.");
        }

        if (!user || !user.id)
          throw new Error("User not found");


        return Movie.find({ where: { id: user.id } });
      },
    });

    
    t.nonNull.list.nonNull.field("getCurrentUserMovie", {
      type: "Movie",
      
      async resolve(parent, args, context: Context, info): Promise<Movie[]> {

        const { userId } = context;

        if (!userId) {
          throw new Error("Can't get moview wothout login.");
        }  

        return Movie.find({ where: { id: userId } });
      },
    });


  },
});

