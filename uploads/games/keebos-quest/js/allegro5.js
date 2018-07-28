"use strict";

var _speed_secs = undefined;
var _start_time = undefined;
var _timer_started = false;

var _source = [];
var _pan_node = [];
var _audio_context = undefined;

var _canvas = undefined;

var _loop_procedure;
var _ready_procedure;

var _downloadables = [];

var _al_init = false;
var _al_init_image_addon = false;
var _al_init_primitives_addon = false;

var _al_install_mouse = false;
var _al_install_keyboard = false;

var _mouse_x = 0;
var _mouse_y = 0;
var _mouse_z = 0;

var _last_mouse_x = 0;
var _last_mouse_y = 0;
var _last_mouse_z = 0;

var _mouse_button = 0;
var _mouse_pressed = 0;
var _mouse_released = 0;

var _key = [];
var _pressed = [];
var _released = [];

const ALLEGRO_PI = 3.14159265358979323846;

// Font flags.
const ALLEGRO_ALIGN_LEFT = 0;
const ALLEGRO_ALIGN_CENTER = 1;
const ALLEGRO_ALIGN_CENTRE = 1;
const ALLEGRO_ALIGN_RIGHT = 2;

// Bitmap flags.
const ALLEGRO_FLIP_HORIZONTAL = 1;
const ALLEGRO_FLIP_VERTICAL = 2;

// Sample flags.
const ALLEGRO_PLAYMODE_ONCE = 0;
const ALLEGRO_PLAYMODE_LOOP = 1;

