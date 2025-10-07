var debug = false;

var frame = 0;
var ticks = 0;

var score = 0;

// Global tile dimensions.
var tile_w = 64;
var tile_h = 64;

// Global bitmaps.
var bitmap_map = null;
var bitmap_keebo = null;
var bitmap_dialogue = null
var bitmap_gourdonian = null;

// Global fonts.
var font_cartoon = null;
var font_cartoon_smaller = null;

// Global samples.
var sample_hit = null;
var sample_special = null;
var sample_powerup = null;
var sample_pick_up = null;
var sample_place_bomb = null;
var sample_special_explosion = null;

var talking = false;

var item = ["sticks", "pebbles", "carrots"];

var strings = [];

var names = [

  "Bob",
  "Joe",
  "Gary",
  "Mike",
  "Alex",
  "Eric",
  "Emily",
  "Megan",
  "Yuki",
  "Lisa",
  "Sadie",
  "Rachel"
];

var state = 0;

// Game states.
const INTRO = 0;
const GAME = 1;
const WIN = 2;
const CREDITS = 3;

var credits_y = -220;

// Inventory stuff.
const STICKS = 0;
const PEBBLES = 1;
const CARROTS = 2;
const SPECIAL = 3;
const EGGS = 4;

// Facing directions.
const FACING_UP = 0;
const FACING_DOWN = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

function getRandomNumber() {

  // Return a random number between 0 and 1000.
  return (Math.random() * 1000).toFixed(0);
}

function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {

  return (Math.abs(ax - bx) * 2 < (aw + bw)) && (Math.abs(ay - by) * 2 < (ah + bh));
}

Map = function() {

  var w = 0;
  var h = 0;

  var tiles = [];

  var tiles_per_screen_x = 0;
  var tiles_per_screen_y = 0;

  var bitmap = null;

  this.setup = function() {

    tiles_per_screen_x = 12;
    tiles_per_screen_y = 7;

    w = tiles_per_screen_x * 16;
    h = tiles_per_screen_y * 16;

    for (var i = 0; i < w; ++i) {

      tiles[i] = [h];
    }

    for (var i = 0; i < w; ++i) {

      for (var j = 0; j < h; ++j) {

        // Cover the map with grass initially.
        tiles[i][j] = "00x00n";
      }
    }

    bitmap = bitmap_map;

    for (var i = 0; i < w; ++i) {

      for (var j = 0; j < h; ++j) {

        if (i == 0 || j == 0 || i == w - 1 || j == h - 1) {

          // Place solid boundaries on edges of map.
          tiles[i][j] = "03x00y";
        }
      }
    }

    // Generate rocks.
    this.generateTiles(45, "02x00y");

    // Generate carrots.
    this.generateTiles(80, "04x00n");

    // Generate trees.
    this.generateTiles(3, "01x00y");

    // Generate hives.
    this.generateTiles(99, "08x00y");

    // Generate Gourdonian spawn marker.
    this.generateTiles(99, "07x00y");
  };

  this.generateTiles = function(percent, tile_code) {

    for (var i = 0; i < w; ++i) {

      for (var j = 0; j < h; ++j) {

        if (getRandomNumber() % percent == 1) {

          if (tiles[i][j].substring(0, 5) != "00x00") {

            // Terrain should only be generated on grass, which this is not.
            continue;
          }

          tiles[i][j] = tile_code;
        }
      }
    }
  };

  this.update = function() {

    //
  };

  this.render = function(cam_x, cam_y) {

    for (var i = 0; i < w; ++i) {

      if (i * tile_w < cam_x - tile_w) {

        // Do not draw tiles outside of the camera's view.
        continue;
      }

      if (i * tile_w > cam_x + (tile_w * tiles_per_screen_x)) {

        // Do not draw tiles outside of the camera's view.
        continue;
      }

      for (var j = 0; j < h; ++j) {

        if (j * tile_h < cam_y - tile_h) {

          // Do not draw tiles outside of the camera's view.
          continue;
        }

        if (j * tile_h > cam_y + (tile_h * tiles_per_screen_y)) {

          // Do not draw tiles outside of the camera's view.
          continue;
        }

        // Split the tile code into its axes.
        var sx = tiles[i][j].substring(0, 2);
        var sy = tiles[i][j].substring(3, 5);

        // Draw a layer of grass before anything else.
        al_draw_bitmap_region(

          bitmap,

          0,

          0 + (tile_h * frame),

          tile_w,

          tile_h,

          tile_w * i - cam_x,

          tile_h * j - cam_y,

          0
        );

        if (tiles[i][j].substring(0, 5) == "00x00") {

          // Skip drawing grass again.
          continue;
        }

        if (debug) {

          var color = al_map_rgb(0, 0, 255);

          if (tiles[i][j].substring(5, 6) == "y") {

            // Display solid tiles as pink.
            color = al_map_rgb(255, 0, 255);
          }

          al_draw_filled_rectangle(

            tile_w * i - cam_x,

            tile_h * j - cam_y,

            tile_w * i - cam_x + tile_w,

            tile_h * j - cam_y + tile_h,

            color
          );
        }

        // Draw the appropriate tile.
        al_draw_bitmap_region(

          bitmap,

          tile_w * sx,

          tile_h * sy + (tile_h * frame),

          tile_w,

          tile_h,

          tile_w * i - cam_x,

          tile_h * j - cam_y,

          0
        );
      }
    }
  };

  this.getW = function() {

    return w;
  };

  this.getH = function() {

    return h;
  };

  this.getTiles = function() {

    return tiles;
  };

  this.setTile = function(x, y, tile_code) {

    if (x < 0 || x > w - 1 || y < 0 || y > h - 1) {

      // Do not place tiles out of bounds.
      return;
    }

    if (tiles[x][y].substring(0, 5) == "03x00") {

      // Do not replace boundary skulls.
      return;
    }

    tiles[x][y] = tile_code;
  };

  this.convertTile = function(x, y, special = false) {

    if (x < 0 || x > w - 1 || y < 0 || y > h - 1) {

      // Do not place tiles out of bounds.
      return;
    }

    if (tiles[x][y].substring(0, 5) == "03x00") {

      // Do not remove boundary skulls.
      return;
    }

    if (special) {

      if (tiles[x][y].substring(0, 5) == "08x00") {

        // Convert hives to Easter eggs.
        tiles[x][y] = "10x00n";
      }
    }

    if (tiles[x][y].substring(0, 5) == "01x00") {

      // Convert trees to sticks.
      tiles[x][y] = "05x00n";
    }

    if (tiles[x][y].substring(0, 5) == "02x00") {

      // Convert rock to pebbles.
      tiles[x][y] = "06x00n";
    }
  };
}

