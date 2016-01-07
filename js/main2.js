var game;
var score;
var screenInfo={};
var formGroup;
var circleGroup;
var colors= [];
var config = {
     centre:{
          rayon:50
     },
     stage:{
          backgroundColor:'#eeebe7',
          height:'',
          width:''
     },
     circleDelay: 1500
};

var cursors;
var circle;
var score = 0;
var scoreText;


window.onload = function() {  
     config.stage.height = $(window).outerHeight();
     config.stage.width = $(window).outerWidth();
  game = new Phaser.Game(config.stage.width, config.stage.height, Phaser.AUTO, "");
     game.state.add("PlayGame",playGame);
     game.state.start("PlayGame");
};

var playGame = function(game){};

playGame.prototype = {
  preload: function(){
          game.load.image("circle", "assets/circle.png");
          game.load.image("centre", "assets/centre.png");
  },
    create: function(){
          var line;
          colors= [];
          game.physics.startSystem(Phaser.Physics.ARCADE);
          game.stage.backgroundColor = config.stage.backgroundColor;
          game.physics.arcade.gravity.y = 0;
          game.physics.arcade.gravity.x = 0;
         
          circleGroup = game.add.group();
          circleGroup.enableBody = true;

          formGroup = game.add.group();
          formGroup.enableBody = true;


         line = new Centre(game, -50, -50, 0);
          game.add.existing(line);
          formGroup.add(line);

         line = new Centre(game, 50, -50, 90);
          game.add.existing(line);
          formGroup.add(line);

         line = new Centre(game, 50, 50, 180);
          game.add.existing(line);
          formGroup.add(line);

          line = new Centre(game, -50, 50, -90);
          game.add.existing(line);
          formGroup.add(line);

          formGroup.x = game.world.centerX;
          formGroup.y = game.world.centerY;



          circle = new Circle(game);
           game.add.existing(circle);
           circleGroup.add(circle);

          game.physics.arcade.enable(circleGroup);
          game.physics.arcade.enable(formGroup);
          formGroup.scale.x = 2;
          formGroup.scale.y = 2;
         var tmp =  game.add.sprite(game.world.centerX, game.world.centerY, 'circle');
          tmp.anchor.set(0.5);

         //  The score
         scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

         //  Our controls.
         cursors = game.input.keyboard.createCursorKeys();

         game.input.onDown.add(fireCircle, this);


     },
     update: function(){
         formGroup.angle += 4;
        //  game.physics.arcade.collide(formGroup, circleGroup);
          game.physics.arcade.collide(circleGroup, circleGroup);
     }
};

Centre = function (game, moveToX, moveToY, angle) {
     var color = Math.random() * 0xffffff;
     Phaser.Sprite.call(this, game, moveToX, moveToY, "centre");
     this.angle += angle;
     this.width = config.centre.rayon;
     this.height = config.centre.rayon;

     game.physics.enable(this, Phaser.Physics.ARCADE);
     this.body.immovable = true;

     this.tint = color;
     this.tintIndex = colors.length;
     colors.push(color);
};

Centre.prototype = Object.create(Phaser.Sprite.prototype);
Centre.prototype.constructor = Centre;
Centre.prototype.update = function() {
     var line = this;
};


Circle = function (game) {
     Phaser.Sprite.call(this, game, game.world.centerX , game.height-20, "circle");
     this.anchor.setTo(0.5, 0.5);
     game.physics.enable(this, Phaser.Physics.ARCADE);
     this.body.collideWorldBounds = true;
     this.tintIndex = Math.floor(Math.random()*colors.length);
     this.tint = colors[this.tintIndex];
};

Circle.prototype = Object.create(Phaser.Sprite.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.update = function() {
     var circle = this;
     var x = circle.position.x- game.world.centerX;
     var y = circle.position.y - game.world.centerY;
     var R = Math.sqrt(Math.pow(x,2)  +  Math.pow(y,2));

     if( R <= config.centre.rayon){
          var angle = formGroup.angle%360 * (Math.PI / 180) ,
          cos = Math.cos(angle),
          sin = Math.sin(angle);
          xRotate = cos*x + sin*y;
          yRotate = -sin*x + cos*y;

          if(xRotate<0 && yRotate<0){
               if(circle.tintIndex === 0){
                    success();
              }
              else{
               error();
              }
          }
          else if(xRotate>0 && yRotate<0){
               if(circle.tintIndex === 1){
                    success();
              }
              else{
               error();
              }
          }
          else if(xRotate>0 && yRotate>0){
               if(circle.tintIndex === 2){
                    success();
              }
              else{
               error();
              }
          }
          else if(xRotate<0 && yRotate>0){
               if(circle.tintIndex === 3){
                    success();
              }
              else{
               error();
              }
          }
          circle.destroy();
     }
};
function success(){
     score +=10;
     scoreText.text = 'Score: ' + score;
}
function error(){
     formGroup.scale.x -= 0.5;
     formGroup.scale.y -= 0.5;
     if(formGroup.width <= 0){
          game.state.start("PlayGame");
     }
}
function fireCircle() {
  game.physics.arcade.moveToXY(circle, game.world.centerX, game.world.centerY,700);

  circle = new Circle(game);
  game.add.existing(circle);
  circleGroup.add(circle);
}