// Keyboard key constants.
const ALLEGRO_KEY_A = 0x41
const ALLEGRO_KEY_B = 0x42
const ALLEGRO_KEY_C = 0x43
const ALLEGRO_KEY_D = 0x44
const ALLEGRO_KEY_E = 0x45
const ALLEGRO_KEY_F = 0x46
const ALLEGRO_KEY_G = 0x47
const ALLEGRO_KEY_H = 0x48
const ALLEGRO_KEY_I = 0x49
const ALLEGRO_KEY_J = 0x4A
const ALLEGRO_KEY_K = 0x4B
const ALLEGRO_KEY_L = 0x4C
const ALLEGRO_KEY_M = 0x4D
const ALLEGRO_KEY_N = 0x4E
const ALLEGRO_KEY_O = 0x4F
const ALLEGRO_KEY_P = 0x50
const ALLEGRO_KEY_Q = 0x51
const ALLEGRO_KEY_R = 0x52
const ALLEGRO_KEY_S = 0x53
const ALLEGRO_KEY_T = 0x54
const ALLEGRO_KEY_U = 0x55
const ALLEGRO_KEY_V = 0x56
const ALLEGRO_KEY_W = 0x57
const ALLEGRO_KEY_X = 0x58
const ALLEGRO_KEY_Y = 0x59
const ALLEGRO_KEY_Z = 0x5A
const ALLEGRO_KEY_0 = 0x30
const ALLEGRO_KEY_1 = 0x31
const ALLEGRO_KEY_2 = 0x32
const ALLEGRO_KEY_3 = 0x33
const ALLEGRO_KEY_4 = 0x34
const ALLEGRO_KEY_5 = 0x35
const ALLEGRO_KEY_6 = 0x36
const ALLEGRO_KEY_7 = 0x37
const ALLEGRO_KEY_8 = 0x38
const ALLEGRO_KEY_9 = 0x39
const ALLEGRO_KEY_0_PAD = 0x60
const ALLEGRO_KEY_1_PAD = 0x61
const ALLEGRO_KEY_2_PAD = 0x62
const ALLEGRO_KEY_3_PAD = 0x63
const ALLEGRO_KEY_4_PAD = 0x64
const ALLEGRO_KEY_5_PAD = 0x65
const ALLEGRO_KEY_6_PAD = 0x66
const ALLEGRO_KEY_7_PAD = 0x67
const ALLEGRO_KEY_8_PAD = 0x68
const ALLEGRO_KEY_9_PAD = 0x69
const ALLEGRO_KEY_F1 = 0x70
const ALLEGRO_KEY_F2 = 0x71
const ALLEGRO_KEY_F3 = 0x72
const ALLEGRO_KEY_F4 = 0x73
const ALLEGRO_KEY_F5 = 0x74
const ALLEGRO_KEY_F6 = 0x75
const ALLEGRO_KEY_F7 = 0x76
const ALLEGRO_KEY_F8 = 0x77
const ALLEGRO_KEY_F9 = 0x78
const ALLEGRO_KEY_F10 = 0x79
const ALLEGRO_KEY_F11 = 0x7a
const ALLEGRO_KEY_F12 = 0x7b
const ALLEGRO_KEY_ESC = 0x1B
const ALLEGRO_KEY_TILDE = 0xc0
const ALLEGRO_KEY_MINUS = 0xbd
const ALLEGRO_KEY_EQUALS = 0xbb
const ALLEGRO_KEY_BACKSPACE = 0x08
const ALLEGRO_KEY_TAB = 0x09
const ALLEGRO_KEY_OPENBRACE = 0xdb
const ALLEGRO_KEY_CLOSEBRACE = 0xdd
const ALLEGRO_KEY_ENTER = 0x0D
const ALLEGRO_KEY_COLON = 0xba
const ALLEGRO_KEY_QUOTE = 0xde
const ALLEGRO_KEY_BACKSLASH = 0xdc
const ALLEGRO_KEY_COMMA = 0xbc
const ALLEGRO_KEY_STOP = 0xbe
const ALLEGRO_KEY_SLASH = 0xBF
const ALLEGRO_KEY_SPACE = 0x20
const ALLEGRO_KEY_INSERT = 0x2D
const ALLEGRO_KEY_DEL = 0x2E
const ALLEGRO_KEY_HOME = 0x24
const ALLEGRO_KEY_END = 0x23
const ALLEGRO_KEY_PGUP = 0x21
const ALLEGRO_KEY_PGDN = 0x22
const ALLEGRO_KEY_LEFT = 0x25
const ALLEGRO_KEY_RIGHT = 0x27
const ALLEGRO_KEY_UP = 0x26
const ALLEGRO_KEY_DOWN = 0x28
const ALLEGRO_KEY_SLASH_PAD = 0x6F
const ALLEGRO_KEY_ASTERISK = 0x6A
const ALLEGRO_KEY_MINUS_PAD = 0x6D
const ALLEGRO_KEY_PLUS_PAD = 0x6B
const ALLEGRO_KEY_ENTER_PAD = 0x0D
const ALLEGRO_KEY_PRTSCR = 0x2C
const ALLEGRO_KEY_PAUSE = 0x13
const ALLEGRO_KEY_EQUALS_PAD = 0x0C
const ALLEGRO_KEY_LSHIFT = 0x10
const ALLEGRO_KEY_RSHIFT = 0x10
const ALLEGRO_KEY_LCONTROL = 0x11
const ALLEGRO_KEY_RCONTROL = 0x11
const ALLEGRO_KEY_ALT = 0x12
const ALLEGRO_KEY_ALTGR = 0x12
const ALLEGRO_KEY_LWIN = 0x5b
const ALLEGRO_KEY_RWIN = 0x5c
const ALLEGRO_KEY_MENU = 0x5d
const ALLEGRO_KEY_SCRLOCK = 0x9d
const ALLEGRO_KEY_NUMLOCK = 0x90
const ALLEGRO_KEY_CAPSLOCK = 0x14;

function al_init() {

  if (_al_init) {

    // al_init() has already been called previously.
    return _al_init;
  }

  if (typeof Date === undefined) {

    // The browser does not support the Date object.
    return false;
  }

  _start_time = (new Date()).getTime();

  _al_init = true;

  return true;
}

function al_init_image_addon() {

  if (_al_init_image_addon) {

    // al_init_image_addon() has already been called previously.
    return _al_init_image_addon;
  }

  if (!_al_init) {

    // al_init() has not been called.
    return false;
  }

  var canvas = document.createElement("canvas");

  if (!!canvas === false) {

    // The browser does not support the canvas element.
    return false;
  }

  var context = canvas.getContext("2d");

  if (!!context === false || typeof context.drawImage === undefined) {

    // The browser does not support drawing to the canvas element.
    return false;
  }

  _al_init_image_addon = true;

  return true;
}

