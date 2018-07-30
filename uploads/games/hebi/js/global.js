// Objects.

let LeftSnake = undefined;
let RightSnake = undefined;

let LeftFood = undefined;
let RightFood = undefined;

// Resources.

let font = undefined;

// Miscellaneous.

let left_score = 0;
let right_score = 0;

const BLOCK_SIZE = 20;
const HALF_BLOCK = BLOCK_SIZE / 2;

// Functions.

function reset() {

  LeftSnake.reset();
  RightSnake.reset();

  LeftFood.reset();
  RightFood.reset();

  left_score = 0;
  right_score = 0;

  Momo.setFrameRate(10);
}