Text = function() {

  var source = [];
  var string = "";

  var current_source = 0;
  var current_character = 0;

  var queue = 0;
  var screens = 0;

  this.update = function() {

    //
  };

  this.render = function(center = false) {

    // @TODO: Copy font to local member.

    var flag = 0;
    var dx = 32;

    if (center) {

      flag = ALLEGRO_ALIGN_CENTER;
      dx = al_get_display_width() / 2;
    }

    for (var i = 0; i < source.length; ++i) {

      if (center) {

        al_draw_text(

          font_cartoon,

          al_map_rgb(255, 255, 0),

          al_get_display_width() / 2,

          al_get_display_height() / 2 - font_cartoon.size / 2,

          flag,

          source[i]
        );
      }
      else {

        al_draw_text(

          font_cartoon,

          al_map_rgb(255, 255, 255),

          dx,

          -15 + 32 + (font_cartoon["size"] * i),

          flag,

          source[i]
        );
      }
    }
  };

  this.setText = function(text, q = 0) {

    source[source.length] = text;
  };

  this.clear = function() {

    source = [];

    string = "";

    current_source = 0;

    current_character = 0;

    queue = 0;

    screens = 0;
  };

  this.next = function() {

    ++queue;

    if (queue > screens) {

      // No more text in the queue.
      this.clear();
    }
  };
}