function al_init_primitives_addon() {

  if (_al_init_primitives_addon) {

    // al_init_primitives_addon() has already been called previously.
    return _al_init_primitives_addon;
  }

  if (!_al_init) {

    // al_init() has not been called.
    return false;
  }

  if (

    !!document.createElement("canvas").getContext("2d").arc === false ||
    !!document.createElement("canvas").getContext("2d").fill === false ||
    !!document.createElement("canvas").getContext("2d").lineTo === false ||
    !!document.createElement("canvas").getContext("2d").moveTo === false ||
    !!document.createElement("canvas").getContext("2d").stroke === false ||
    !!document.createElement("canvas").getContext("2d").fillRect === false ||
    !!document.createElement("canvas").getContext("2d").beginPath === false ||
    !!document.createElement("canvas").getContext("2d").closePath === false ||
    !!document.createElement("canvas").getContext("2d").strokeRect === false
  ) {

    // The browser does not support drawing primitives.
    return false;
  }

  _al_init_primitives_addon = true;

  return true;
}

function al_get_time() {

  if (!_al_init) {

    // al_init() has not been called.
    return undefined;
  }

  // Return the number of seconds since the library was initialized.
  return (((new Date()).getTime() - _start_time) / 1000).toFixed(6);
}

function al_install_keyboard() {

  if (!_al_init) {

    // al_init() has not been called.
    return false;
  }

  if (_al_install_keyboard) {

    // The keyboard has already been installed previously.
    return true;
  }

  for (var i = 0; i < 128; ++i) {

    _key[i] = false;
    _pressed[i] = false;
    _released[i] = false;
  }

  document.addEventListener("keyup", _key_up);
  document.addEventListener("keydown", _key_down);

  _al_install_keyboard = true;

  return _al_install_keyboard;
}

function _key_up(event) {

  if (!_key[event.which]) {

    _pressed[event.which] = true;
  }

  _key[event.which] = false;

  event.preventDefault();
}

function _key_down(event) {

  _key[event.which] = true;
  _pressed[event.which] = true;

  event.preventDefault();
}

function al_is_keyboard_installed() {

  if (!_al_init) {

    // al_init() has not been called.
    return false;
  }

  return _al_install_keyboard;
}

function al_uninstall_keyboard() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  document.removeEventListener("keyup", _key_up);
  document.removeEventListener("keydown", _key_down);

  for (var i = 0; i < 128; ++i) {

    _key[i] = false;
    _pressed[i] = false;
    _released[i] = false;
  }

  _al_install_keyboard = false;
}

function al_create_timer(speed_secs) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  _timer_started = true;

  _speed_secs = speed_secs;
}

function al_get_timer_started() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return _timer_started;
}

function al_get_timer_speed() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return _speed_secs;
}

function al_create_display(w, h) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  var canvas = document.getElementById("display");

  if (!!canvas === false) {

    // The display canvas does not exist.
    return false;
  }

  canvas.width = w;
  canvas.height = h;

  var context = canvas.getContext("2d");

  if (!!context === false) {

    // The browser does not support the canvas element.
    return false;
  }

  _canvas = {w: w, h: h, canvas: canvas, context: context, ready: true};

  return true;
}

function al_ready(procedure) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  _ready_procedure = procedure;

  window.setTimeout(_check_progress, 100);
}

function _check_progress() {

  var number_of_assets = 0;
  var number_of_assets_loaded = 0;

  for (var i = 0; i < _downloadables.length; ++i) {

    ++number_of_assets;

    if (_downloadables[i].type == "spl") {

      // Check if samples have completed loading.

      if (_downloadables[i].element.readyState >= _downloadables[i].element.HAVE_FUTURE_DATA) {

        // The samples have loaded enough to begin being played.
        _downloadables[i].ready = true;
      }
    }

    if (_downloadables[i].ready) {

      ++number_of_assets_loaded;
    }
  }

  if (number_of_assets_loaded < number_of_assets) {

    // Some assets have not completed downloading yet. Check again in 100ms.
    window.setTimeout(_check_progress, 100);
  }
  else {

    // All of the assets have completed downloading. Continue with the procedure.
    _ready_procedure();
  }
}

function al_create_loop(procedure) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  _loop_procedure = procedure;

  window.setInterval(_loop, 1000 / _speed_secs);
}

