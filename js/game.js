class Main {
  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('wallV', './assets/wallVertical.png');
    this.load.image('wallH', './assets/wallHorizontal.png');
    this.load.image('coin', './assets/coin.png');
    this.load.image('enemy', 'assets/enemy.png');
  }

  create() {
    this.player = this.physics.add.sprite(250, 170, 'player');
    this.player.body.gravity.y = 500;

    this.coin = this.physics.add.sprite(60, 130, 'coin');
    
    this.enemies = this.physics.add.group();
    this.time.addEvent({
      delay: 2200,
      callback: () => this.addEnemy(),
      loop: true,
    })

    this.scoreLabel = this.add.text(30, 25, 'Score: 0',
    { font: '18px Arial', fill: '#fff' });
    this.score = 0;

    this.arrow = this.input.keyboard.createCursorKeys();

    this.createWorld();
  }

  update() {
    this.physics.collide(this.player, this.walls);
    this.physics.collide(this.enemies, this.walls);

    this.movePlayer();

    if (this.player.y > 340 || this.player.y < 0) {
      this.playerDie();
    }

    if (this.physics.overlap(this.player, this.coin)) {
      this.takeCoin();
      this.updateCoinPosition();
    }

    if (this.physics.overlap(this.player, this.enemies)) {
      this.playerDie();
    }
  }

  movePlayer() {
    if (this.arrow.left.isDown) {
      this.player.body.velocity.x = -200;
    } else if (this.arrow.right.isDown) {
      this.player.body.velocity.x = 200;
    } else {
      this.player.body.velocity.x = 0;
    }

    if (this.arrow.up.isDown && this.player.body.onFloor()) {
      this.player.body.velocity.y = -320;
    }
  }

  createWorld() {
    this.walls = this.physics.add.staticGroup();
    
    this.walls.create(10, 170, 'wallV');
    this.walls.create(490, 170, 'wallV');

    this.walls.create(50, 10, 'wallH');
    this.walls.create(450, 10, 'wallH');
    this.walls.create(50, 330, 'wallH');
    this.walls.create(450, 330, 'wallH');

    this.walls.create(0, 170, 'wallH');
    this.walls.create(500, 170, 'wallH');
    this.walls.create(250, 90, 'wallH');
    this.walls.create(250, 250, 'wallH');
  }

  playerDie() {
    this.scene.start('main')
  }

  takeCoin() {
    this.score +=5;
    this.scoreLabel.setText('Score: ' + this.score);
  }

  updateCoinPosition() {
    let positions = [
      { x: 140, y: 60 },
      { x: 360, y: 60 },
      { x: 60, y: 140 },
      { x: 440, y: 140 },
      { x: 130, y: 300 },
      { x: 370, y: 300 },
    ];

    positions = positions.filter(coin => coin.x !== this.coin.x);

    let newPosition = Phaser.Math.RND.pick(positions);

    this.coin.setPosition(newPosition.x, newPosition.y);
  }

  addEnemy() {
    let enemy = this.enemies.create(250, -10, 'enemy');

    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = Phaser.Math.RND.pick([-100, 100]);
    enemy.body.bounce.x = 1;

    this.time.addEvent({
      delay: 10000,
      callback: () => enemy.destroy(),
    })
  }
}

let game = new Phaser.Game({
  width: 500,
  height: 340,
  backgroundColor: '#3498db',
  physics: { default: 'arcade' },
  parent: 'game',
});

game.scene.add('main', Main);
game.scene.start('main');