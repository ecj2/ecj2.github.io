class Snake {

  constructor() {

    this.x = 0;
    this.y = BLOCK_SIZE;

    this.velocity_x = 1;
    this.velocity_y = 0;

    this.segments_x = [];
    this.segments_y = [];

    this.number_of_segments = 0;
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }

  update() {

    let i = this.number_of_segments - 1;

    for (i; i >= 0; --i) {

      // Move the snake's segments.

      if (i === 0) {

        this.segments_x[0] = this.x;
        this.segments_y[0] = this.y;
      }
      else {

        this.segments_x[i] = this.segments_x[i - 1];
        this.segments_y[i] = this.segments_y[i - 1];
      }
    }

    // Move the snake's head.
    this.x += this.velocity_x * BLOCK_SIZE;
    this.y += this.velocity_y * BLOCK_SIZE;

    i = 0;

    for (i; i < this.number_of_segments; ++i) {

      if (this.x === this.segments_x[i] && this.y === this.segments_y[i]) {

        // Snake's head collided with one of its segments.

        reset();

        break;
      }
    }
  }

  addSegment() {

    this.segments_x[this.number_of_segments] = this.x;
    this.segments_y[this.number_of_segments] = this.y;

    ++this.number_of_segments;
  }

  render() {

    let i = 0;

    for (i; i < this.number_of_segments; ++i) {

      // Draw the snake's segments.
      Momo.drawFilledCircle(

        this.segments_x[i] + HALF_BLOCK,

        this.segments_y[i] + HALF_BLOCK,

        HALF_BLOCK,

        Momo.makeColor(37, 48, 18)
      );
    }

    // Draw the snake's head.
    Momo.drawFilledCircle(this.x + HALF_BLOCK, this.y + HALF_BLOCK, HALF_BLOCK, Momo.makeColor(37, 48, 18));
  }

  moveUp() {

    if (this.segments_y[0] !== this.y - BLOCK_SIZE) {

      this.velocity_x = 0;
      this.velocity_y = -1;
    }
  }

  moveDown() {

    if (this.segments_y[0] !== this.y + BLOCK_SIZE) {

      this.velocity_x = 0;
      this.velocity_y = 1;
    }
  }

  moveLeft() {

    if (this.segments_x[0] !== this.x - BLOCK_SIZE) {

      this.velocity_x = -1;
      this.velocity_y = 0;
    }
  }

  moveRight() {

    if (this.segments_x[0] !== this.x + BLOCK_SIZE) {

      this.velocity_x = 1;
      this.velocity_y = 0;
    }
  }

  reset() {

    this.x = 0;
    this.y = BLOCK_SIZE;

    this.velocity_x = 1;
    this.velocity_y = 0;

    this.segments_x = [];
    this.segments_y = [];

    this.number_of_segments = 0;
  }

  getSegmentSize() {

    return this.number_of_segments;
  }

  getSegmentsX() {

    return this.segments_x;
  }

  getSegmentsY() {

    return this.segments_y;
  }
}
