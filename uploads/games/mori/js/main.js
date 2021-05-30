function main() {

  if (!Momo.initialize()) {

    // Failed to initialize Momo.
    return;
  }

  if (!Momo.setCanvas("game", CANVAS_W, CANVAS_H)) {

    // Failed to set the canvas.
    return;
  }

  Momo.setFrameRate(60);

  Momo.installKeyboard();

  loadResources();

  Momo.resourcesLoaded(

    () => {

      Momo.createLoop(

        () => {

          update();

          render();
        }
      );
    }
  );
}

function update() {

  if (Display.isTextShowing()) {

    Display.update();
  }
  else {

    Map.update();

    Player.update();

    Camera.update();

    for (let i = 0; i < spirits.length; ++i) {

      spirits[i].update();
    }

    if (!won && number_of_snowballs >= 100) {

      // The player reached the snow goal.

      won = true;

      Momo.playSample(sound_power_up, 1.0, 1.0, false, getUniqueIdentifier());

      Player.upgrade();

      Display.setText("Congratulations! You did it!");
      Display.setText("You reached the snow goal!");
      Display.setText("It took you " + Math.floor(Momo.getTime()) + " seconds.");
      Display.setText("Your prize is snowball feet! Try it!");
      Display.setText("Move around and watch the snow!");

      Display.showText();
    }
  }

  if (show_welcome_text) {

    show_welcome_text = false;

    Display.setText("Hey, welcome to the game. (Press X)");
    Display.setText("Z and C move the item selector.");
    Display.setText("The number keys do the same thing.");
    Display.setText("Press X to use the current item.");
    Display.setText("Use the arrow keys to move around.");
    Display.setText("Use \"!\" to interact with things.");
    Display.setText("You can trade with forest spirits.");
    Display.setText("Go forth and cover the land in snow!");

    Display.showText();
  }

  number_of_snowballs = 0;

  for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

    for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

      if (Map.getTile(x, y) == "04x01") {

        ++number_of_snowballs;
      }
    }
  }
}

function render() {

  Momo.clearCanvas(Momo.makeColor(0, 0, 0));

  Map.render();

  Player.render();

  for (let i = 0; i < spirits.length; ++i) {

    spirits[i].render();
  }

  Display.render();
}

function loadResources() {

  image_tiles = Momo.loadBitmap("uploads/games/mori/data/png/tiles.png");

  font_pixel = Momo.loadFont("uploads/games/mori/data/ttf/font_pixel.ttf");
  font_japanese = Momo.loadFont("uploads/games/mori/data/ttf/misaki_gothic.ttf");

  sound_hit = Momo.loadSample("uploads/games/mori/data/mp3/hit.mp3");
  sound_blip = Momo.loadSample("uploads/games/mori/data/mp3/blip.mp3");
  sound_beep = Momo.loadSample("uploads/games/mori/data/mp3/beep.mp3");
  sound_grow = Momo.loadSample("uploads/games/mori/data/mp3/grow.mp3");
  sound_boom = Momo.loadSample("uploads/games/mori/data/mp3/boom.mp3");
  sound_plant = Momo.loadSample("uploads/games/mori/data/mp3/plant.mp3");
  sound_power_up = Momo.loadSample("uploads/games/mori/data/mp3/power_up.mp3");

  Player.spawn();

  for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

    for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

      if (Map.getTile(x, y) == "04x02") {

        spirits[spirits.length] = new Spirit();

        // Spawn a spirit on this spirit spawner tile.
        spirits[spirits.length - 1].setSpawn(x * TILE_SIZE, y * TILE_SIZE);

        // Convert the spirit spawner tile to a solid grass tile.
        Map.setTile(x, y, "00x00t");
      }
    }
  }
}
