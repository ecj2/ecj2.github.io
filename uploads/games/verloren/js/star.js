class Star {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.radius = 2;

    this.type = getRandomNumber() % 3;

    this.color = Momo.makeColor(getRandomNumber() % 128, getRandomNumber() % 128, getRandomNumber() % 128, getRandomNumber() % 255);
  }

  render(camera_x, camera_y) {

    let x = 0;
    let y = 0;

    if (this.type === 0) {

      x = this.x - camera_x;
      y = this.y - camera_y;
    }
    else if (this.type === 1) {

      x = this.x - camera_x / 1.25;
      y = this.y - camera_y / 1.25;
    }
    else {

      x = this.x - camera_x * 1.25;
      y = this.y - camera_y * 1.25;
    }

    if (x + this.radius < 0 || y + this.radius < 0) {

      // Do not render stars when they are not within the camera's view.
      return;
    }

    if (x > Momo.getCanvasWidth() * 2 || y > Momo.getCanvasHeight() * 2) {

      // Do not render stars when they are not within the camera's view.
      return;
    }

    Momo.drawFilledCircle(x, y, this.radius, this.color);
  }
}
