import { PokemonClient } from "pokenode-ts";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const api = new PokemonClient();

export const pokemonRouter = createTRPCRouter({
  fetchByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      if (!input.name) return null;

      try {
        const pokemon = await api.getPokemonByName(input.name.toLowerCase());

        return (
          pokemon && {
            name: pokemon.name,
            stats: {
              hp: pokemon.stats[0]!.base_stat,
              attack: pokemon.stats[1]!.base_stat,
              defense: pokemon.stats[2]!.base_stat,
              ["special-attack"]: pokemon.stats[3]!.base_stat,
              ["special-defense"]: pokemon.stats[4]!.base_stat,
              speed: pokemon.stats[5]!.base_stat,
            },
          }
        );
      } catch (e) {
        return null;
      }
    }),
});
