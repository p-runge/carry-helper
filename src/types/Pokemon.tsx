type Pokemon = {
  name: string;
  stats: {
    attack: number;
    "special-attack": number;
    speed: number;
    hp: number;
    defense: number;
    "special-defense": number;
  };
  moveLevels: number[];
} | null;
