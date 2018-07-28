Ship = new class {

  constructor() {

    this.setup();
  }

  setup() {

    this.x = 0.0;
    this.y = 0.0;

    this.w = 16;
    this.h = 32;

    // Spawn facing a random direction.
    this.angle = getRandomNumber() % (Math.PI * 2);

    this.speed = 3.0;

    this.friction = 0.99;

    this.velocity_x = 0.0;
    this.velocity_y = 0.0;

    this.draw_flame = false;

    this.flame_offset_y = 0.0;
    this.flame_offset_angle_y = 0.0;

    this.fuel = 100.0;

    this.radius = 32;

    this.energy = 100;
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }

  getFuel() {

    return this.fuel | 0;
  }

  getEnergy() {

    return this.energy;
  }

  getRadius() {

    return this.radius;
  }

  getAngle() {

    return this.angle;
  }

  update() {

    if (this.fuel < 0) {

      this.fuel = 0;
    }

    if (this.fuel > 0.0 && this.draw_flame) {

      this.fuel -= 0.0125;

      if (Momo.isKeyReleased("w")) {

        this.draw_flame = false;
      }

      this.flame_offset_angle_y += 0.75;

      this.flame_offset_y += -Math.cos(this.flame_offset_angle_y);
    }

    if (this.fuel <= 0.0) {

      this.draw_flame = false;
    }

    this.x += this.velocity_x;
    this.y += this.velocity_y;

    this.velocity_x *= this.friction;
    this.velocity_y *= this.friction;

    bullets.forEach(

      (value, index) => {

        if (bullets[index].getType() === 1) {

          let distance = Math.sqrt(

            Math.pow(bullets[index].getX() - this.x, 2) + Math.pow(bullets[index].getY() - this.y, 2)
          );

          if (distance < bullets[index].getRadius() * 4) {

            this.inflictDamage(1);

            bullets[index].setTicks(0);
          }
        }
      }
    );
  }

  render(camera_x, camera_y) {

    let translate_x = this.x - camera_x;
    let translate_y = this.y - camera_y;

    context.save();

    context.translate(translate_x, translate_y);

    context.rotate(this.angle);

    context.translate(-translate_x, -translate_y);

    context.translate(-this.w / 2, -this.h / 2);

    if (this.draw_flame) {

      context.save();

      // Shake the flame to simulate animation.
      context.translate(0, -this.flame_offset_y);

      // Draw flame core.
      Momo.drawFilledPolygon(

        [
          this.x - camera_x,

          this.y + this.h - camera_y,

          this.x + this.w / 2 - camera_x,

          this.y + this.h * 1.5 - camera_y,

          this.x + this.w - camera_x,

          this.y + this.h - camera_y
        ],

        Momo.makeColor(255, 255, 0)
      );

      // Draw flame outline.
      Momo.drawPolygon(

        [

          this.x + 2 - camera_x,

          this.y + this.h - camera_y,

          this.x + this.w / 2 - camera_x,

          this.y + this.h * 1.5 - camera_y,

          this.x + this.w - 2 - camera_x,

          this.y + this.h - camera_y
        ],

        Momo.makeColor(255, 0, 0),

        3
      );

      context.restore();
    }

    let points = [

      this.x - camera_x,

      this.y + this.h - camera_y,

      this.x + this.w / 2 - camera_x,

      this.y - camera_y,

      this.x + this.w - camera_x,

      this.y + this.h - camera_y
    ];

    // Draw the ship.
    Momo.drawFilledPolygon(points, Momo.makeColor(0, 0, 0));
    Momo.drawPolygon(points, Momo.makeColor(255, 255, 255), 3);

    context.restore();
  }

  rotateLeft() {

    this.angle -= 0.05;
  }

  rotateRight() {

    this.angle += 0.05;
  }

  applyThrust() {

    if (this.fuel > 0.0 || engage_ftl) {

      this.draw_flame = true;

      this.velocity_x += Math.sin(this.angle) * this.speed * 0.1;
      this.velocity_y += -Math.cos(this.angle) * this.speed * 0.1;
    }
  }

  ejectFuel() {

    if (this.fuel <= 0) {

      return;
    }

    let a = 0.0;

    while (a < Math.PI * 2) {

      a += Math.PI / 4;

      bullets[bullet_identifier] = new Bullet(Ship.getX(), Ship.getY(), a, bullet_identifier, 0);

      ++bullet_identifier;
    }

    this.fuel -= 1;
  }

  inflictDamage(amount) {

    bigger_shake = true;

    this.energy -= amount;

    if (this.energy <= 0) {

      state = LOSE;
    }
  }

  isAccelerating() {

    return this.draw_flame;
  }
};
