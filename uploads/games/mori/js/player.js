Player = new class {

  constructor() {

    this.x = 256;
    this.y = 256 * 4;

    this.speed = 4;

    this.facing = getRandomNumber() % 4;

    this.moving = false;

    this.move = [false, false, false, false];

    this.ticks = 0;

    this.has_shown_off_power_up = false;

    this.start_tile = -1;
    this.stop_tile = -1;

    this.goal_tile = -1;

    this.has_power_up = false;

    this.show_off_power_up = false;

    this.axis_to_move = undefined;
    this.steps_to_move = undefined;

    this.distance_up = 0;
    this.distance_down = 0;
    this.distance_left = 0;
    this.distance_right = 0;

    this.item = 0;

    this.inventory = {

      "02x01": 0,

      "07x00": 0,

      "00x01": 0,

      "01x01": 0,

      "03x01": 0,

      "04x01": 0
    };
  }

  update() {

    // Get the player's position on the tile grid.
    let tile_x = Math.floor(this.x / TILE_SIZE);
    let tile_y = Math.floor(this.y / TILE_SIZE);

    if (this.has_power_up) {

      if (!this.shown_off_powerup) {

        if (this.axis_to_move == undefined) {

          // Pick an axis to move along.
          this.axis_to_move = getRandomNumber() % 2;

          this.distance_up = tile_y;
          this.distance_down = NUMBER_OF_TILES_Y - tile_y;
          this.distance_left = tile_x;
          this.distance_right = NUMBER_OF_TILES_X - tile_x;
        }

        if (this.axis_to_move == 0) {

          // The player will be moved along the Y axis.

          if (this.distance_up > this.distance_down) {

            // Move up.

            this.facing = UP;

            if (this.goal_tile == -1) {

              this.goal_tile = tile_y - 10;
            }

            if (tile_y > this.goal_tile) {

              this.move[UP] = true;
            }
            else {

              this.shown_off_powerup = true;
            }
          }
          else {

            // Move down.

            this.facing = DOWN;

            if (this.goal_tile == -1) {

              this.goal_tile = tile_y + 10;
            }

            if (tile_y < this.goal_tile) {

              this.move[DOWN] = true;
            }
            else {

              this.shown_off_powerup = true;
            }
          }
        }
        else {

          // The player will be moved along the X axis.

          if (this.distance_left > this.distance_right) {

            // Move left.

            this.facing = LEFT;

            if (this.goal_tile == -1) {

              this.goal_tile = tile_x - 10;
            }

            if (tile_x > this.goal_tile) {

              this.move[LEFT] = true;
            }
            else {

              this.shown_off_powerup = true;
            }
          }
          else {

            // Move right.

            this.facing = RIGHT;

            if (this.goal_tile == -1) {

              this.goal_tile = tile_x + 10;
            }

            if (tile_x < this.goal_tile) {

              this.move[RIGHT] = true;
            }
            else {

              this.shown_off_powerup = true;
            }
          }
        }
      }

      let sound = "";

      sound += this.dropSnowball(tile_x - 1, tile_y);
      sound += this.dropSnowball(tile_x + 1, tile_y);
      sound += this.dropSnowball(tile_x, tile_y - 1);
      sound += this.dropSnowball(tile_x, tile_y + 1);

      if (sound.includes("hit")) {

        Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
      }

      if (sound.includes("plant")) {

        Momo.playSample(sound_plant, 1.0, 1.0, false, getUniqueIdentifier());
      }
    }

    for (let i = 1; i < 10; ++i) {

      if (Momo.isKeyPressed("" + i + "")) {

        Momo.playSample(sound_blip, 1.0, 1.0, false, getUniqueIdentifier());

        // Switch the current item based upon which number key was pressed.
        this.item = i - 1;
      }
    }

    if (Momo.isKeyPressed("z")) {

      Momo.playSample(sound_blip, 1.0, 1.0, false, getUniqueIdentifier());

      // Select the next item to the left.

      --this.item;

      if (this.item < 0) {

        this.item = 11;
      }
    }
    else if (Momo.isKeyPressed("c")) {

      Momo.playSample(sound_blip, 1.0, 1.0, false, getUniqueIdentifier());

      // Select the next item to the right.

      ++this.item;

      if (this.item > 11) {

        this.item = 0;
      }
    }

    if (!this.moving) {

      if (Momo.isKeyPressed("x")) {

        let tile_facing_x = tile_x;
        let tile_facing_y = tile_y;

        switch (this.facing) {

          case UP:

            tile_facing_y = tile_y - 1;
          break;

          case DOWN:

            tile_facing_y = tile_y + 1;
          break;

          case LEFT:

            tile_facing_x = tile_x - 1;
          break;

          case RIGHT:

            tile_facing_x = tile_x + 1;
          break;
        }

        for (let i = 0; i < spirits.length; ++i) {

          if (spirits[i].getTileX() == tile_facing_x && spirits[i].getTileY() == tile_facing_y) {

            if (spirits[i].isAlive()) {

              spirits[i].interact();

              return;
            }
          }
        }

        this.useItem();
      }

      if (Momo.isKeyDown("up")) {

        if (this.facing != UP) {

          this.facing = UP;

          this.ticks = 0;

          return;
        }

        if (this.ticks < 5) {

          ++this.ticks;

          return;
        }

        if (Map.getTileFlag(tile_x, tile_y - 1) == "f") {

          this.move[UP] = true;
        }
      }
      else if (Momo.isKeyDown("down")) {

        if (this.facing != DOWN) {

          this.facing = DOWN;

          this.ticks = 0;

          return;
        }

        if (this.ticks < 5) {

          ++this.ticks;

          return;
        }

        if (Map.getTileFlag(tile_x, tile_y + 1) == "f") {

          this.move[DOWN] = true;
        }
      }
      else if (Momo.isKeyDown("left")) {

        if (this.facing != LEFT) {

          this.facing = LEFT;

          this.ticks = 0;

          return;
        }

        if (this.ticks < 5) {

          ++this.ticks;

          return;
        }

        if (Map.getTileFlag(tile_x - 1, tile_y) == "f") {

          this.move[LEFT] = true;
        }
      }
      else if (Momo.isKeyDown("right")) {

        if (this.facing != RIGHT) {

          this.facing = RIGHT;

          this.ticks = 0;

          return;
        }

        if (this.ticks < 5) {

          ++this.ticks;

          return;
        }

        if (Map.getTileFlag(tile_x + 1, tile_y) == "f") {

          this.move[RIGHT] = true;
        }
      }
    }

    if (this.move[UP]) {

      this.moveUp();
    }
    else if (this.move[DOWN]) {

      this.moveDown();
    }
    else if (this.move[LEFT]) {

      this.moveLeft();
    }
    else if (this.move[RIGHT]) {

      this.moveRight();
    }
  }

  moveUp() {

    if (!this.moving) {

      this.start_tile = Math.floor(this.y / TILE_SIZE);
      this.stop_tile = this.start_tile - 1;

      this.moving = true;
    }

    if (this.y > this.stop_tile * TILE_SIZE) {

      this.y -= this.speed;
    }
    else {

      this.y = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[UP] = false;
    }
  }

  moveDown() {

    if (!this.moving) {

      this.start_tile = Math.floor(this.y / TILE_SIZE);
      this.stop_tile = this.start_tile + 1;

      this.moving = true;
    }

    if (this.y < this.stop_tile * TILE_SIZE) {

      this.y += this.speed;
    }
    else {

      this.y = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[DOWN] = false;
    }
  }

  moveLeft() {

    if (!this.moving) {

      this.start_tile = Math.floor(this.x / TILE_SIZE);
      this.stop_tile = this.start_tile - 1;

      this.moving = true;
    }

    if (this.x > this.stop_tile * TILE_SIZE) {

      this.x -= this.speed;
    }
    else {

      this.x = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[LEFT] = false;
    }
  }

  moveRight() {

    if (!this.moving) {

      this.start_tile = Math.floor(this.x / TILE_SIZE);
      this.stop_tile = this.start_tile + 1;

      this.moving = true;
    }

    if (this.x < this.stop_tile * TILE_SIZE) {

      this.x += this.speed;
    }
    else {

      this.x = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[RIGHT] = false;
    }
  }

  render() {

    Momo.drawClippedBitmap(

      image_tiles,

      TILE_SIZE + (TILE_SIZE * this.facing),

      0,

      TILE_SIZE,

      TILE_SIZE,

      this.x - Camera.getX(),

      this.y - Camera.getY()
    );
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }

  spawn() {

    // Select a random tile to spawn in.
    let spawn_x = getRandomNumber() % NUMBER_OF_TILES_X;
    let spawn_y = getRandomNumber() % NUMBER_OF_TILES_Y;

    if (spawn_x < 1 || spawn_y < 1 || spawn_x > NUMBER_OF_TILES_X - 1 || spawn_y > NUMBER_OF_TILES_Y - 1) {

      // The player spawned out of bounds; try again.
      this.spawn();

      return;
    }

    if (Map.getTileFlag(spawn_x, spawn_y) == "t") {

      // The tile is already occupied; try again.
      this.spawn();

      return;
    }

    // The tile is empty; spawn in it.
    this.x = spawn_x * TILE_SIZE;
    this.y = spawn_y * TILE_SIZE;
  }

  getItem() {

    return this.item;
  }

  useItem() {

    // Get the player's position on the tile grid.
    let tile_x = Math.floor(this.x / TILE_SIZE);
    let tile_y = Math.floor(this.y / TILE_SIZE);

    switch (this.item) {

      case 0:

        // Using action item.

        // Convert acorns to grass.
        if (Map.convertTile(tile_x, tile_y, "02x01t", "00x00f")) {

          this.addToInventory("02x01", 1);

          Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
        }

        // Convert mushrooms to grass.
        if (Map.convertTile(tile_x, tile_y, "07x00t", "00x00f")) {

          this.addToInventory("07x00", 1);

          Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
        }

        // Convert flowers to grass.
        if (Map.convertTile(tile_x, tile_y, "01x01f", "00x00f")) {

          this.addToInventory("01x01", 1);

          Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
        }

        // Convert dead trees to grass.
        if (Map.convertTile(tile_x, tile_y, "06x00t", "00x00f")) {

          if (getRandomNumber() % 2) {

            // Add an acorn to the inventory.
            this.addToInventory("02x01", 1);

            Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
          }
          else {

            // Add a stick to the inventory.
            this.addToInventory("03x01", 1);

            Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
          }
        }

        // Convert healthy trees to dead trees.
        if (Map.convertTile(tile_x, tile_y, "05x00t", "06x00t")) {

          Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
        }

        // Convert bones to grass.
        if (Map.convertTile(tile_x, tile_y, "00x01t", "00x00f")) {

          this.addToInventory("00x01", 1);

          Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
        }

        // Convert sticks to grass.
        if (Map.convertTile(tile_x, tile_y, "03x01t", "00x00f")) {

          this.addToInventory("03x01", 1);

          Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
        }

        // Convert snowballs to grass.
        if (Map.convertTile(tile_x, tile_y, "04x01f", "00x00f")) {

          this.addToInventory("04x01", 1);

          Momo.playSample(sound_hit, 1.0, 1.0, false, getUniqueIdentifier());
        }
      break;

      case 1:

        // Using acorn item.

        // Convert grass to acorn.
        if (this.inventory["02x01"] > 0) {

          if (Map.convertTile(tile_x, tile_y, "00x00f", "02x01t")) {

            this.removeFromInventory("02x01", 1);

            Momo.playSample(sound_plant, 1.0, 1.0, false, getUniqueIdentifier());
          }
        }
        else {

          Momo.playSample(sound_beep, 1.0, 1.0, false, getUniqueIdentifier());
        }
      break;

      case 2:

        // Using mushroom item.

        // Convert grass to mushroom.
        if (this.inventory["07x00"] > 0) {

          if (Map.convertTile(tile_x, tile_y, "00x00f", "07x00t")) {

            this.removeFromInventory("07x00", 1);

            Momo.playSample(sound_plant, 1.0, 1.0, false, getUniqueIdentifier());
          }
        }
        else {

          Momo.playSample(sound_beep, 1.0, 1.0, false, getUniqueIdentifier());
        }
      break;

      case 3:

        // Using bone item.

        // Convert grass to bone.
        if (this.inventory["00x01"] > 0) {

          if (Map.convertTile(tile_x, tile_y, "00x00f", "00x01t")) {

            this.removeFromInventory("00x01", 1);

            Momo.playSample(sound_plant, 1.0, 1.0, false, getUniqueIdentifier());
          }
        }
        else {

          Momo.playSample(sound_beep, 1.0, 1.0, false, getUniqueIdentifier());
        }
      break;

      case 4:

        // Using flower item.

        // Convert grass to flower.
        if (this.inventory["01x01"] > 0) {

          if (Map.convertTile(tile_x, tile_y, "00x00f", "01x01f")) {

            this.removeFromInventory("01x01", 1);

            Momo.playSample(sound_plant, 1.0, 1.0, false, getUniqueIdentifier());
          }
        }
        else {

          Momo.playSample(sound_beep, 1.0, 1.0, false, getUniqueIdentifier());
        }
      break;

      case 5:

        // Using stick item.

        // Convert grass to stick.
        if (this.inventory["03x01"] > 0) {

          if (Map.convertTile(tile_x, tile_y, "00x00f", "03x01t")) {

            this.removeFromInventory("03x01", 1);

            Momo.playSample(sound_plant, 1.0, 1.0, false, getUniqueIdentifier());
          }
        }
        else {

          Momo.playSample(sound_beep, 1.0, 1.0, false, getUniqueIdentifier());
        }
      break;

      case 6:

        // Using snowball item.

        // Convert grass to snowball.
        if (this.inventory["04x01"] > 0) {

          if (Map.convertTile(tile_x, tile_y, "00x00f", "04x01f")) {

            this.removeFromInventory("04x01", 1);

            Momo.playSample(sound_plant, 1.0, 1.0, false, getUniqueIdentifier());
          }
        }
        else {

          Momo.playSample(sound_beep, 1.0, 1.0, false, getUniqueIdentifier());
        }
      break;

      case 11:

        if (secret_key_presses == 3) {

          secret_key_presses = 0;

          Momo.playSample(sound_boom, 1.0, 1.0, false, getUniqueIdentifier());

          for (let y = 0; y < NUMBER_OF_TILES_Y; ++y) {

            for (let x = 0; x < NUMBER_OF_TILES_X; ++x) {

              if (Map.getTile(x, y) == "05x00") {

                // Convert trees to snowballs. This is a secret. ;)
                Map.setTile(x, y, "04x01f");
              }
            }
          }
        }
        else {

          ++secret_key_presses;
        }
      break;
    }
  }

  getFacingDirection() {

    return this.facing;
  }

  getInventoryCount(item) {

    if (typeof item == "string") {

      return this.inventory[item];
    }
    else {

      let keys = Object.keys(this.inventory);

      return this.inventory[keys[item]];
    }
  }

  getInventory() {

    return this.inventory;
  }

  addToInventory(item, amount) {

    this.inventory[item] += amount;

    if (this.inventory[item] > 64)  {

      this.inventory[item] = 64;
    }
  }

  removeFromInventory(item, amount) {

    if (typeof item == "number") {

      let keys = Object.keys(this.inventory);

      item = keys[item];
    }

    this.inventory[item] -= amount;

    if (this.inventory[item] < 0)  {

      this.inventory[item] = 0;
    }
  }

  upgrade() {

    this.has_power_up = true;
  }

  dropSnowball(tile_x, tile_y) {

    let sound = "";

    if (Map.getTileCode(tile_x, tile_y) != "99x99t" && Map.getTileCode(tile_x, tile_y) != "00x00t") {

      if (Map.getTile(tile_x, tile_y) != "04x01") {

        if (Map.getTile(tile_x, tile_y) != "00x00") {

          sound = "hit";
        }
        else {

          sound = "plant";
        }
      }

      Map.setTile(tile_x, tile_y, "04x01f");
    }

    return sound;
  }

  hasPowerUp() {

    return this.has_power_up;
  }
}
