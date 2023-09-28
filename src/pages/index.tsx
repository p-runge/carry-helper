import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { distance } from "fastest-levenshtein";

import { api } from "~/utils/api";

export default function Home() {
  const [pokemonName, setPokemonName] = useState("");
  const { data: pokemon } = api.pokemon.fetchByName.useQuery({
    name: pokemonName,
    versionGroup: "crystal",
  });

  return (
    <>
      <Head>
        <title>Carry Helper</title>
        <meta
          name="description"
          content="Check how good your Pokémon is as a carry"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-slate-900 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Carry Helper
            </h1>
            <h2 className="">Check how good your Pokémon is as a carry</h2>
            <div className="relative h-40">
              <Image
                src="/logo.png"
                alt="logo"
                fill
                className="pointer-events-none bg-black mix-blend-screen"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <Input
            placeholder="Enter Pokémon name"
            value={pokemonName}
            onChange={(v) => setPokemonName(v)}
          />
          {pokemon === undefined || pokemonName === "" ? null : pokemon ===
            null ? (
            <p className="text-2xl ">That&apos;s not a Pokémon</p>
          ) : (
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
        </div>
      </main>
    </>
  );
}

const Input: React.FC<
  {
    value: string;
    onChange: (value: string) => void;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">
> = ({ value: initialValue, onChange, ...props }) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const { data: allPokemon } = api.pokemon.fetchAllNames.useQuery();

  const [filteredPokemon, setFilteredPokemon] = useState(allPokemon ?? []);
  useEffect(() => {
    setFilteredPokemon(allPokemon ?? []);
  }, [allPokemon]);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setValue(userInput);
    setShowDropdown(true);

    // Sort and filter Pokemon by their Levenshtein distance to userInput
    const sortedAndFilteredPokemon =
      allPokemon
        ?.map((pokemon) => ({
          pokemon,
          dist: distance(userInput, pokemon),
        }))
        .filter(({ dist, pokemon }) => {
          const avgLength = (userInput.length + pokemon.length) / 2;
          return dist < avgLength * 0.9; // Threshold is 90% of average length
        })
        .sort((a, b) => a.dist - b.dist)
        .map(({ pokemon }) => pokemon) ?? [];

    setFilteredPokemon(sortedAndFilteredPokemon);
  };

  const handleDropdownClick = (pokemon: string) => {
    setValue(pokemon);
    onChange(pokemon);
    setShowDropdown(false);
  };

  const handleDropdownHide = () => {
    setShowDropdown(false);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, []);

  return (
    <div className="relative text-slate-900">
      <input
        {...props}
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        className={
          "w-80 rounded border px-2 py-1 text-center text-3xl leading-tight focus:outline-none"
        }
      />
      {showDropdown && (
        <Dropdown
          options={filteredPokemon}
          onSelect={handleDropdownClick}
          onHide={handleDropdownHide}
        />
      )}
    </div>
  );
};

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

/**
 * Keyboard controllable dropdown
 */
const Dropdown: React.FC<{
  options: string[];
  onSelect: (option: string) => void;
  onHide: () => void;
}> = ({ options: allOptions, onSelect, onHide }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const options = allOptions.slice(0, 5);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, options.length - 1),
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex !== -1) {
      onSelect(options[highlightedIndex] ?? "");
    }
  };

  const handleClickOutside = (event: Event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      onHide();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex, options]);

  return (
    <ul
      ref={dropdownRef}
      className="absolute top-0 z-10 mt-12 w-80 rounded border border-gray-300 bg-white"
    >
      {options.map((option, index) => (
        <li
          key={index}
          onClick={() => onSelect(option)}
          className={`cursor-pointer p-2 ${
            index === highlightedIndex ? "bg-slate-300" : "hover:bg-slate-200"
          }`}
        >
          {option}
        </li>
      ))}
    </ul>
  );
};
