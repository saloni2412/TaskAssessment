import { objectType } from "nexus";

export const MovieType = objectType({
  name: "Movie",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("movieName");
    t.nonNull.string("description");
    t.nonNull.string("directorName");
    t.nonNull.string("releaseDate");
  },
});
