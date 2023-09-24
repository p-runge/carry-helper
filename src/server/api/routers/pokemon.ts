import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pokemonRouter = createTRPCRouter({
  fetchByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      console.log(`fetchPokemon: ${input.name}`);

      return (
        input.name && {
          name: input.name,
        }
      );
    }),
});