Keebo = function() {

  var x = 0;
  var y = 0;
  var w = 0;
  var h = 0;

  var speed = 0;

  var bitmap = null;

  var facing_direction = [false, false, false, false];

  var inventory = [];

  var show_bomb = false;

  var bomb_x = 0;
  var bomb_y = 0;

  var bomb_ticks = 0;

  var show_special_bomb = false;

  var special_bomb_x = 0;
  var special_bomb_y = 0;

  var special_bomb_ticks = 0;

  var special = false;

  var got_special = false;

  var got_eggs = false;

  this.setup = function() {

    x = 64 + (getRandomNumber() % (Map.getW() - 3)) * 64;
    y = 64 + (getRandomNumber() % (Map.getH() - 3)) * 64;

    w = tile_w;
    h = tile_h;

    speed = 3;

    this.setBitmap(bitmap_keebo);

    // Set random facing direction.
    this.setFacingDirection(getRandomNumber() % 4);

    // Set the tile where Keebo spawns to grass.
    Map.setTile(x / w, y / h, "00x00n");

    // Surround Keebo with rocks initially.
    Map.setTile(x / w + 1, y / h, "02x00y");
    Map.setTile(x / w - 1, y / h, "02x00y");
    Map.setTile(x / w, y / h + 1, "02x00y");
    Map.setTile(x / w, y / h - 1, "02x00y");

    inventory[STICKS] = 0;
    inventory[PEBBLES] = 0;
    inventory[CARROTS] = 0;
    inventory[SPECIAL] = 0;
    inventory[EGGS] = 0;

    show_bomb = false;

    bomb_x = 0;
    bomb_y = 0;

    bomb_ticks = 0;

    special = false;

    got_special = false;

    got_eggs = false;
  };

  this.update = function() {

    if (talking) {

      return false;
    }

    // @TODO: Skip tiles that are not within the camera's view for collision.

    // Shrink width and height for looser collision detection.
    w *= 3/4;
    h *= 3/4;

    var tiles = Map.getTiles();

    if (_key[ALLEGRO_KEY_UP]) {

      y -= speed;

      this.setFacingDirection(FACING_UP);

      for (var i = 0; i < Map.getW(); ++i) {

        for (var j = 0; j < Map.getH(); ++j) {

          if (tiles[i][j].substring(5, 6) == "y") {

            while (isColliding(x, y, w, h, i * tile_w, j * tile_h, tile_w, tile_h)) {

              ++y;
            }
          }
        }
      }

      for (var i = 0; i < number_of_gourdonians; ++i) {

        while (isColliding(x, y, w, h, Gourdonians[i].getX(), Gourdonians[i].getY(), tile_w, tile_h)) {

          ++y;
        }
      }
    }

    if (_key[ALLEGRO_KEY_DOWN]) {

      y += speed;

      this.setFacingDirection(FACING_DOWN);

      for (var i = 0; i < Map.getW(); ++i) {

        for (var j = 0; j < Map.getH(); ++j) {

          if (tiles[i][j].substring(5, 6) == "y") {

            while (isColliding(x, y, w, h, i * tile_w, j * tile_h, tile_w, tile_h)) {

              --y;
            }
          }
        }
      }

      for (var i = 0; i < number_of_gourdonians; ++i) {

        while (isColliding(x, y, w, h, Gourdonians[i].getX(), Gourdonians[i].getY(), tile_w, tile_h)) {

          --y;
        }
      }
    }

    if (_key[ALLEGRO_KEY_LEFT]) {

      x -= speed;

      this.setFacingDirection(FACING_LEFT);

      for (var i = 0; i < Map.getW(); ++i) {

        for (var j = 0; j < Map.getH(); ++j) {

          if (tiles[i][j].substring(5, 6) == "y") {

            while (isColliding(x, y, w, h, i * tile_w, j * tile_h, tile_w, tile_h)) {

              ++x;
            }
          }
        }
      }

      for (var i = 0; i < number_of_gourdonians; ++i) {

        while (isColliding(x, y, w, h, Gourdonians[i].getX(), Gourdonians[i].getY(), tile_w, tile_h)) {

          ++x;
        }
      }
    }

    if (_key[ALLEGRO_KEY_RIGHT]) {

      x += speed;

      this.setFacingDirection(FACING_RIGHT);

      for (var i = 0; i < Map.getW(); ++i) {

        for (var j = 0; j < Map.getH(); ++j) {

          if (tiles[i][j].substring(5, 6) == "y") {

            while (isColliding(x, y, w, h, i * tile_w, j * tile_h, tile_w, tile_h)) {

              --x;
            }
          }
        }
      }

      for (var i = 0; i < number_of_gourdonians; ++i) {

        while (isColliding(x, y, w, h, Gourdonians[i].getX(), Gourdonians[i].getY(), tile_w, tile_h)) {

          --x;
        }
      }
    }

    // Shrink width and height for even looser collision with items.
    w = 8;
    h = 8;

    for (var i = 0; i < Map.getW(); ++i) {

      for (var j = 0; j < Map.getH(); ++j) {

        var play_sound = false;

        if (isColliding(x, y, w, h, i * tile_w, j * tile_h, tile_w, tile_h)) {

          switch (tiles[i][j].substring(0, 5)) {

            case "04x00":

              score += 30;

              ++inventory[CARROTS];

              // Pick up carrots.
              Map.setTile(i, j, "00x00n");

              play_sound = true;
            break;

            case "05x00":

              score += 10;

              ++inventory[STICKS];

              // Pick up sticks.
              Map.setTile(i, j, "00x00n");

              play_sound = true;
            break;

            case "06x00":

              score += 20;

              // Each rock drops 3 pebbles.
              inventory[PEBBLES] += 3;

              // Pick up pebbles.
              Map.setTile(i, j, "00x00n");

              play_sound = true;
            break;

            case "09x00":

              score += 50;

              ++inventory[SPECIAL];

              got_special = true;

              // Pick up special bombs.
              Map.setTile(i, j, "00x00n");

              play_sound = true;

              special = true;
            break;

            case "10x00":

              score += 100;

              ++inventory[EGGS];

              got_eggs = true;

              // Pick up Easter eggs.
              Map.setTile(i, j, "00x00n");

              play_sound = true;

              special = true;
            break;
          }
        }

        if (play_sound) {

          if (special) {

            special = false;

            // Picked up special bombs.
            al_play_sample(sample_special, 1.0, 0.0, 1.0, ALLEGRO_PLAYMODE_ONCE, null);
          }
          else {

            // Picked up general items.
            al_play_sample(sample_pick_up, 1.0, 0.0, 1.0, ALLEGRO_PLAYMODE_ONCE, null);
          }
        }
      }
    }

    // Restore width and height.
    w = tile_w;
    h = tile_h;

    var tile_x = Math.floor(x / w);
    var tile_y = Math.floor(y / h);

    if (show_bomb) {

      ++bomb_ticks;

      if (bomb_ticks > al_get_timer_speed() / 2) {

        show_bomb = false;

        bomb_ticks = 0;

        var tile_x = Math.floor(bomb_x / w);
        var tile_y = Math.floor(bomb_y / h);

        // Bomb blew up. Destroy surrounding tiles (5x5).
        Map.convertTile(tile_x, tile_y);
        Map.convertTile(tile_x, tile_y - 1);
        Map.convertTile(tile_x, tile_y + 1);
        Map.convertTile(tile_x - 1, tile_y);
        Map.convertTile(tile_x + 1, tile_y);
        Map.convertTile(tile_x - 1, tile_y - 1);
        Map.convertTile(tile_x + 1, tile_y - 1);
        Map.convertTile(tile_x - 1, tile_y + 1);
        Map.convertTile(tile_x + 1, tile_y + 1);
        Map.convertTile(tile_x - 2, tile_y);
        Map.convertTile(tile_x + 2, tile_y);
        Map.convertTile(tile_x - 2, tile_y - 1);
        Map.convertTile(tile_x + 2, tile_y - 1);
        Map.convertTile(tile_x - 2, tile_y + 1);
        Map.convertTile(tile_x + 2, tile_y + 1);
        Map.convertTile(tile_x, tile_y - 2);
        Map.convertTile(tile_x - 1, tile_y - 2);
        Map.convertTile(tile_x - 2, tile_y - 2);
        Map.convertTile(tile_x + 1, tile_y - 2);
        Map.convertTile(tile_x + 2, tile_y - 2);
        Map.convertTile(tile_x, tile_y + 2);
        Map.convertTile(tile_x - 1, tile_y + 2);
        Map.convertTile(tile_x - 2, tile_y + 2);
        Map.convertTile(tile_x + 1, tile_y + 2);
        Map.convertTile(tile_x + 2, tile_y + 2);

        al_play_sample(sample_hit, 1.0, 0.0, 1.0, ALLEGRO_PLAYMODE_ONCE, null);
      }
    }

    if (show_special_bomb) {

      ++special_bomb_ticks;

      if (special_bomb_ticks > al_get_timer_speed()) {

        show_special_bomb = false;

        special_bomb_ticks = 0;

        var tile_x = Math.floor(special_bomb_x / w);
        var tile_y = Math.floor(special_bomb_y / h);

        // Bomb blew up. Destroy surrounding tiles (11x11).

        for (var i = -5; i <= 5; ++i) {

          Map.convertTile(tile_x, tile_y + i, true);
          Map.convertTile(tile_x - 1, tile_y + i, true);
          Map.convertTile(tile_x - 2, tile_y + i, true);
          Map.convertTile(tile_x - 3, tile_y + i, true);
          Map.convertTile(tile_x - 4, tile_y + i, true);
          Map.convertTile(tile_x - 5, tile_y + i, true);
          Map.convertTile(tile_x + 1, tile_y + i, true);
          Map.convertTile(tile_x + 2, tile_y + i, true);
          Map.convertTile(tile_x + 3, tile_y + i, true);
          Map.convertTile(tile_x + 4, tile_y + i, true);
          Map.convertTile(tile_x + 5, tile_y + i, true);
        }

        al_play_sample(sample_special_explosion, 1.0, 0.0, 1.0, ALLEGRO_PLAYMODE_ONCE, null);
      }
    }
  };

  this.render = function(cam_x, cam_y) {

    var facing = 0;

    for (var i = 0; i < 4; ++i) {

      if (facing_direction[i]) {

        facing = i;

        break;
      }
    }

    if (debug) {

      // Draw Keebo's bounding box.
      al_draw_filled_rectangle(

        x - cam_x,

        y - cam_y,

        x - cam_x + w,

        y - cam_y + h,

        al_map_rgb(255, 255, 0)
      );

      if (show_bomb) {

        // Draw bomb's bounding box.
        al_draw_filled_rectangle(

          bomb_x - cam_x,

          bomb_y - cam_y,

          bomb_x - cam_x + w,

          bomb_y - cam_y + h,

          al_map_rgb(255, 255, 0)
        );
      }

      if (show_special_bomb) {

        // Draw special bomb's bounding box.
        al_draw_filled_rectangle(

          special_bomb_x - cam_x,

          special_bomb_y - cam_y,

          special_bomb_x - cam_x + w,

          special_bomb_y - cam_y + h,

          al_map_rgb(255, 255, 0)
        );
      }
    }

    // Draw Keebo.
    al_draw_bitmap_region(

      bitmap,

      w * facing,

      h * frame,

      w,

      h,

      x - cam_x,

      y - cam_y,

      0
    );

    if (show_bomb) {

      // Draw bomb.
      al_draw_bitmap_region(

        bitmap,

        w * 4,

        h * frame,

        w,

        h,

        bomb_x - cam_x,

        bomb_y - cam_y,

        0
      );
    }

    if (show_special_bomb) {

      // Draw special bomb.
      al_draw_bitmap_region(

        bitmap,

        w * 5,

        h * frame,

        w,

        h,

        special_bomb_x - cam_x,

        special_bomb_y - cam_y,

        0
      );
    }
  };

  this.setX = function(new_x) {

    x = new_x;
  };

  this.setY = function(new_y) {

    y = new_y;
  };

  this.getX = function() {

    return x;
  };

  this.getY = function() {

    return y;
  };

  this.getW = function() {

    return w;
  };

  this.getH = function() {

    return h;
  };

  this.setFacingDirection = function(direction) {

    for (var i = 0; i < 4; ++i) {

      facing_direction[i] = false;
    }

    facing_direction[direction] = true;
  };

  this.useBomb = function() {

    if (!show_bomb) {

      show_bomb = true;

      bomb_x = x;
      bomb_y = y;

      al_play_sample(sample_place_bomb, 1.0, 0.0, 1.0, ALLEGRO_PLAYMODE_ONCE, 0);
    }
  };

  this.useSpecialBomb = function() {

    if (!show_special_bomb) {

      --inventory[SPECIAL];

      show_special_bomb = true;

      special_bomb_x = x;
      special_bomb_y = y;

      al_play_sample(sample_place_bomb, 1.0, 0.0, 1.0, ALLEGRO_PLAYMODE_ONCE, 0);
    }
  };

  this.setBitmap = function(bmp) {

    bitmap = bmp;
  };

  this.getInventory = function() {

    return inventory;
  };

  this.isTalking = function() {

    return talking;
  };

  this.subtractItem = function(item_number, quantity) {

    inventory[item_number] = inventory[item_number] - quantity;
  };

  this.gotSpecial = function() {

    return got_special;
  };

  this.gotEggs = function() {

    return got_eggs;
  };
}

