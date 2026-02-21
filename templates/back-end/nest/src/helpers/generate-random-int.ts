import { randomInt } from 'node:crypto';

export const generateRandomInt = (min: number, max: number) => {
  return randomInt(min, max);
};
