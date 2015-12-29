// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.initialX = x;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x > 500){
        this.x = this.initialX;
    }
    else{
        this.x = this.x + this.speed*dt;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y){
    this.sprite = 'images/char-princess-girl.png';
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
};

//this function should handle collisions.
Player.prototype.update = function(dt){

    for(var i in allEnemies){
        //Use the actual dimension of bug instead of hardcoding 55. 
        if( (this.x >= allEnemies[i].x -55 && this.x <= allEnemies[i].x + 55) && (this.y >= allEnemies[i].y - 55 && this.y <= allEnemies[i].y + 55) ){
            this.x = this.initialX;
            this.y = this.initialY;
        }
    }
    //console.log(allEnemies[1].x, allEnemies[1].y); 
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(input) {
    var tempX = this.x; 
    var tempY = this.y;
    if(input === 'left'){
        tempX -= 20;
    }
    else if(input === 'right'){
        tempX += 20;
    }
    
    if(input === 'up'){
        tempY -= 20;
    }
    else if(input === 'down'){
        tempY += 20;
    }

    //Figure out how to grab global board dimensions.
    if(tempX <=410 && tempX >= -10){
        this.x = tempX;
    }
    if(tempY <= 440 && tempY >= 0){
        this.y = tempY;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var bug1 = new Enemy(50, 100, 70);
var bug2 = new Enemy(20,50, 70);
var bug3 = new Enemy(0, 200, 70);
var allEnemies = [bug1, bug2, bug3];

var player = new Player(10, 400);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