function _loop() {

  _loop_procedure();

  if (_al_install_keyboard) {

    for (var i = 0; i < 128; ++i) {

      _pressed[i] = false;
      _released[i] = false;
    }
  }

  if (_al_install_mouse) {

    _mouse_pressed = 0;
    _mouse_released = 0;

    _last_mouse_x = _mouse_x;
    _last_mouse_y = _mouse_y;
    _last_mouse_z = _mouse_z;
  }
}

function al_clear_to_color(color) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  _set_stroke_fill_style(_canvas, color, 0);

  _canvas.context.clearRect(0, 0, _canvas.w, _canvas.h);

  _canvas.context.fillRect(0, 0, _canvas.w, _canvas.h);
}

function al_map_rgb(r, g, b) {

  return al_map_rgba(r, g, b, 255);
}

function al_map_rgb_f(r, g, b) {

  return al_map_rgba_f(r, g, b, 255);
}

function al_map_rgba(r, g, b, a) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return {r: r, g: g, b: b, a: a};
}

function al_map_rgba_f(r, g, b, a) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return {r: r * 255, g: g * 255, b: b * 255, a: a * 255};
}

function al_get_backbuffer() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return _canvas;
}

function al_get_display_width() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return _canvas.w;
}

function al_get_display_height() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return _canvas.h;
}

function al_get_bitmap_width(bitmap) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return bitmap.w;
}

function al_get_bitmap_height(bitmap) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return bitmap.h;
}

function al_get_pixel(bitmap, x, y) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  var data = bitmap.context.getImageData(x, y, 1, 1).data;

  return al_map_rgba(data[0], data[1], data[2], data[3]);
}

function al_create_tinted_bitmap(source_bitmap, tint) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  var tinted_bitmap = al_create_bitmap(source_bitmap.w, source_bitmap.h);

  for (var i = 0; i < source_bitmap.h; ++i) {

    for (var j = 0; j < source_bitmap.w; ++j) {

      var data = source_bitmap.context.getImageData(j, i, 1, 1).data;

      var r = data[0] & tint.r;
      var g = data[1] & tint.g;
      var b = data[2] & tint.b;
      var a = data[3] & tint.a;

      al_put_pixel(tinted_bitmap, j, i, al_map_rgba(r, g, b, a));
    }
  }

  return tinted_bitmap;
}

function al_create_bitmap(w, h) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  var sub_canvas = document.createElement("canvas");
  var sub_canvas_context = sub_canvas.getContext("2d");

  sub_canvas.width = w;
  sub_canvas.height = h;

  return {canvas: sub_canvas, context: sub_canvas_context, w: w, h: h, ready: true};
}

function al_draw_pixel(x, y, color) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  al_put_pixel(_canvas, x, y, color);
}

function al_draw_bitmap(bitmap, dx, dy, flags) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  dx += bitmap.w / 2;
  dy += bitmap.h / 2;

  var offset_x = 1;
  var offset_y = 1;

  switch (flags) {

    case ALLEGRO_FLIP_HORIZONTAL:

      offset_x = -1;
    break;

    case ALLEGRO_FLIP_VERTICAL:

      offset_y = -1;
    break;

    case ALLEGRO_FLIP_HORIZONTAL | ALLEGRO_FLIP_VERTICAL:

      offset_x = -1;
      offset_y = -1;
    break;
  }

  dx *= offset_x;
  dy *= offset_y;

  _canvas.context.save();

  _canvas.context.scale(offset_x, offset_y);

  _canvas.context.drawImage(bitmap.canvas, dx - bitmap.w / 2, dy - bitmap.h / 2);

  _canvas.context.restore();
}

function al_draw_bitmap_region(bitmap, sx, sy, sw, sh, dx, dy, flags) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  var scale_x = 1;
  var scale_y = 1;
  var translate_x = 0;
  var translate_y = 0;

  var transform = al_create_transform();

  al_identity_transform(transform);

  switch (flags) {

    case ALLEGRO_FLIP_HORIZONTAL:

      scale_x = -1;
      translate_x = sw + dx * 2;
    break;

    case ALLEGRO_FLIP_VERTICAL:

      scale_y = -1;
      translate_y = sh + -(dy * 2 + sh * 2);
    break;

    case ALLEGRO_FLIP_HORIZONTAL | ALLEGRO_FLIP_VERTICAL:

      scale_x = -1;
      scale_y = -1;
      translate_x = -(sw + dx * 2);
      translate_y = sh + -(dy * 2 + sh * 2);
    break;
  }

  al_translate_transform(transform, translate_x, translate_y);
  al_scale_transform(transform, scale_x, scale_y);

  al_use_transform(transform);

  _canvas.context.drawImage(bitmap.canvas, sx, sy, sw, sh, dx, dy, sw, sh);

  _canvas.context.translate(translate_x * scale_y, translate_y * scale_y);
  _canvas.context.scale(scale_x, scale_y);
}

