class Food {

  constructor() {

    this.x = 0;
    this.y = 0;
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
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

    let grid_size = 400 / BLOCK_SIZE;

    let random_x = (Math.random() * 1000) | 0;
    let random_y = (Math.random() * 1000) | 0;

    this.x = random_x % grid_size * BLOCK_SIZE;
    this.y = random_y % grid_size * BLOCK_SIZE;
  }

  reset() {

    this.changeLocation();
  }
}
