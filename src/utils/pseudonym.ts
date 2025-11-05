import { Faker, en } from "@faker-js/faker";

/**
 * Converts a hexadecimal hash string to a numeric seed
 * PHP's hash_hmac returns lowercase hexadecimal strings by default
 * @param hexHash - Hexadecimal hash string from PHP's hash_hmac
 * @returns A numeric seed for deterministic random generation
 */
function hashToSeed(hexHash: string): number {
  // Parse first 8 hex characters as base-16 integer
  // 8 hex chars = 32 bits (safe integer range)
  return parseInt(hexHash.substring(0, 8), 16);
}

/**
 * Converts a hash pseudonym to a readable format
 * @param hash - The hash string from author.pseudonym
 * @returns A readable pseudonym like "Swift Penguin"
 */
export function readablePseudonym(hash: string): string {
  const seed = hashToSeed(hash);
  const faker = new Faker({ locale: [en] });
  faker.seed(seed);

  const adjective = faker.word.adjective();
  const color = faker.color.human();

  return `${adjective}-${color}`;
}
