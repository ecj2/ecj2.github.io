Food = new class {

  constructor() {

    this.x = 0;
    this.y = 0;
  }

  update() {

    //
  }

  render() {

    Momo.drawFilledCircle(

      this.x + BLOCK_SIZE / 2,

      this.y + BLOCK_SIZE / 2,

      BLOCK_SIZE / 2,

      Momo.makeColor(178, 0, 0)
    );
  }

  changeLocation() {

    if (Snake.number_of_chains === 0) {

      let w = 400 / BLOCK_SIZE;
      let h = 400 / BLOCK_SIZE;

      let random_x = ((Math.random() * 1000) | 0);
      let random_y = ((Math.random() * 1000) | 0);

      this.x = (random_x % w) * BLOCK_SIZE;
      this.y = (random_y % h) * BLOCK_SIZE;

      return;
    }

    let i = 0;

    for (i; i < Snake.number_of_chains; ++i) {

      if ((this.x === Snake.chains_x[i] && this.y === Snake.chains_y[i]) || (this.x === Snake.x && this.y === Snake.y)) {

        // Food spawned on snake. Try different location.

        let w = 400 / BLOCK_SIZE;
        let h = 400 / BLOCK_SIZE;

        let random_x = ((Math.random() * 1000) | 0);
        let random_y = ((Math.random() * 1000) | 0);

        this.x = (random_x % w) * BLOCK_SIZE;
        this.y = (random_y % h) * BLOCK_SIZE;
      }
    }
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }
}
