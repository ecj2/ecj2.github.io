Display = new class {

  constructor() {

    this.show_text = false;

    this.text = [];

    this.sequence = 0;

    this.use_japanese_font = false;
  }

  update() {

    if (this.show_text) {

      if (Momo.isKeyPressed("x")) {

        ++this.sequence;

        if (this.sequence >= this.text.length) {

          this.show_text = false;

          this.sequence = 0;

          this.text = [];
        }
      }
    }
  }

  render() {

    for (let i = 0; i < 12; ++i) {

      // Display item bar background.
      Momo.drawClippedBitmap(

        image_tiles,

        5 * TILE_SIZE,

        TILE_SIZE,

        TILE_SIZE,

        TILE_SIZE,

        i * TILE_SIZE,

        CANVAS_H - TILE_SIZE
      );
    }

    // Display item highlight.
    Momo.drawClippedBitmap(

      image_tiles,

      6 * TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      Player.getItem() * TILE_SIZE,

      CANVAS_H - TILE_SIZE
    );

    // Draw action item.
    Momo.drawClippedBitmap(

      image_tiles,

      7 * TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      0,

      CANVAS_H - TILE_SIZE
    );

    // Draw acorn item.
    Momo.drawClippedBitmap(

      image_tiles,

      2 * TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      CANVAS_H - TILE_SIZE
    );

    // Draw mushroom item.
    Momo.drawClippedBitmap(

      image_tiles,

      7 * TILE_SIZE,

      0,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE * 2,

      CANVAS_H - TILE_SIZE
    );

    // Draw bone item.
    Momo.drawClippedBitmap(

      image_tiles,

      0,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE * 3,

      CANVAS_H - TILE_SIZE
    );

    // Draw flower item.
    Momo.drawClippedBitmap(

      image_tiles,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE * 4,

      CANVAS_H - TILE_SIZE
    );

    // Draw stick item.
    Momo.drawClippedBitmap(

      image_tiles,

      TILE_SIZE * 3,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE * 5,

      CANVAS_H - TILE_SIZE
    );

    // Draw snowball item.
    Momo.drawClippedBitmap(

      image_tiles,

      TILE_SIZE * 4,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE,

      TILE_SIZE * 6,

      CANVAS_H - TILE_SIZE
    );

    for (let i = 2; i < 8; ++i) {

      let color = undefined;

      let item_count = Player.getInventoryCount(Object.keys(Player.getInventory())[i - 2]);

      if (item_count == 0 || item_count == 64) {

        color = Momo.makeColor(172, 172, 172);
      }
      else {

        color = Momo.makeColor(234, 248, 246);
      }

      // Draw how many of each item the player has.
      Momo.drawText(

        font_pixel,

        color,

        16,

        (64 * i) + 2,

        CANVAS_H - TILE_SIZE + 46,

        "right",

        item_count
      );
    }

    if (this.show_text) {

      for (let i = 1; i < 11; ++i) {

        // Draw text box.
        Momo.drawClippedBitmap(

          image_tiles,

          5 * TILE_SIZE,

          TILE_SIZE,

          TILE_SIZE,

          TILE_SIZE,

          i * TILE_SIZE,

          TILE_SIZE
        );
      }

      // Draw text.
      Momo.drawText(

        (this.use_japanese_font ? font_japanese : font_pixel),

        Momo.makeColor(255, 255, 255),

        16,

        TILE_SIZE + 16,

        TILE_SIZE + 24,

        "left",

        this.text[this.sequence]
      );
    }

    // Draw snow goal background.
    Momo.drawText(

      font_pixel,

      Momo.makeColor(76, 89, 95),

      16,

      17,

      17,

      "left",

      "Snow goal: " + number_of_snowballs + "%"
    );

    // Draw snow goal foreground.
    Momo.drawText(

      font_pixel,

      Momo.makeColor(234, 248, 246),

      16,

      16,

      16,

      "left",

      "Snow goal: " + number_of_snowballs + "%"
    );
  }

  isTextShowing() {

    return this.show_text;
  }

  setText(text, use_japanese_font) {

    this.text[this.text.length] = text;

    this.use_japanese_font = use_japanese_font;
  }

  showText() {

    this.show_text = true;
  }
}
