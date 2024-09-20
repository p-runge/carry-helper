import type { RouterOutputs } from "~/utils/api";
export type Pokemon = NonNullable<RouterOutputs["pokemon"]["fetchByName"]>;