function al_draw_rotated_bitmap(bitmap, cx, cy, dx, dy, angle, flags) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  var offset_x = 1;
  var offset_y = 1;

  switch (flags) {

    case ALLEGRO_FLIP_HORIZONTAL:

      offset_x = -1;

      angle = -angle;
    break;

    case ALLEGRO_FLIP_VERTICAL:

      offset_y = -1;

      angle = -angle;
    break;

    case ALLEGRO_FLIP_HORIZONTAL | ALLEGRO_FLIP_VERTICAL:

      offset_x = -1;
      offset_y = -1;
    break;
  }

  _canvas.context.save();

  _canvas.context.translate(dx, dy);
  _canvas.context.scale(offset_x, offset_y);
  _canvas.context.rotate(angle);
  _canvas.context.translate(-cx, -cy);

  _canvas.context.drawImage(bitmap.canvas, 0, 0);

  _canvas.context.restore();
}

function al_draw_scaled_bitmap(bitmap, sx, sy, sw, sh, dx, dy, dw, dh, flags) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  // @FIXME: sx and sy do not behave as expected (this whole function has problems).

  sx = (Math.abs(sx - dw) / bitmap.w).toFixed(0);
  sy = (Math.abs(sy - dh) / bitmap.h).toFixed(0);

  _canvas.context.save();

  _canvas.context.translate(dx - sx + 1, dy - sy + 1);
  canvas.context.scale(sx, sy);

  al_draw_bitmap(bitmap, 0, 0, flags);

  _canvas.context.restore();
}

function al_put_pixel(target_bitmap, x, y, color) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  _set_stroke_fill_style(target_bitmap, color, 0);

  target_bitmap.context.fillRect(x, y, 1, 1);
}

function al_load_bitmap(filename) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_image_addon) {

    // al_init_image_addon() has not been called.
    return;
  }

  var image = new Image();

  image.src = filename;

  var sub_canvas = document.createElement("canvas");
  var sub_canvas_context = sub_canvas.getContext("2d");

  var bitmap = {canvas: sub_canvas, context: sub_canvas_context, w: -1, h: -1, ready: false, type: "bmp"};

  _downloadables.push(bitmap);

  image.onload = function() {

    bitmap.canvas.width = image.width;
    bitmap.canvas.height = image.height;

    bitmap.context.drawImage(image, 0, 0);

    bitmap.w = image.width;
    bitmap.h = image.height;

    bitmap.ready = true;
  };

  return bitmap;
}

function al_create_transform() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return {tx: 0, ty: 0, sx: 0, sy: 0, ro: 0, id: false};
}

function al_identity_transform(trans) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  trans.id = true;
}

function al_translate_transform(trans, x, y) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!trans.id) {

    // al_identity_transform() has not been called.
    return;
  }

  trans.tx = x;
  trans.ty = y;
}

function al_scale_transform(trans, sx, sy) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!trans.id) {

    // al_identity_transform() has not been called.
    return;
  }

  trans.sx = sx;
  trans.sy = sy;
}

function al_rotate_transform(trans, theta) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!trans.id) {

    // al_identity_transform() has not been called.
    return;
  }

  trans.ro = theta;
}

function al_use_transform(trans) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  // @FIXME: Calling any of the transform functions twice does not increase its values.
  // @FIXME: The expected order is create, identify, translate, scale, rotate, and use.
  // @FIXME: The product of scales and translations works only if translations are applied before scales.

  // @TODO: Make it such that the transformations work no matter the order they were called. Make them stack.

  if (!trans.id) {

    // al_identity_transform() has not been called.
    return;
  }

  _canvas.context.rotate(trans.ro);

  _canvas.context.translate(trans.tx * trans.sy, trans.ty * trans.sy);

  _canvas.context.scale(trans.sy, trans.sy);
}

