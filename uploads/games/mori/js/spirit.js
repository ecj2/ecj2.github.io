class Spirit {

  constructor() {

    this.x = 0;
    this.y = 0;

    this.facing = UP;

    this.alive = true;

    this.name = names[getRandomNumber() % names.length];

    this.times_spoken_to = 0;

    this.desired = {item_code: "", item_text: "", quantity: 0};

    // Randomly select a desired item.
    this.desired["item_code"] = getRandomNumber() % 6;

    // Randomly select a quantity of said item.
    this.desired["quantity"] = 1 + (getRandomNumber() % 9);

    // Get the item's name in English.
    switch (this.desired["item_code"]) {

      case 0:

        this.desired["item_text"] = "acorns";
      break;

      case 1:

        this.desired["item_text"] = "mushrooms";
      break;

      case 2:

        this.desired["item_text"] = "bones";
      break;

      case 3:

        this.desired["item_text"] = "flowers";
      break;

      case 4:

        this.desired["item_text"] = "sticks";
      break;

      case 5:

        this.desired["item_text"] = "snowballs";
      break;
    }
  }

  update() {

    if (!this.alive) {

      return;
    }

    if (this.x < Camera.getX() - TILE_SIZE || this.x > Camera.getX() + CANVAS_W) {

      // The spirit is outside of the camera's horizontal view; don't update.
      return;
    }

    if (this.y < Camera.getY() - TILE_SIZE || this.y > Camera.getY() + CANVAS_H) {

      // The spirit is outside of the camera's vertical view; don't update.
      return;
    }

    // Face the player.

    if (Player.getX() < this.x) {

      this.facing = LEFT;
    }
    else if (Player.getX() > this.x) {

      this.facing = RIGHT;
    }
    else if (Player.getY() < this.y) {

      this.facing = UP;
    }
    else if (Player.getY() > this.y) {

      this.facing = DOWN;
    }
  }

  render() {

    if (!this.alive) {

      return;
    }

    if (this.x < Camera.getX() - TILE_SIZE || this.x > Camera.getX() + CANVAS_W) {

      // The spirit is outside of the camera's horizontal view; don't render.
      return;
    }

    if (this.y < Camera.getY() - TILE_SIZE || this.y > Camera.getY() + CANVAS_H) {

      // The spirit is outside of the camera's vertical view; don't render.
      return;
    }

    Momo.drawClippedBitmap(

      image_tiles,

      TILE_SIZE * this.facing,

      TILE_SIZE * 2,

      TILE_SIZE,

      TILE_SIZE,

      this.x - Camera.getX(),

      this.y - Camera.getY()
    );
  }

  setSpawn(x, y) {

    this.x = x;
    this.y = y;
  }

  interact() {

    if (Player.hasPowerUp()) {

      // The player has met the snow goal.
      Display.setText("Thanks for all the snow!");

      Display.showText();

      return;
    }

    if (this.times_spoken_to == 0 || Player.getItem() == 0) {

      if (this.times_spoken_to == 0) {

        // Give introduction.
        Display.setText("Hi there. I'm " + this.name + ".");
        Display.setText("I have a snow-maker in my soul!");
        Display.setText("Want snowballs? Bring me items!");
        Display.setText("I want " + this.desired["item_text"] + "! Bring me " + this.desired["quantity"] + "!");
        Display.setText("Approach me with the item selected...");
      }
      else {

        switch (getRandomNumber() % 7) {

          case 0:

            Display.setText("I love haikus. I'll recite one now.");
            Display.setText("Over-ripe sushi, the Master...");
            Display.setText("... is full of regret.");
            Display.setText("That was by Yosa Buson. Cool, eh?");
          break;

          case 1:

            Display.setText("Listen to my joke! So a vegan...");
            Display.setText("... a clown, and a dog visit a bar...");
            Display.setText("... they have a great time!");
            Display.setText("HAHAHAHAHAHAHAHAHAHAHAHAHA!!!");
            Display.setText("Wait... why aren't you laughing?");
            Display.setText("...");
          break;

          case 2:

            Display.setText("Hey! Listen to this haiku:");
            Display.setText("The wren earns his living...");
            Display.setText("... noiselessly.");
            Display.setText("That one was by Kobayashi Issa!");
          break;

          case 3:

            Display.setText("That which is below...");
            Display.setText("... is like that which is above.");
            Display.setText("Likewise, that which is above...");
            Display.setText("... is like that which is below.");
            Display.setText("That's from the Emerald Tablet.");
            Display.setText("Alchemy rocks!");
          break;

          case 4:

            Display.setText("昨日、わたしのくるまがジャイアントなねこにたべられた！", true);
            Display.setText("けっきょく、いのちはもくてきといみがない・・・", true);
            Display.setText("きみは日本語をよめるか？", true);
          break;

          case 5:

            Display.setText("You know, we die when we make snow...");
          break;

          case 6:

            Display.setText("Strive to reach your goals!");
            Display.setText("I believe in you!");
          break;
        }
      }
    }
    else if (Player.getItem() < 7) {

      if (Player.getItem() == this.desired["item_code"] + 1) {

        // The player has the desired item selected.

        if (Player.getInventoryCount(this.desired["item_code"]) >= this.desired["quantity"]) {

          // The player has a sufficient quantity.

          Display.setText("Thanks for the " + this.desired["item_text"] + "!");
          Display.setText("I give my life for you!");
          Display.setText("Enjoy the snowballs!");

          // Remove the item from the player's inventory.
          Player.removeFromInventory(this.desired["item_code"], this.desired["quantity"]);

          // Give the player some snowballs.
          Player.addToInventory("04x01", 2 + (getRandomNumber() % 8));

          // Kill this spirit.
          this.alive = false;

          Momo.playSample(sound_boom, 1.0, 1.0, false, getUniqueIdentifier());

          // Drop a bone.
          Map.setTile(this.getTileX(), this.getTileY(), "00x01t");
        }
        else {

          // The player has an insufficient quantity.
          Display.setText("You don't have enough " + this.desired["item_text"] + "!");
        }
      }
      else {

        // The player tried to give this spirit something it didn't want.
        Display.setText("I don't want that junk!");
      }
    }

    if (Player.getItem() < 7) {

      Display.showText();
    }

    ++this.times_spoken_to;
  }

  getTileX() {

    return Math.floor(this.x / TILE_SIZE);
  }

  getTileY() {

    return Math.floor(this.y / TILE_SIZE);
  }

  isAlive() {

    return this.alive;
  }
}
