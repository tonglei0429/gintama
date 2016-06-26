// 1. 声明游戏对象 'game'
// 前两个参数，800, 600 为游戏界面尺寸
// 第三个参数可以为 Phaser.CANVAS, Phaser.WEBGL, Phaser.AUTO 代表浏览器渲染模式，AUTO = ? WEBGL : CANVAS
// 第四个参数代表 html 中的 DOM 元素，非必需
// 第五个参数为监听器
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
// 3. 定义全局变量
var resRoot = 'assets';
var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;

function preload() {
	// 2. 预加载资源，第一个参数是Key，第二参数是资源路径
	game.load.image('sky', resRoot + '/sky.png');
	game.load.image('ground', resRoot + '/platform.png');
	game.load.image('star', resRoot + '/star.png');
	// 将资源加载为Sprite Sheet，每32*48为一个Sprite
	game.load.spritesheet('dude', resRoot + '/dude.png', 32, 48);
}

function create() {
	// 4. 配置物理环境
	game.physics.startSystem(Phaser.Physics.ARCADE);
	// 5. 设置背景
	// 前两个参数代表位置
	// 第三个参数是添加的对象，在2中定义
	game.add.sprite(0, 0, 'sky');
	// 6. 创建元素组，比如石块和地面
	platforms = game.add.group();
	// 7. 使其可碰撞
	platforms.enableBody = true;
	// 8. 创建地面, 前两个参数代表位置
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	// 9. 适应屏幕大小
	ground.scale.setTo(2, 2);
	// 10. 固定位置
	ground.body.immovable = true;
	// 11. 再创建两个台阶
	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;

	// 12. 创建主人公
	player = game.add.sprite(32, game.world.height - 150, 'dude');
	game.physics.arcade.enable(player);
	// 13. 增加物理属性，比如弹力，重力
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;
	// 14. 设置动作，左右移动
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	// 16. 键盘事件
	cursors = game.input.keyboard.createCursorKeys();

	stars = game.add.group();

  stars.enableBody = true;

  // 18. 创建一堆星星
  for (var i = 0; i < 12; i++) {
      var star = stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 60;
      star.body.bounce.y = 0.3 + Math.random() * 0.2;
  }

	// 22. 创建分数标签
	scoreText = game.add.text(16, 16, 'score: 0', {fontSize:'32px', fill:'#000'});
}

function update() {
	// 15. 判断碰撞
	game.physics.arcade.collide(player, platforms);
	// 19. 支持碰撞
  game.physics.arcade.collide(stars, platforms);
  // 20. 碰撞事件
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

	// 17. 响应键盘事件
  player.body.velocity.x = 0;
  if (cursors.left.isDown) {
      //  左移
      player.body.velocity.x = -150;
      player.animations.play('left');
  } else if (cursors.right.isDown) {
      //  右移
      player.body.velocity.x = 150;
      player.animations.play('right');
  } else {
      player.animations.stop();
      player.frame = 4;
  }

  //  跳
  if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -350;
  }
}

function collectStar (player, star) {
	// 21. 消灭星星
  star.kill();
  // 23. 记分
  score += 10;
  scoreText.text = 'Score: ' + score;
}
