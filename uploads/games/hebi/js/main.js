async function main() {

  Momo.initialize();

  Momo.setCanvas("game", 800 + BLOCK_SIZE, 400);

  Momo.installKeyboard();

  Momo.setFrameRate(10);

  await loadResources();

  Momo.createLoop(

    () => {

      update();

      render();
    }
  );
}

async function loadResources() {

  font = await Momo.loadFont("uploads/games/hebi/data/woff/pixel.woff");

  if (!font) {

    alert("Error: failed to load font.");
  }

  LeftSnake = new Snake();
  RightSnake = new Snake();

  LeftFood = new Food();
  RightFood = new Food();

  // Spawn the food in random locations.
  LeftFood.changeLocation();
  RightFood.changeLocation();
}

function update() {

  if (Momo.isKeyPressed("space")) {

    LeftSnake.number_of_segments = 50;
    RightSnake.number_of_segments = 50;
  }

  if (Momo.isKeyPressed("up")) {

    LeftSnake.moveUp();
    RightSnake.moveUp();
  }
  else if (Momo.isKeyPressed("down")) {

    LeftSnake.moveDown();
    RightSnake.moveDown();
  }
  else if (Momo.isKeyPressed("left")) {

    LeftSnake.moveLeft();
    RightSnake.moveLeft();
  }
  else if (Momo.isKeyPressed("right")) {

    LeftSnake.moveRight();
    RightSnake.moveRight();
  }

  updateLeftGame();
  updateRightGame();

  let i = 0;

  for (i; i < LeftSnake.getSegmentSize(); ++i) {

    if (LeftFood.getX() === LeftSnake.getSegmentsX()[i] && LeftFood.getY() === LeftSnake.getSegmentsY()[i]) {

      // Move the left food if it spawns on the left snake's segment.
      LeftFood.changeLocation();
    }
  }

  i = 0;

  for (i; i < RightSnake.getSegmentSize(); ++i) {

    if (RightFood.getX() === RightSnake.getSegmentsX()[i] && RightFood.getY() === RightSnake.getSegmentsY()[i]) {

      // Move the right food if it spawns on the right snake's segment.
      RightFood.changeLocation();
    }
  }
}

function updateLeftGame() {

  if (LeftSnake.getX() === LeftFood.getX() && LeftSnake.getY() === LeftFood.getY()) {

    LeftSnake.addSegment();

    LeftFood.changeLocation();

    ++left_score;

    Momo.setFrameRate(Momo.getFrameRate() + 0.25);
  }

  if (LeftSnake.getX() < 0 || LeftSnake.getY() < 0) {

    reset();
  }

  if (LeftSnake.getX() + BLOCK_SIZE > 400 || LeftSnake.getY() + BLOCK_SIZE > 400) {

    reset();
  }

  LeftSnake.update();
}

function updateRightGame() {

  if (RightSnake.getX() === RightFood.getX() && RightSnake.getY() === RightFood.getY()) {

    RightSnake.addSegment();

    RightFood.changeLocation();

    ++right_score;

    Momo.setFrameRate(Momo.getFrameRate() + 0.25);
  }

  if (RightSnake.getX() < 0 || RightSnake.getY() < 0) {

    reset();
  }

  if (RightSnake.getX() + BLOCK_SIZE > 400 || RightSnake.getY() + BLOCK_SIZE > 400) {

    reset();
  }

  RightSnake.update();
}

function render() {

  renderLeftGame();

  Momo.saveCanvasState();

  Momo.translateCanvas(400 + BLOCK_SIZE, 0);

  renderRightGame();

  Momo.restoreCanvasState();

  // Draw vertical screen separator.
  Momo.drawFilledRectangle(400, 0, 400 + BLOCK_SIZE, Momo.getCanvasHeight(), Momo.makeColor(255, 255, 255));
}

function renderLeftGame() {

  Momo.clearCanvas(Momo.makeColor(169, 204, 101));

  LeftSnake.render();
  LeftFood.render();

  Momo.drawText(font, Momo.makeColor(37, 48, 18), 30, 200, 10, "center", left_score);
}

function renderRightGame() {

  Momo.clearCanvas(Momo.makeColor(169, 204, 101));

  RightSnake.render();
  RightFood.render();

  Momo.drawText(font, Momo.makeColor(37, 48, 18), 30, 200, 10, "center", right_score);
}

Momo.setEntryPoint(main);
