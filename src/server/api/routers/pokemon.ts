import { PokemonClient } from "pokenode-ts";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const api = new PokemonClient();

export const pokemonRouter = createTRPCRouter({
  fetchAllNames: publicProcedure.query(async () => {
    const { results: pokemons } = await api.listPokemonSpecies(undefined, 2000);

    return pokemons.map((pokemon) => pokemon.name);
  }),

  fetchByName: publicProcedure
    .input(z.object({ name: z.string(), versionGroup: z.string() }))
    .query(async ({ input }) => {
      if (!input.name) return null;

      try {
        const pokemon = await api.getPokemonByName(input.name.toLowerCase());

        return (
          pokemon && {
            name: pokemon.name,
            stats: {
              attack: pokemon.stats[1]!.base_stat,
              ["special-attack"]: pokemon.stats[3]!.base_stat,
              speed: pokemon.stats[5]!.base_stat,
              hp: pokemon.stats[0]!.base_stat,
              defense: pokemon.stats[2]!.base_stat,
              ["special-defense"]: pokemon.stats[4]!.base_stat,
            },
            moveLevels: pokemon.moves
              .map((move) => {
                return (
                  move.version_group_details
                    // filter out versions that are not crystal
                    .filter((versionGroupDetail) => {
                      return (
                        versionGroupDetail.version_group.name ===
                        input.versionGroup
                      );
                    })
                    // filter for moves that are learned by level up
                    .filter((versionGroupDetail) => {
                      return versionGroupDetail.level_learned_at;
                    })
                    // map to level learned
                    .map((versionGroupDetail) => {
                      return versionGroupDetail.level_learned_at;
                    })
                );
              })
              // flatten array
              .reduce((a, b) => [...a, ...b], [])
              // sort ascending
              .sort((a, b) => a - b),
          }
        );
      } catch (e) {
        return null;
      }
    }),
});
