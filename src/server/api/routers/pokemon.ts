import { type Pokemon, PokemonClient } from "pokenode-ts";
import { type Stat, gen2StatDiffs } from "public/assets/gen2StatDiffs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const api = new PokemonClient();

export const pokemonRouter = createTRPCRouter({
  fetchAllNames: publicProcedure.query(async () => {
    const { results: pokemons } = await api.listPokemonSpecies(undefined, 251);

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
              attack: updateStatToGen2Value(pokemon, "attack"),
              ["special-attack"]: updateStatToGen2Value(
                pokemon,
                "special-attack",
              ),
              speed: updateStatToGen2Value(pokemon, "speed"),
              hp: updateStatToGen2Value(pokemon, "hp"),
              defense: updateStatToGen2Value(pokemon, "defense"),
              ["special-defense"]: updateStatToGen2Value(
                pokemon,
                "special-defense",
              ),
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

const updateStatToGen2Value = (pokemon: Pokemon, stat: Stat): number => {
  const originalValue = pokemon.stats.find(
    (s) => s.stat.name === stat,
  )!.base_stat;

  return gen2StatDiffs[pokemon.id]?.[stat] ?? originalValue;
};