Camera = function() {

  var x = 0;
  var y = 0;

  this.follow = function(target_x, target_y) {

    x = target_x - al_get_display_width() / 2 + tile_w / 2;
    y = target_y - al_get_display_height() / 2 + tile_h / 2;

    if (x < 0) {

      // Stop scrolling on the left boundary.
      x = 0;
    }

    if (x > Map.getW() * tile_w - al_get_display_width()) {

      // Stop scrolling on the right boundary.
      x = Map.getW() * tile_w - al_get_display_width();
    }

    if (y < 0) {

      // Stop scrolling on the top boundary.
      y = 0;
    }

    if (y > Map.getH() * tile_h - al_get_display_height()) {

      // Stop scrolling on the bottom boundary.
      y = Map.getH() * tile_h - al_get_display_height();
    }
  };

  this.getX = function() {

    return x;
  };

  this.getY = function() {

    return y;
  };
}

Gourdonian = function() {

  var x = 0;
  var y = 0;
  var w = 0;
  var h = 0;

  var bitmap = null;

  var facing_direction = [false, false, false, false];

  var first_conversation = true;

  var conversations = 0;

  var desired_item = undefined;
  var desired_quantity = 0;

  var name = undefined;

  var dead = false;

  this.setup = function(spawn_x, spawn_y) {

    bitmap = bitmap_gourdonian;

    w = 64;
    h = 64;

    x = spawn_x * w;
    y = spawn_y * h;

    this.setFacingDirection(2 + getRandomNumber() % 2);

    first_conversation = true;

    conversations = 0;

    desired_item = getRandomNumber() % 3;

    if (desired_item == 0 || desired_item == 1) {

      // This Gourdonian wants some sticks or pebbles.
      desired_quantity = (getRandomNumber() % 48) + 2;
    }
    else if (desired_item == 2) {

      // This Gourdonian wants carrots.
      desired_quantity = (getRandomNumber() % 10) + 2;
    }

    name = names[getRandomNumber() % names.length];

    dead = false;
  };

  this.update = function(cam_x, cam_y) {

    if (dead) {

      return;
    }

    if (x < cam_x - w || x > cam_x + al_get_display_width()) {

      // Do not draw Gourdonians outside of the camera's view.
      return;
    }

    if (y < cam_y - h || y > cam_y + al_get_display_height()) {

      // Do not draw Gourdonians outside of the camera's view.
      return;
    }

    // Turn to face Keebo.

    if (Keebo.getX() < x) {

      this.setFacingDirection(FACING_LEFT);
    }
    else if (Keebo.getX() > x) {

      this.setFacingDirection(FACING_RIGHT);
    }
  };

  this.render = function(cam_x, cam_y) {

    if (dead) {

      return;
    }

    if (x < cam_x - w || x > cam_x + al_get_display_width()) {

      // Do not draw Gourdonians outside of the camera's view.
      return;
    }

    if (y < cam_y - h || y > cam_y + al_get_display_height()) {

      // Do not draw Gourdonians outside of the camera's view.
      return;
    }

    var facing = 0;

    for (var i = 0; i < 4; ++i) {

      if (facing_direction[i]) {

        facing = i;

        break;
      }
    }

    if (debug) {

      // Draw bounding box.
      al_draw_filled_rectangle(

        x - cam_x,

        y - cam_y,

        x - cam_x + w,

        y - cam_y + h,

        al_map_rgb(0, 255, 0)
      );
    }

    // Draw the Gourdonian.
    al_draw_bitmap_region(

      bitmap,

      w * facing - w * 2,

      h * frame,

      w,

      h,

      x - cam_x,

      y - cam_y,

      0
    );
  };

  this.setFacingDirection = function(direction) {

    for (var i = 0; i < 4; ++i) {

      facing_direction[i] = false;
    }

    facing_direction[direction] = true;
  };

  this.getX = function() {

    return x;
  };

  this.getY = function() {

    return y;
  };

  this.getName = function() {

    return name;
  };

  this.manageChat = function() {

    if (talking) {

      strings = [];

      talking = false;

      if (dead) {

        // Move this Gourdonian off-screen so Keebo doesn't interact with it again.
        x = -99;
        y = -99;
      }

      return;
    }

    talking = true;

    if (conversations == 0) {

      // Introduction / first conversation.

      switch (getRandomNumber() % 3) {

        case 0:

          strings[0] = "I'm " + name + ". Bring me " + desired_quantity + " " + item[desired_item];
          strings[0] += " and I'll give you an item";
          strings[1] = "that'll help destroy Bumble hives. Go get my " + item[desired_item] + "!";
        break;

        case 1:

          strings[0] = "Hey there. The name's " + name + ". I want some " + item[desired_item] + ".";
          strings[1] = "Bring me " + desired_quantity + " of 'em. Let me know when you got 'em.";
        break;

        case 2:

          strings[0] = "Got any " + item[desired_item] + "? I need " + desired_quantity + ". My name's ";
          strings[0] += name + ", by the";
          strings[1] = "way. Don't ask why I need them. Just go get them!";
        break;
      }

    }
    else {

      if (Keebo.getInventory()[desired_item] >= desired_quantity) {

        // Keebo brought the right item(s).

        switch (getRandomNumber() % 3) {

          case 0:

            strings[0] = "You brought the " + item[desired_item] + " I asked for! I give my life so";
            strings[1] = "others may live! Use this to destroy the hives!";
          break;

          case 1:

            strings[0] = "My precious " + item[desired_item] + "! Use this on the Bumble hives to";
            strings[1] = "take back our Easter eggs! Godspeed, Keebo!";
          break;

          case 2:

            strings[0] = "You finally got my " + item[desired_item] + "! It's about time. I pour my";
            strings[1] = "very being into this bomb. Use it on the hives, Keebo!";
          break;
        }

        Keebo.subtractItem(desired_item, desired_quantity);

        dead = true;

        al_play_sample(sample_powerup, 1.0, 0.0, 1.0, ALLEGRO_PLAYMODE_ONCE, null);

        Map.setTile(x / w, y / h, "09x00n");
      }
      else {

        // General sayings.

        switch (getRandomNumber() % 8) {

          case 0:

            strings[0] = "Look, I'd get the " + item[desired_item] + " myself, but I can't move. All";
            strings[1] = "I can do is turn around. Please bring me " + desired_quantity + " of them.";
          break;

          case 1:

            strings[0] = "The Bumbles came from out of nowhere and snatched";
            strings[1] = "up all of our Easter eggs! What a bunch of jerks...";
          break;

          case 2:

            strings[0] = "What do you think the Bumbles want with our Easter";
            strings[1] = "eggs anyway? I guess everyone loves candied eggs.";
          break;

          case 3:

            strings[0] = "Your bombs won't cut it against the Bumble hives. But";
            strings[1] = "my special item will, if you bring me some " + item[desired_item] + ".";
          break;

          case 4:

            strings[0] = "Nothing's better than " + item[desired_item] + ". Well, except maybe";
            strings[1] = "Easter eggs. I'd really like to have those back...";
          break;

          case 5:

            strings[0] = "Wouldn't it be crazy if all this was just a video game?";
            strings[1] = "Ha ha ha! Oh man, that'd be hilarious!";
          break;

          case 6:

            // This is a reference to Mori, the game that this is an improvement of.
            strings[0] = "Did you hear about that guy in the forest over yonder";
            strings[1] = "throwing snowballs all over the place? What a weirdo!";
          break;

          case 7:

            strings[0] = "The Bumbles stole a lot of our Easter eggs. But really,";
            strings[1] = "I'd be fine with just having 15 of them back.";
          break;
        }
      }
    }

    ++conversations;
  };
}

