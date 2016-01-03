//this function should handle collisions.
var deathTokens = [];

// Enemies our player must avoid
var Enemy = function(x, y, speed, color) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/' + (color || 'enemy') + '-bug.png';
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

//Enemy Ghost class
var GhostEnemy = function(x, y, speed, color) {
    Enemy.call(this, x, y, speed, color);
};

GhostEnemy.prototype = Object.create(Enemy.prototype);
GhostEnemy.prototype.constructor = GhostEnemy;


var collectibleLocs = [];
//Death token class. Change Signature.
var Collectibles = function(x, y){
    this.sprite = 'images/smiley_face.png';

    //TODO: The hardcored numbers here keep the death tokens within the zone region. Fix the board.
    if(x && y){
        this.x = x;
        this.y = y;
    }
    else{
        this.x = Math.floor((Math.random() * 5));
        this.y = Math.floor((Math.random() * 3) + 2);
        console.log("INITIAL LOCS: " + this.x, this.y);

        //****Should this be a helper fct outside of this scope?***
        var isInArray = function(array,item){
            for(var i in array){
                if(array[i][0] === item[0] && array[i][1] === item[1]){
                    return true;
                }
            }
            return false;
        };
    
        //If location is in the collectibleLocs, pick new coordinates.
        while(isInArray(collectibleLocs,[this.x, this.y])){
            this.x = Math.floor((Math.random() * 5));
            this.y = Math.floor((Math.random() * 3) + 2);
        }
    }
    collectibleLocs.push([this.x, this.y]);
    //console.log("token array " + collectibleLocs);
};

//NOT being used yet. Will refactor
Collectibles.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var DeathToken = function(x, y){
    Collectibles.call(this, x, y);
    //TODO: explore if I want this within constructor or outside.
    this.sprite = 'images/gemBlueSml.png';
};
DeathToken.prototype = Object.create(Collectibles.prototype);
DeathToken.prototype.constructor = DeathToken;

var token = new DeathToken(4,4);
var token2 = new DeathToken(3,4);
deathTokens.push(token, token2);



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y){
    this.sprite = 'images/char-princess-girl.png';
    this.isDead = false;
    this.setIsDead = function(state){
        if(state){
            this.sprite = 'images/char-princess-girl-ghost.png';
        }
        else{
            this.sprite = 'images/char-princess-girl.png';
        }
        this.isDead = state;
    };

    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.deathTokens = 0;
};

Player.prototype.update = function(dt){

    for(var i in allEnemies){
        //TODO: Use the actual dimension of bug instead of hardcoding 55. 
        //Check for bug collisons.
        if((this.x >= allEnemies[i].x -55 && this.x <= allEnemies[i].x + 55) && (this.y >= allEnemies[i].y - 55 && this.y <= allEnemies[i].y + 55) 
            && !this.isDead){
            this.isDead = true;
            this.setIsDead(this.isDead);
            this.x = this.initialX;
            this.y = this.initialY;

            var deathToken1 = new DeathToken();
            var deathToken2 = new DeathToken();
            var deathToken3 = new DeathToken();
            deathTokens.push(deathToken1);
            deathTokens.push(deathToken2);
            deathTokens.push(deathToken3); 
        }
    }
    //Handle ghost-girls collection of death tokens. 
    if(this.isDead) {
        for(var i in allEnemyGhosts){
            if((this.x >= allEnemyGhosts[i].x -55 && this.x <= allEnemyGhosts[i].x + 55) && (this.y >= allEnemyGhosts[i].y - 55 && this.y <= allEnemyGhosts[i].y + 55)){
                this.x = this.initialX;
                this.y = this.initialY;
            }
        }


        for(var i in deathTokens){
            // console.log(i + " " +  (101* deathTokens[i].x));
            // console.log('spriteX: ' + this.x);
            //*****Want tokens coordinates to be the same as sprite coordinates!!
            
            if((this.x >= (101*deathTokens[i].x - 20)  && this.x <= (101*deathTokens[i].x) + 20) && (this.y >= (83 *deathTokens[i].y -20)  && this.y <= (83*deathTokens[i].y + 20))){
                this.deathTokens++;
                delete deathTokens[i];
                //console.log("hi");
            }
        }

        if(this.deathTokens === 3){
            this.isDead = false;
            this.setIsDead(this.isDead); 
            this.deathTokens = 0;
        }
    }
    //console.log("num of tokens: " + this.deathTokens); 

};

console.log(deathTokens);
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
var bug1 = new Enemy(0, 100, 50, 'green');
var bug2 = new Enemy(0, 50, 20, 'glowing');
var bug3 = new Enemy(0, 300, 100, 'pink');
var bug4 = new Enemy(0, 150, 43, 'purple');
//var bug5 = new Enemy(0, 190, 32, 'blue');
var bug6 = new Enemy(0, 240, 24);

var allEnemies = [bug1, bug2, bug3, bug4, bug6];

var ghostBug1 = new GhostEnemy(0, 200, 15, 'blue-ghost');
var ghostBug2 = new GhostEnemy(0, 100, 25, 'blue-ghost');
var ghostBug3 = new GhostEnemy(0, 250, 10, 'blue-ghost');
var ghostBug4 = new GhostEnemy(0, 150, 50, 'blue-ghost');
var ghostBug5 = new GhostEnemy(0, 50, 32, 'blue-ghost');

var allEnemyGhosts = [ghostBug1, ghostBug2, ghostBug3, ghostBug4, ghostBug5];

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
