import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { distance } from "fastest-levenshtein";

import { api } from "~/utils/api";
import { Footer } from "~/components/Footer";
import Dictaphone from "~/components/Dictaphone";
import PokemonTile from "~/components/PokemonTile";
import type { Pokemon } from "~/types/Pokemon";
import PokemonCompareTile from "~/components/PokemonCompareTile";

const title = "Carry Helper";
const description =
  "Check how good your Pokémon is as a carry in Pokémon Crystal";

export default function Home() {
  const [pokemonName, setPokemonName] = useState("");
  const [lockedPokemon, setLockedPokemon] = useState<Pokemon>();
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon>();
  const { data: pokemon, status } = api.pokemon.fetchByName.useQuery({
    name: pokemonName,
    versionGroup: "crystal",
  });

  useEffect(() => {
    if (!pokemon) {
      return;
    }
    setCurrentPokemon(pokemon); // Save the current Pokemon

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-slate-900 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              {title}
            </h1>
            <h2 className="">{description}</h2>
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
          <div className="grid grid-cols-[5fr_3em_5fr] gap-12">
            {lockedPokemon && (
              <span
                onClick={() => setLockedPokemon(undefined)}
                className="cursor-pointer justify-self-end text-2xl"
              >
                ⇎
              </span>
            )}
            {currentPokemon && (
              <div className="col-span-2 col-start-2 grid grid-cols-[3em_1fr] place-items-center">
                <span
                  onClick={() => setLockedPokemon(currentPokemon)}
                  className="cursor-pointer self-center justify-self-center text-2xl"
                  title="Lock to compare"
                >
                  ⇋
                </span>
              </div>
            )}

            {lockedPokemon && currentPokemon && (
              <>
                <PokemonTile pokemon={lockedPokemon} />
                <PokemonCompareTile
                  pokemon={currentPokemon}
                  compareTo={lockedPokemon}
                />
              </>
            )}
            {pokemonName && status === "loading" ? (
              <p>Loading...</p>
            ) : !currentPokemon || !pokemonName ? null : (
              <div
                className={` ${
                  !lockedPokemon ? "col-span-full justify-self-center" : ""
                }`}
              >
                <PokemonTile pokemon={currentPokemon} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
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
    <div className="flex gap-3">
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
      <Dictaphone
        onChange={(value) => {
          const sortedPokemon =
            allPokemon
              ?.map((pokemon) => ({
                pokemon,
                dist: distance(value, pokemon),
              }))
              .sort((a, b) => a.dist - b.dist)
              .map(({ pokemon }) => pokemon) ?? [];

          onChange(sortedPokemon[0] ?? "");
        }}
      />
    </div>
  );
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