var Map = new Map();
var Text = new Text();
var Keebo = new Keebo();
var Camera = new Camera();

var number_of_gourdonians = 0;

var Gourdonians = [];

function update() {

  switch (state) {

    case INTRO:

      Text.update();

      if (_pressed[ALLEGRO_KEY_Z]) {

        ++state;

        Text.clear();
      }
    break;

    case GAME:

      if (Keebo.getInventory()[EGGS] >= 15) {

        ++state;

        Text.setText("You did it, Keebo! You retrieved 15 Easter eggs!");
        Text.setText("The Gourdonians can now have a happy Easter!");
        Text.setText("");
        Text.setText("You did it in " + Math.floor(al_get_time()) + " seconds with " + score + " points!");
        Text.setText("");
        Text.setText("Press \"z\" to continue.");
      }

      if (_pressed[ALLEGRO_KEY_D]) {

        debug = !debug;
      }

      if (_pressed[ALLEGRO_KEY_X]) {

        if (!talking) {

          // Only place bombs if not in a conversation.
          Keebo.useBomb();
        }
      }

      if (_pressed[ALLEGRO_KEY_C]) {

        if (!talking && Keebo.getInventory()[SPECIAL] > 0) {

          // Only special place bombs if not in a conversation.
          Keebo.useSpecialBomb();
        }
      }

      if (_pressed[ALLEGRO_KEY_Z]) {

        var distance_x = 999;
        var distance_y = 999;

        for (var i = 0; i < number_of_gourdonians; ++i) {

          distance_x = Math.abs(Keebo.getX() - Gourdonians[i].getX());
          distance_y = Math.abs(Keebo.getY() - Gourdonians[i].getY());

          if (distance_x < tile_w + 10 && distance_y < tile_h + 10) {

            Gourdonians[i].manageChat();

            break;
          }
        }
      }

      if (ticks > al_get_timer_speed() / 4) {

        ticks = 0;

        ++frame;

        if (frame > 1) {

          frame = 0;
        }
      }

      ++ticks;

      Map.update();

      Keebo.update();

      for (var i = 0; i < number_of_gourdonians; ++i) {

        Gourdonians[i].update(Camera.getX(), Camera.getY());
      }
    break;

    case WIN:

      Text.update();

      if (_pressed[ALLEGRO_KEY_Z]) {

        ++state;

        Text.clear();
      }
    break;

    case CREDITS:

      if (credits_y < 830) {

        credits_y += 2;
      }
      else {

        Text.clear();

        Text.setText("Thanks for playing! Happy Easter!");
      }
    break;
  }

  Camera.follow(Keebo.getX(), Keebo.getY());
}

