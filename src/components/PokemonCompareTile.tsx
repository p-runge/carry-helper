import React from "react";
import type { Pokemon } from "~/types/Pokemon";

export default function PokemonstatCompareTile({
  pokemon,
  compareTo,
}: {
  pokemon: Pokemon;
  compareTo: Pokemon;
}) {
  function calculateStatDiff(currend: number, locked: number): number {
    return currend - locked;
  }
  function coloreOfStat(statDiff: number): string {
    if (statDiff > 0) return "text-green-500";
    if (statDiff < 0) return "text-red-500";
    return "";
  }
  return (
    <>
      {pokemon && compareTo && (
        <div className="flex flex-col gap-2 p-3 ">
          <p className="text-center text-2xl capitalize">←</p>
          <hr className="invisible" />
          <ul className="flex flex-col gap-2">
            {Object.entries(pokemon.stats).map(([stat, value]) => (
              <React.Fragment key={stat}>
                <li className="grid-cols grid gap-2 capitalize">
                  {(() => {
                    const statDiff = calculateStatDiff(
                      value,
                      compareTo.stats[stat as keyof typeof compareTo.stats],
                    );
                    return (
                      <div className={`text-center ${coloreOfStat(statDiff)}`}>
                        {statDiff > 0 ? `+${statDiff}` : `${statDiff}`}
                      </div>
                    );
                  })()}
                </li>
                {stat === "special-attack" && <hr className="invisible" />}
              </React.Fragment>
            ))}
          </ul>
          <hr className="invisible" />
          <p className="text-center text-sm capitalize"> ⁣ </p>
          <p className="text-center text-2xl capitalize">←</p>
        </div>
      )}
    </>
  );
}
