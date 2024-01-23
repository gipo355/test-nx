export const testFibonacci = function testFibonacci(fibNumber: number) {
  const fib = (n: number): number => {
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
  };
  return fib(fibNumber);
};