function al_flip_display() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  // Reset transformations before finalizing the display canvas.
  _canvas.context.setTransform(1, 0, 0, 1, 0, 0);
}

function al_install_mouse() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (_al_install_mouse) {

    // The mouse has already been installed previously.
    return true;
  }

  _canvas.canvas.addEventListener("mouseup", _mouse_up);
  _canvas.canvas.addEventListener("mousedown", _mouse_down);
  _canvas.canvas.addEventListener("mousemove", _mouse_move);
  _canvas.canvas.addEventListener("mousewheel", _mouse_wheel);

  _al_install_mouse = true;

  return _al_install_mouse;
}

function _mouse_up(event) {

  _mouse_button = _mouse_button & ~ (1 << (event.which - 1));
  _mouse_released = _mouse_released | (1 << (event.which - 1));

  event.preventDefault();
}

function _mouse_down(event) {

  _mouse_button = _mouse_button | (1 << (event.which - 1));
  _mouse_pressed = _mouse_pressed | (1 << (event.which - 1));

  event.preventDefault();
}

function _mouse_move(event) {

  _mouse_x = event.offsetX;
  _mouse_y = event.offsetY;

  event.preventDefault();
}

function _mouse_wheel(event) {

  _mouse_z = event.deltaY;

  event.preventDefault();
}

function al_is_al_install_mouse() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  return _al_install_mouse;
}

function al_uninstall_mouse() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_install_mouse) {

    return;
  }

  _canvas.canvas.removeEventListener("mouseup", _mouse_up);
  _canvas.canvas.removeEventListener("mousedown", _mouse_down);
  _canvas.canvas.removeEventListener("mousemove", _mouse_move);
  _canvas.canvas.removeEventListener("mousewheel", _mouse_wheel);

  _al_install_mouse = true;
}

function al_hide_mouse_cursor() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_install_mouse) {

    return;
  }

  _canvas.canvas.style.cursor = "none";

  return true;
}

function al_show_mouse_cursor() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_install_mouse) {

    return;
  }

  _canvas.canvas.style.cursor = "auto";

  return true;
}

function al_draw_rectangle(x1, y1, x2, y2, color, thickness) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_primitives_addon) {

    // al_init_primitives_addon() has not been called.
    return;
  }

  // Get the width and height of the rectangle from the distances between axes.
  x2 = x2 - x1;
  y2 = y2 - y1;

  _set_stroke_fill_style(_canvas, color, thickness);

  _canvas.context.strokeRect(x1, y1, x2, y2);
}

function al_draw_filled_rectangle(x1, y1, x2, y2, color) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_primitives_addon) {

    // al_init_primitives_addon() has not been called.
    return;
  }

  // Get the width and height of the rectangle from the distances between axes.
  x2 = x2 - x1;
  y2 = y2 - y1;

  _set_stroke_fill_style(_canvas, color, 0);

  _canvas.context.fillRect(x1, y1, x2, y2);
}

function al_draw_triangle(x1, y1, x2, y2, x3, y3, color, thickness) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_primitives_addon) {

    // al_init_primitives_addon() has not been called.
    return;
  }

  _set_stroke_fill_style(_canvas, color, thickness);

  _canvas.context.beginPath();
  _canvas.context.moveTo(x1, y1);
  _canvas.context.lineTo(x2, y2);
  _canvas.context.lineTo(x3, y3);
  _canvas.context.closePath();
  _canvas.context.stroke();
}

function al_draw_filled_triangle(x1, y1, x2, y2, x3, y3, color) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_primitives_addon) {

    // al_init_primitives_addon() has not been called.
    return;
  }

  _set_stroke_fill_style(_canvas, color, 0);

  _canvas.context.beginPath();
  _canvas.context.moveTo(x1, y1);
  _canvas.context.lineTo(x2, y2);
  _canvas.context.lineTo(x3, y3);
  _canvas.context.closePath();
  _canvas.context.fill();
}

function al_draw_circle(cx, cy, r, color, thickness) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_primitives_addon) {

    // al_init_primitives_addon() has not been called.
    return;
  }

  _set_stroke_fill_style(_canvas, color, thickness);

  _canvas.context.beginPath();
  _canvas.context.arc(cx, cy, r, 0, 2 * ALLEGRO_PI);
  _canvas.context.stroke();
}

