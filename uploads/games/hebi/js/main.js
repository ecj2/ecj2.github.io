async function main() {

  Momo.initialize();

  Momo.setCanvas("game", 800 + BLOCK_SIZE, 400);

  Momo.installKeyboard();

  Momo.setFrameRate(15);

  Food.changeLocation();
  Food2.changeLocation();

  font = await Momo.loadFont("uploads/games/hebi/data/woff/pixel.woff");

  if (!font) {

    alert("font failed");
  }

  Momo.createLoop(

    () => {

      update();

      render();
    }
  );
}

function update() {

  if (Momo.isKeyPressed("space")) {

    Snake.number_of_chains += 15;
    Snake2.number_of_chains += 15;
  }

  if (reset) {

    score[0] = 0;
    score[1] = 0;

    Snake.reset();
    Snake2.reset();

    reset = false;
  }
  else {

    Snake.update();
    Snake2.update();
  }
}

function render() {

  Momo.clearCanvas(Momo.makeColor(169, 204, 101));

  Snake.render();
  Food.render();

  Momo.drawText(font, Momo.makeColor(37, 48, 18), 30, 200, 10, "center", score[0]);

  Momo.saveCanvasState();

  Momo.translateCanvas(400 + BLOCK_SIZE, 0);

  let context = Momo.getCanvasContext();

  Momo.drawRectangle(0, 0, 400 + BLOCK_SIZE, Momo.getCanvasHeight(), Momo.makeColor(0, 0, 0));

  context.clip();

  Momo.clearCanvas(Momo.makeColor(169, 204, 101));

  Snake2.render();
  Food2.render();

  Momo.drawText(font, Momo.makeColor(37, 48, 18), 30, 200, 10, "center", score[1]);

  Momo.restoreCanvasState();

  // Draw vertical screen separator.
  Momo.drawFilledRectangle(400, 0, 400 + BLOCK_SIZE, Momo.getCanvasHeight(), Momo.makeColor(255, 255, 255));
}

Momo.setEntryPoint(main);
