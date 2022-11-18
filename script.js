window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width=1200;
  canvas.height=800;
  let enemies = [];
  let score = 0;

  class InputHandler {
    constructor(){
      this.keys = [];
      //Uses lexical scope to take arrow inputs and makes sure the inputs aren't already in the array
     window.addEventListener('keydown', e => {
      if (( e.key === 'ArrowDown' || 
            e.key === 'ArrowUp' || 
            e.key ==='ArrowLeft' || 
            e.key === 'ArrowRight')
            && this.keys.indexOf(e.key) === -1){
          this.keys.push(e.key);
        }
        //console.log(e.key, this.keys)
       //console.log(input)
      });
      //Once one of the four arrows are no longer being pressed down, they are removed from the array
      window.addEventListener('keyup', e => {
        if (e.key === 'ArrowDown' || 
            e.key === 'ArrowUp' || 
            e.key ==='ArrowLeft' || 
            e.key === 'ArrowRight'){
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight){
      //Turns game width and game height into usable arguments
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 180;
      this.height = 120;
      this.x = 200;
      this.y = gameHeight/2 -100;
      this.image = document.getElementById('playerImage')
      this.speed = 0;
      this.speedY = 0
    } //Makes the entire rectangle white
    draw(context){ 
      context.fillStyle = 'white';
      context.fillRect(this.x /*+ 52*/, this.y /*+ 13*/, this.width, this.height);
      context.drawImage(this.image,this.x - 52,this.y - 13);
    }//When updating the rectangles position, move it right one pixel
    update(input){
      //horizontal movement
      if (input.keys.indexOf('ArrowRight') > -1 && input.keys.length < 2) {
        this.speed = 5;
      }  else if(input.keys.indexOf("ArrowLeft") > -1 && input.keys.length < 2) {
        this.speed = -5;
      } else if (input.keys.indexOf('ArrowUp') > -1 && input.keys.length < 2) {
        this.speedY = -5;
      } else if (input.keys.indexOf('ArrowDown') > -1 && input.keys.length < 2) {
        this.speedY = 5;
      }  
      else {
        this.speed = 0, this.speedY = 0;
      }
       this.x += this.speed; 
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
      else if (this.y < 0) this.y = 0;
      else if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
      // Vertical Movement
      this.y += this.speedY;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight){
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image= document.getElementById('backgroundImage')
      this.x = 0;
      this.y = 0;
      this.width = 6400;
      this.height = 800;
      this.speed = 10;
    }
    draw(context){
      //console.log(typeof(this.image))
      //console.log('wakakwaka')
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
    update(){
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  }
  
  class Enemy {
    constructor(gameWidth, gameHeight){
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119
      this.image = document.getElementById("enemyImage")
      this.x = this.gameWidth;
      this.y = this.gameHeight - ((Math.random() * (this.gameHeight - this.height)) + this.height);
      this.speed = 8;
      this.markedForDeletion = false;
    }
    draw(context){
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update(){
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
    }
  }

  function handleEnemies(deltaTime){
    if (enemyTimer > enemyInterval){
      enemies.push(new Enemy(canvas.width, canvas.height));
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update();
    });
    enemies = enemies.filter(enemy => !enemy.markedForDeletion)
    score++;
  }

  function displayStatusText(context){
    context.font = '30px Helvetica';
    context.fillStyle = 'yellow';
    context.fillText('Score: ' + score, 20, 50);
  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;

function animate(timeStamp){
  //Time stamp is generated from requestAnimationFrame(animate);
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  //Only shows the most recent frame
  ctx.clearRect(0,0,canvas.width,canvas.height);
  //Draws the new position of the player infinitely
  background.draw(ctx);
  background.update()
  //background.update()
  player.draw(ctx);
  player.update(input);
  handleEnemies(deltaTime);
  //Score display
  displayStatusText(ctx);
  requestAnimationFrame(animate);
}
  //Calls the function to draw all the sprites
  animate(0);

});