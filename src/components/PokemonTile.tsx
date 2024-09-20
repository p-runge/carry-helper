import React from "react";
import type { Pokemon } from "~/types/Pokemon";

export default function PokemonTile({ pokemon }: { pokemon: Pokemon }) {
  return (
    <>
      {!pokemon ? null : (
        <div className="flex flex-col gap-2 rounded border border-white p-3 ">
          <p className="text-center text-2xl capitalize">{pokemon.name}</p>
          <hr />
          <ul className="flex flex-col gap-2">
            {Object.entries(pokemon.stats).map(([stat, value]) => (
              <React.Fragment key={stat}>
                <li className="grid grid-cols-[1fr,3ch,1fr] gap-2 capitalize">
                  <div className="text-right">{stat}:</div>
                  <div className="w-[3ch] text-right">{value}</div>
                  <div
                    className={`h-6 ${
                      {
                        S: "bg-green-500",
                        A: "bg-green-300",
                        B: "bg-yellow-400",
                        C: "bg-yellow-600",
                        D: "bg-red-300",
                        F: "bg-red-500",
                      }[statValueToTier(value)]
                    }`}
                    style={{ width: `${(100 / 255) * value}%` }}
                  />
                </li>
                {stat === "special-attack" && <hr />}
              </React.Fragment>
            ))}
          </ul>
          <hr />
          <p className="text-lg">Moves learned on level:</p>
          <p>{pokemon.moveLevels.join(", ")}</p>
        </div>
      )}
    </>
  );
}
/**
 * Converts a stat value to a tier
 */
const statValueToTier = (value: number) => {
  if (value >= 150) return "S";
  if (value >= 120) return "A";
  if (value >= 100) return "B";
  if (value >= 80) return "C";
  if (value >= 60) return "D";
  return "F";
};