function al_draw_filled_circle(cx, cy, r, color) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_primitives_addon) {

    // al_init_primitives_addon() has not been called.
    return;
  }

  _set_stroke_fill_style(_canvas, color, 0);

  _canvas.context.beginPath();
  _canvas.context.arc(cx, cy, r, 0, 2 * ALLEGRO_PI);
  _canvas.context.fill();
}

function al_draw_line(x1, y1, x2, y2, color, thickness) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (!_al_init_primitives_addon) {

    // al_init_primitives_addon() has not been called.
    return;
  }

  _set_stroke_fill_style(_canvas, color, thickness);

  _canvas.context.beginPath();
  _canvas.context.moveTo(x1, y1);
  _canvas.context.lineTo(x2, y2);
  _canvas.context.stroke();
}

function _set_stroke_fill_style(bitmap, color, width) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  var r = color.r;
  var g = color.g;
  var b = color.b;
  var a = color.a / 255.0;

  bitmap.context.lineWidth = width;
  bitmap.context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  bitmap.context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

function al_run_main() {

  // Call main() once the window has loaded.
  window.addEventListener("load", main);
}

function al_load_font(filename, size, flags) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  // @TODO: Manage flags.

  var style = document.createElement("style");
  var font_name = "font_" + Math.random().toString(16).slice(2);

  style.id = font_name;

  document.head.appendChild(style);

  style.textContent = "@font-face {font-family: " + font_name + "; src: url(\"" + filename + "\");}";

  return {element: style, file: filename, name: font_name, size: size, type: "fnt"};
}

function al_draw_text(font, color, x, y, flags, text) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  _set_stroke_fill_style(_canvas, color, 0);

  switch (flags) {

    case ALLEGRO_ALIGN_LEFT:

      _canvas.context.textAlign = "left";
    break;

    case ALLEGRO_ALIGN_CENTER:

      _canvas.context.textAlign = "center";
    break;

    case ALLEGRO_ALIGN_RIGHT:

      _canvas.context.textAlign = "right";
    break;
  }

  _canvas.context.textBaseline = "top";

  _canvas.context.font = font.size + "px " + font.name;

  _canvas.context.fillText(text, x, y);
}

function al_install_audio() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  _audio_context = new AudioContext();
}

function al_uninstall_audio() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  // @TODO: Stop any currently playing samples and loops.

  _audio_context = undefined;
}

function al_is_audio_installed() {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (_audio_context === undefined) {

    return false;
  }

  return true;
}

function al_load_sample(filename) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (_audio_context === undefined) {

    // al_install_audio() has not been called.
    return;
  }

  var audio = document.createElement("audio");

  audio.src = filename;

  var identifier = Math.random().toString(16).slice(2);

  var sample = {element: audio, file: filename, volume: 1.0, ready: false, identifier: identifier, type: "spl"};

  _downloadables.push(sample);

  audio.onloadeddata = function() {

    if (!sample.ready) {

      sample.ready = true;
    }
  }

  sample["identifier"] = identifier;

  _source[sample.identifier] = _audio_context.createMediaElementSource(sample.element);

  return sample;
}

function al_play_sample(spl, gain, pan, speed, loop, ret_id) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (_audio_context === undefined) {

    // al_install_audio() has not been called.
    return;
  }

  // @TODO: Implement ret_id.
  // @TODO: Check compatibility with major browsers for panning.
  // @TODO: Compare how ALLEGRO_PLAYMODE_ONCE functions in Allegro 5 to this.

  spl.volume = gain;
  spl.element.volume = gain;
  spl.element.loop = loop;
  spl.element.playbackRate = speed;

  _source[spl.identifier].disconnect();

  _pan_node[spl.identifier] = _audio_context.createStereoPanner();

  _pan_node[spl.identifier].pan.value = pan;

  _source[spl.identifier].connect(_pan_node[spl.identifier]);
  _pan_node[spl.identifier].connect(_audio_context.destination);

  if (true || spl.element.paused) {

    // Do not play the sample again until it has finished.

    spl.element.currentTime = 0;
    spl.element.play();
  }
}

function al_stop_sample(spl_id) {

  if (!_al_init) {

    // al_init() has not been called.
    return;
  }

  if (_audio_context === undefined) {

    // al_install_audio() has not been called.
    return;
  }

  spl_id.element.pause();
}