function render() {

  al_clear_to_color(al_map_rgb(0, 0, 0));

  switch (state) {

    case INTRO:

      al_clear_to_color(al_map_rgb(59, 44, 44));

      Text.render();
    break;

    case GAME:

      Map.render(Camera.getX(), Camera.getY());

      Keebo.render(Camera.getX(), Camera.getY());

      for (var i = 0; i < number_of_gourdonians; ++i) {

        Gourdonians[i].render(Camera.getX(), Camera.getY());
      }

      al_draw_text(

        font_cartoon,

        al_map_rgb(188, 102, 0),

        10 + 1,

        0 + 1,

        0,

        "Sticks: " + Keebo.getInventory()[STICKS]
      );

      al_draw_text(

        font_cartoon,

        al_map_rgb(255, 255, 0),

        10,

        0,

        0,

        "Sticks: " + Keebo.getInventory()[STICKS]
      );

      al_draw_text(

        font_cartoon,

        al_map_rgb(188, 102, 0),

        al_get_display_width () / 2,

        0,

        ALLEGRO_ALIGN_CENTER,

        "Pebbles: " + Keebo.getInventory()[PEBBLES]
      );

      al_draw_text(

        font_cartoon,

        al_map_rgb(255, 255, 0),

        -1 + (al_get_display_width () / 2),

        -1,

        ALLEGRO_ALIGN_CENTER,

        "Pebbles: " + Keebo.getInventory()[PEBBLES]
      );

      al_draw_text(

        font_cartoon,

        al_map_rgb(188, 102, 0),

        al_get_display_width() - 10 + 1,

        1,

        ALLEGRO_ALIGN_RIGHT,

        "Carrots: " + Keebo.getInventory()[CARROTS]
      );

      al_draw_text(

        font_cartoon,

        al_map_rgb(255, 255, 0),

        al_get_display_width() - 10,

        0,

        ALLEGRO_ALIGN_RIGHT,

        "Carrots: " + Keebo.getInventory()[CARROTS]
      );

      Text.render();

      if (strings.length > 0) {

        al_draw_bitmap_region(

          bitmap_dialogue,

          0,

          al_get_display_height() * frame + 16 * frame, // Hack. Fixes changing aspect ratio forcefully.

          al_get_display_width(),

          al_get_display_height(),

          0,

          0,

          0
        );

        for (var i = 0; i < strings.length; ++i) {

          al_draw_text(

            font_cartoon_smaller,

            al_map_rgb(255, 255, 255),

            64 + 16,

            128 + 12 + i * font_cartoon.size,

            0,

            strings[i]
          );
        }
      }

      if (Keebo.gotSpecial()) {

        al_draw_text(

          font_cartoon,

          al_map_rgb(188, 102, 0),

          10 + 1,

          al_get_display_height() - font_cartoon.size - 16 + 1,

          0,

          "Special: " + Keebo.getInventory()[SPECIAL]
        );

        al_draw_text(

          font_cartoon,

          al_map_rgb(255, 255, 0),

          10,

          al_get_display_height() - font_cartoon.size - 16,

          0,

          "Special: " + Keebo.getInventory()[SPECIAL]
        );
      }

      if (Keebo.gotEggs()) {

        al_draw_text(

          font_cartoon,

          al_map_rgb(188, 102, 0),

          al_get_display_width() - 10 + 1,

          al_get_display_height() - font_cartoon.size - 16 + 1,

          ALLEGRO_ALIGN_RIGHT,

          "Eggs: " + Keebo.getInventory()[EGGS] + " / 15"
        );

        al_draw_text(

          font_cartoon,

          al_map_rgb(255, 255, 0),

          al_get_display_width() - 10,

          al_get_display_height() - font_cartoon.size - 16,

          ALLEGRO_ALIGN_RIGHT,

          "Eggs: " + Keebo.getInventory()[EGGS] + " / 15"
        );
      }
    break;

    case WIN:

      al_clear_to_color(al_map_rgb(59, 44, 44));

      Text.render();
    break;

    case CREDITS:

      // Display credits and participants in alphabetical order.

      al_clear_to_color(al_map_rgb(59, 44, 44));

      al_draw_text(

        font_cartoon,

        al_map_rgb(255, 255, 0),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y,

        ALLEGRO_ALIGN_CENTER,

        "Easter Hack 2017"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22,

        ALLEGRO_ALIGN_CENTER,

        "Amarillion"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 3,

        ALLEGRO_ALIGN_CENTER,

        "Elias"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 5,

        ALLEGRO_ALIGN_CENTER,

        "Eric"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 7,

        ALLEGRO_ALIGN_CENTER,

        "GullRaDriel"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 9,

        ALLEGRO_ALIGN_CENTER,

        "MarkOates"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 11,

        ALLEGRO_ALIGN_CENTER,

        "NunoMartinez"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 13,

        ALLEGRO_ALIGN_CENTER,

        "RmBeer"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 15,

        ALLEGRO_ALIGN_CENTER,

        "SiegeLord"
      );

      al_draw_text(

        font_cartoon_smaller,

        al_map_rgb(255, 255, 255),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 19,

        ALLEGRO_ALIGN_CENTER,

        "Created by Eric Johnson"
      );

      al_draw_text(

        font_cartoon,

        al_map_rgb(255, 255, 0),

        al_get_display_width() / 2,

        al_get_display_height() / 2 - credits_y + font_cartoon.size + 22 * 23,

        ALLEGRO_ALIGN_CENTER,

        "Happy Easter!"
      );

      Text.render(true);
    break;
  }

  al_flip_display();
}

