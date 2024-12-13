import { z } from "zod";
import { Snowflake } from "./discord";

export const BaseConfigSchema = z.object({
  guildId: Snowflake,
});

export function findDuplicates(arr: string[]): string[] {
  const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);
  return duplicates;
}
