Map = new class {

  constructor() {

    this.tiles = [];

    for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

      this.tiles[x] = [NUMBER_OF_TILES_Y];
    }

    for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

      for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

        // Populate the map with grass tiles.
        this.tiles[x][y] = "00x00f";

        if (x == 0 || x == NUMBER_OF_TILES_X - 1 || y == 0 || y == NUMBER_OF_TILES_Y - 2) {

          // Surround the map with a solid boundary.
          this.tiles[x][y] = "99x99t";
        }
      }
    }

    this.ticks = [];

    for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

      this.ticks[x] = [NUMBER_OF_TILES_Y];
    }

    for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

      for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

        this.ticks[x][y] = 300 + (60 * (getRandomNumber() % 6));
      }
    }

    // Generate mushrooms.
    this.generateTerrain(45, "07x00t");

    // Generate trees.
    this.generateTerrain(3, "05x00t");

    // Generate flowers.
    this.generateTerrain(40, "01x01f");

    // Generate forest spirit spawners.
    this.generateTerrain(99, "04x02t");
  }

  update() {

    for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

      for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

        if (this.tiles[x][y] == "02x01t") {

          --this.ticks[x][y];

          if (this.ticks[x][y] < 0) {

            // Convert acorn to tree.
            this.tiles[x][y] = "05x00t";

            Momo.playSample(sound_grow, 1.0, 1.0, false, getUniqueIdentifier());

            this.ticks[x][y] = 300 + (60 * (getRandomNumber() % 6));
          }
        }
      }
    }
  }

  render() {

    for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

      if (y * TILE_SIZE < Camera.getY() - TILE_SIZE) {

        continue;
      }

      if (y * TILE_SIZE > Camera.getY() + (TILE_SIZE * 6)) {

        continue;
      }

      for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

        if (x * TILE_SIZE < Camera.getX() - TILE_SIZE) {

          continue;
        }

        if (x * TILE_SIZE > Camera.getX() + (TILE_SIZE * 12)) {

          continue;
        }

        // Split each tile into its axes.
        let axis_x = this.tiles[x][y].substring(0, 2);
        let axis_y = this.tiles[x][y].substring(4, 5);

        // Draw grass beneath each tile.
        Momo.drawClippedBitmap(

          image_tiles,

          0,

          0,

          TILE_SIZE,

          TILE_SIZE,

          x * TILE_SIZE - Camera.getX(),

          y * TILE_SIZE - Camera.getY()
        );

        // Draw each tile.
        Momo.drawClippedBitmap(

          image_tiles,

          axis_x * TILE_SIZE,

          axis_y * TILE_SIZE,

          TILE_SIZE,

          TILE_SIZE,

          x * TILE_SIZE - Camera.getX(),

          y * TILE_SIZE - Camera.getY()
        );
      }
    }
  }

  generateTerrain(probability, tile_code) {

    for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

      for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

        if (getRandomNumber() % probability == 1) {

          if (this.tiles[x][y] == "00x00f") {

            // Place the new tile on top of the old grass tile.
            this.tiles[x][y] = tile_code;
          }
        }
      }
    }
  }

  getTileFlag(x, y) {

    return this.tiles[x][y].substring(5, 6);
  }

  getTile(x, y) {

    return this.tiles[x][y].substring(0, 5);
  }

  getTileCode(x, y) {

    return this.tiles[x][y];
  }

  setTile(x, y, tile_code) {

    this.tiles[x][y] = tile_code;
  }

  convertTile(x, y, condition_tile_code, tile_code) {

    switch (Player.getFacingDirection()) {

      case UP:

        --y;
      break;

      case DOWN:

        ++y;
      break;

      case LEFT:

        --x;
      break;

      case RIGHT:

        ++x;
      break;
    }

    if (x >=0 && x <= NUMBER_OF_TILES_X && y >= 0 && y <= NUMBER_OF_TILES_Y) {

      if (this.tiles[x][y] == condition_tile_code) {

        this.tiles[x][y] = tile_code;

        return true;
      }
    }

    return false;
  }
}
