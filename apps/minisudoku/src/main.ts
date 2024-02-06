type sudoku = (null | number)[][];

const initialSudoku = [
  [null, null, null],
  [1, null, null],
  [null, null, null],
];

const possibleNumbers = [1, 2, 3];
type TPossibleNumber = typeof possibleNumbers;

const solveSudoku = (
  sudoku: sudoku,
  line: number,
  numbers: TPossibleNumber
): sudoku => {
  for (const number of numbers) {
    for (let [index, cellValue] of sudoku[line].entries()) {
      if (cellValue !== null) continue;

      cellValue = number;
    }
  }
};

console.log(solveSudoku(initialSudoku, 0, possibleNumbers));
