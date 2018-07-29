Snake2 = new class {

  constructor() {

    this.x = 0;
    this.y = BLOCK_SIZE;

    this.x_speed = 1;
    this.y_speed = 0;

    this.number_of_chains = 0;

    this.chains_x = [];
    this.chains_y = [];

    this.color = Momo.makeColor(255, 255, 255);
  }

  update() {

    if (Momo.isKeyPressed("up")) {

      if (this.chains_y[0] !== this.y - BLOCK_SIZE) {

        this.setDirection(0, -1);
      }
    }
    else if (Momo.isKeyPressed("down")) {

      if (this.chains_y[0] !== this.y + BLOCK_SIZE) {

        this.setDirection(0, 1);
      }
    }
    else if (Momo.isKeyPressed("left")) {

      if (this.chains_x[0] !== this.x - BLOCK_SIZE) {

        this.setDirection(-1, 0);
      }
    }
    else if (Momo.isKeyPressed("right")) {

      if (this.chains_x[0] !== this.x + BLOCK_SIZE) {

        this.setDirection(1, 0);
      }
    }

    if (this.x === Food2.getX() && this.y === Food2.getY()) {

      Food2.changeLocation();

      this.chains_x[this.number_of_chains] = this.x;
      this.chains_y[this.number_of_chains] = this.y;

      this.number_of_chains += 1;

      ++score[1];
    }

    let i = 0;

    for (i = this.number_of_chains - 1; i >=0; --i) {

      if (i === 0) {

        this.chains_x[0] = this.x;
        this.chains_y[0] = this.y;
      }
      else {

        this.chains_x[i] = this.chains_x[i - 1];
        this.chains_y[i] = this.chains_y[i - 1];
      }
    }

    this.x += this.x_speed * BLOCK_SIZE;
    this.y += this.y_speed * BLOCK_SIZE;

    if (this.x < 0) {

      this.x = 400;
    }
    else if (this.x > 400) {

      this.x = 0;
    }

    if (this.y < 0) {

      this.y = 400;
    }
    else if (this.y > 400) {

      this.y = 0;
    }

    i = 0;

    for (i; i < this.number_of_chains; ++i) {

      if (this.x === this.chains_x[i] && this.y === this.chains_y[i]) {

        reset = true;
      }
    }
  }

  reset() {

    this.number_of_chains = 0;

    this.chains_x = [];
    this.chains_y = [];

    Food2.changeLocation();

    this.x = 0;
    this.y = BLOCK_SIZE;

    this.x_speed = 1;
    this.y_speed = 0;
  }

  render() {

    let i = 0;

    for (i; i < this.number_of_chains; ++i) {

      // Draw each of the snake's chains.
      Momo.drawFilledCircle(

        this.chains_x[i] + HALF_BLOCK,

        this.chains_y[i] + HALF_BLOCK,

        HALF_BLOCK,

        Momo.makeColor(37, 48, 18)
      );
    }

    // Draw the snake's head.
    Momo.drawFilledCircle(this.x + HALF_BLOCK, this.y + HALF_BLOCK, HALF_BLOCK, Momo.makeColor(37, 48, 18));
  }

  setDirection(x_speed, y_speed) {

    this.x_speed = x_speed;
    this.y_speed = y_speed;
  }
}
