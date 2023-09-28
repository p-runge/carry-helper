export type Stat =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed";

export const gen2StatDiffs: Record<number, Partial<Record<Stat, number>>> = {
  12: {
    "special-attack": 80,
  },
  15: {
    attack: 80,
  },
  18: {
    speed: 91,
  },
  24: {
    attack: 85,
  },
  25: {
    defense: 30,
    "special-defense": 40,
  },
  26: {
    speed: 100,
  },
  31: {
    attack: 82,
  },
  34: {
    attack: 92,
  },
  36: {
    "special-attack": 85,
  },
  40: {
    "special-attack": 75,
  },
  45: {
    "special-attack": 100,
  },
  51: {
    attack: 80,
  },
  62: {
    attack: 85,
  },
  65: {
    "special-defense": 85,
  },
  71: {
    "special-defense": 60,
  },
  76: {
    attack: 110,
  },
  83: {
    attack: 65,
  },
  85: {
    speed: 100,
  },
  101: {
    speed: 140,
  },
  103: {
    "special-defense": 65,
  },
  164: {
    "special-attack": 76,
  },
  168: {
    "special-defense": 60,
  },
  181: {
    defense: 75,
  },
  182: {
    defense: 85,
  },
  184: {
    "special-attack": 50,
  },
  189: {
    "special-defense": 85,
  },
  191: {
    speed: 180,
  },
  211: {
    defense: 75,
  },
  219: {
    hp: 50,
    "special-attack": 80,
  },
  222: {
    hp: 55,
    defense: 85,
    "special-defense": 85,
  },
  226: {
    hp: 65,
  },
};
