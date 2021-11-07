export default function LCG(seed : number = 1) : Function {
    return function() : number {
      seed = Math.imul(48271, seed) | 0 % 2147483647;
      return (seed & 2147483647) / 2147483648;
    }
}