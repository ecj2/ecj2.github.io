let Map = undefined;
let Camera = undefined;
let Player = undefined;
let Display = undefined;

let spirits = [];

let image_tiles = undefined;

let font_pixel = undefined;
let font_japanese = undefined;

let sound_hit = undefined;
let sound_blip = undefined;
let sound_beep = undefined;
let sound_grow = undefined;
let sound_boom = undefined;
let sound_plant = undefined;
let sound_power_up = undefined;

let number_of_snowballs = 0;

let won = false;

let secret_key_presses = 0;

let show_welcome_text = true;

let names = [

  "Eric",

  "Emily",

  "Zach",

  "Alex",

  "Robyn",

  "Bill",

  "Sadie",

  "Rolf",

  "Lisa",

  "Jim",

  "Karen",

  "Rod",

  "Susan",

  "David",

  "Megan",

  "Trent",

  "Sally",

  "Pablo",

  "Takaaki",

  "Cherri",

  "Drake",

  "Brandon",

  "Laurie",

  "Neil"
];

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

const TILE_SIZE = 64;

const CANVAS_W = 768;
const CANVAS_H = 448;

const NUMBER_OF_TILES_X = 12 * 16;
const NUMBER_OF_TILES_Y = 6 * 16;

function getRandomNumber() {

  return Math.floor(Math.random() * 100);
}

let identifiers = [];

function getUniqueIdentifier() {

  // Get a random number.
  let identifier = Math.abs(Math.random() * Number.MAX_SAFE_INTEGER | 0);

  // Check if the identifier has already been used.
  if (identifiers.indexOf(identifier) !== -1) {

    // The identifier is not unique; try again.
    return getUniqueIdentifier();
  }

  // The identifier is unique; add it to the array.
  identifiers.push(identifier);

  return identifier;
}