function main() {

  if (!al_init()) {

    alert("Error: al_init() failed!");

    return false;
  }

  if (!al_init_image_addon()) {

    alert("Error: al_init_image_addon() failed!");

    return false;
  }

  if (!al_init_primitives_addon()) {

    alert("Error: al_init_primitives_addon() failed!");

    return false;
  }

  al_install_audio();

  al_install_keyboard();

  al_create_timer(60.0);

  if (!al_create_display(768, 448)) {

    alert("Error: al_create_display() failed!");

    return false;
  }

  // Load fonts.
  font_cartoon = al_load_font("uploads/games/keebos-quest/data/SFCartoonistHand.ttf", 45, 0);
  font_cartoon_smaller = al_load_font("uploads/games/keebos-quest/data/SFCartoonistHand.ttf", 35, 0);

  // Load bitmaps.
  bitmap_map = al_load_bitmap("uploads/games/keebos-quest/data/map.png");
  bitmap_keebo = al_load_bitmap("uploads/games/keebos-quest/data/keebo.png");
  bitmap_dialogue = al_load_bitmap("uploads/games/keebos-quest/data/dialogue.png");
  bitmap_gourdonian = al_load_bitmap("uploads/games/keebos-quest/data/gourdonian.png");

  // Load samples.
  sample_hit = al_load_sample("uploads/games/keebos-quest/data/hit.mp3");
  sample_special = al_load_sample("uploads/games/keebos-quest/data/special.mp3");
  sample_powerup = al_load_sample("uploads/games/keebos-quest/data/powerup.mp3");
  sample_pick_up = al_load_sample("uploads/games/keebos-quest/data/pick_up.mp3");
  sample_place_bomb = al_load_sample("uploads/games/keebos-quest/data/place_bomb.mp3");
  sample_special_explosion = al_load_sample("uploads/games/keebos-quest/data/special_explosion.mp3");

  al_ready(

    function() {

      Map.setup();
      Keebo.setup();

      var tiles = Map.getTiles();

      for (var i = 0; i < Map.getW(); ++i) {

        for (var j = 0; j < Map.getH(); ++j) {

          if (tiles[i][j].substring(0, 5) == "07x00") {

            Gourdonians[number_of_gourdonians] = new Gourdonian();

            Gourdonians[number_of_gourdonians].setup(i, j);

            // Remove Gourdonian spawn marker.
            Map.setTile(i, j, "00x00n");

            ++number_of_gourdonians;
          }
        }
      }

      Text.setText("Keebo, the Bumbles have stolen the Gourdonians'");
      Text.setText("Easter eggs and have taken them to their hives!");
      Text.setText("It is up to you to get them back!");
      Text.setText("");
      Text.setText("Talk to the Gourdonians with \"z\" to learn more.");
      Text.setText("Use your bombs with \"x\" to clear pesky terrain.");
      Text.setText("");
      Text.setText("Got it? Good. Now press \"z\" to continue.");

      al_create_loop(

        function() {

          update();

          render();
        }
      );
    }
  );
}
