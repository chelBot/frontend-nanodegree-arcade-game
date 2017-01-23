//this function should handle collisions.
var deathTokens = [];
var keys = [];
var gem_audio = new Audio('http://opengameart.org/sites/default/files/Picked%20Coin%20Echo.wav');
var key_audio = new Audio('http://opengameart.org/sites/default/files/Picked%20Coin%20Echo%202.wav');
var hell_audio = new Audio('http://opengameart.org/sites/default/files/Forgoten_tombs_1.mp3');
var door_audio = new Audio('http://opengameart.org/sites/default/files/Key%20Jiggle.wav');
var win_audio = new Audio('http://opengameart.org/sites/default/files/Prototype%20Princess%20v1_01.wav');

//********************************************************************************
var collectibleLocs = [];
//Death token class. Change Signature.
var Collectible = function(x, y){
    this.sprite = 'images/smiley_face.png';
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
    this.collected = false;
};

//NOT being used yet. Will refactor
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var DeathToken = function(x, y){
    Collectible.call(this, x, y);
    //TODO: explore if I want this within constructor or outside.
    this.sprite = 'images/gemBlueSml.png';
};
DeathToken.prototype = Object.create(Collectible.prototype);
DeathToken.prototype.constructor = DeathToken;

//*************TODO: figure out why positioning isn't working correctly************
var key = new Collectible( 2*101, 1*83);
console.log("key.x" + key.x);
console.log("key.y" + key.y);


key.sprite = 'images/KeySml.png';
keys.push(key);

//****************************************************************************

// Enemies our player must avoid
var Enemy = function(x, y, speed, color) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper to easily load images
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
        this.x = 0 - 5*this.sprite.length;
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


var HellBug = function(x, y, speed, color){
    Enemy.call(this, x, y, speed, color);
};

HellBug.prototype = Object.create(Enemy.prototype);
HellBug.prototype.constructor = HellBug;


//****************************************************************************
var Reaper = function(x,y){
    this.sprite = 'images/reaperGhost.png';
    this.x = x;
    this.y = y;
    this.initialX= x;
    this.initialY = y;
};
Reaper.prototype.update = function(playerX, playerY){
    this.x = playerX + 80;
    this.y = playerY;
};
Reaper.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var DeathToken = function(x, y){
    Collectible.call(this, x, y);
    //TODO: explore if I want this within constructor or outside.
    this.sprite = 'images/gemBlueSml.png';
};
DeathToken.prototype = Object.create(Collectible.prototype);
DeathToken.prototype.constructor = DeathToken;

//*************TODO: figure out why positioning isn't working correctly************
var key = new Collectible( 2*101, 1*83);
console.log("key.x" + key.x);
console.log("key.y" + key.y);


key.sprite = 'images/KeySml.png';
keys.push(key);

//****************************************************************************
var count = 9;
var countdownInterval;
var timer = function(){
    countdownInterval = setInterval(myTimer, 1000);
}
var myTimer = function() {
    count--;
    console.log('timer count', count);
    document.getElementById("fatherTime").innerHTML = count;
    if(count <= 0){
        hell_audio.play();
        document.getElementById("youLose").innerHTML = "Your Time is Up! <br><br> Game Over.";
        player.hasLost = true;
        stopTimer();
    }
}
var stopTimer = function(){
    clearInterval(countdownInterval);
}
//****************************************************************************

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y){
    this.sprite = 'images/char-princess-girl.png';
    this.isDead = false;
    this.deathAlert = 0;
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

    this.hasKey = false;
    this.prisonSceneFlag = false;
    this.hasWon = false;
    this.hasLost = false;

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
    if(!player.hasLost && !player.isDead){
      //Define target zone for key
        if( (this.x + 101/2) >= (key.x + 43/2 - 20)  && (this.x + 101/2) <= (key.x + 43/2 + 20) && (this.y + 171/2) <= (key.y + 73/2 + 10)){
               key_audio.play();
               this.hasKey = true;
               this.prisonSceneFlag = true;
               delete keys[0];
        }
    }
    if(player.hasKey){
        if(player.prisonSceneFlag){
          this.x = this.initialX;
          this.y = this.initialY;
          this.prisonSceneFlag = false;
        }

        for(var i in allEnemies){
            delete allEnemies[i];
        }
        //Define target zone for door which frees Char Boy.
        if(((this.x + 101/2) >= (101*2) && (this.x + 101/2) <= (101*3)) && ((this.y) <= (130))){
            door_audio.play();
            door_audio.volume= 1;
            this.hasWon = true;
            win_audio.play();
            win_audio.volume = 0.1;
        }
    }

    //Handle ghost-girls collection of death tokens and death timer.
    if(this.isDead) {
        this.deathAlert++;
        if(this.deathAlert === 1){
            timer();
        }
        if(this.hasLost){
            for(var i in allHellBugs){
                if((this.x >= allHellBugs[i].x -55 && this.x <= allHellBugs[i].x + 55) && (this.y >= allHellBugs[i].y - 55 && this.y <= allHellBugs[i].y + 55)){
                    this.x = this.initialX;
                    this.y = this.initialY;
                }
            }
        }
        for(var i in deathTokens){
            // console.log(i + " " +  (101* deathTokens[i].x));
            // console.log('spriteX: ' + this.x);
            //*****Want tokens coordinates to be the same as sprite coordinates!!
            //define token target zone for deathTokens
            if(((this.x + 101/2) >= (101*deathTokens[i].x + 30/2 - 30)  && (this.x + 101/2) <= (101*deathTokens[i].x +30/2) + 30)
            && ((this.y + 171/2) >= (83 *deathTokens[i].y + 52/2 - 60) && ((this.y + 171/2) <= (83*deathTokens[i].y + 52/2 + 20)))){
                this.deathTokens++;
                // gem_audio.play();
                delete deathTokens[i];
            }
        }

        if(this.deathTokens === 3){
            this.isDead = false;
            this.setIsDead(this.isDead);
            this.deathTokens = 0;
            stopTimer();
        }

    }
    if(count <= 0){
        this.hasLost = true;
        this.isDead = true;

        console.log("dead", count);
    }
    if(!this.isDead){
        this.deathAlert = 0;
        count = 9;
        document.getElementById("fatherTime").innerHTML = "";

    }
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
    if(!this.hasKey){
        if(tempY <= 440 && tempY >= 0){
            this.y = tempY;
        }
    }
    else{
        if(tempY <= 440 && tempY >= 100){
            this.y = tempY;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var bug1 = new Enemy(0, 100, 50);
var bug2 = new Enemy(0, 50, 20, 'green');
var bug3 = new Enemy(0, 150, 43, 'purple');
var bug4 = new Enemy(0, 190, 32, 'green');
var bug5 = new Enemy(0, 240, 24);
var bug6 = new Enemy(40, 175, 64);

var allEnemies = [bug1, bug2, bug3, bug4, bug5, bug6];

var ghostBug1 = new GhostEnemy(0, 200, 15, 'blue-ghost');
var ghostBug2 = new GhostEnemy(0, 100, 25, 'blue-ghost');
var ghostBug3 = new GhostEnemy(0, 250, 10, 'blue-ghost');
var ghostBug4 = new GhostEnemy(0, 150, 50, 'blue-ghost');
var ghostBug5 = new GhostEnemy(0, 50, 32, 'blue-ghost');
var ghostBug5 = new GhostEnemy(0, 350, 72, 'blue-ghost');

var allEnemyGhosts = [ghostBug1, ghostBug2, ghostBug3, ghostBug4, ghostBug5];


var hellBug1 = new HellBug(0, 100, 50, 'hell');
var hellBug2 = new HellBug(0, 50, 20, 'hell');
var hellBug3 = new HellBug(0, 300, 100, 'hell');
var hellBug4 = new HellBug(0, 150, 13, 'hell');
var hellBug5 = new HellBug(0, 160, 43, 'hell');
var hellBug6 = new HellBug(0, 180, 83, 'hell');
var hellBug7 = new HellBug(0, 190, 23, 'hell');
var hellBug8 = new HellBug(0, 170, 53, 'hell');
var hellBug9 = new HellBug(0, 180, 93, 'hell');
var hellBug10 = new HellBug(0, 120, 103, 'hell');
var hellBug11 = new HellBug(10, 370, 100, 'hell');
var hellBug12 = new HellBug(20, 270, 10, 'hell');
var hellBug13 = new HellBug(30, 370, 15, 'hell');
var hellBug14 = new HellBug(10, 280, 15, 'hell');
var hellBug15 = new HellBug(0, 430, 50, 'hell');
var hellBug16 = new HellBug(0, 19, 60, 'hell');
var hellBug17 = new HellBug(0, 40, 18, 'hell');
var hellBug18 = new HellBug(0, 100, 19, 'hell');
var hellBug19 = new HellBug(0, 300, 70, 'hell');

var allHellBugs = [hellBug1, hellBug2, hellBug3, hellBug4, hellBug5, hellBug6, hellBug7, hellBug8, hellBug9, hellBug10, hellBug11, hellBug12, hellBug13, hellBug14, hellBug15, hellBug16, hellBug17, hellBug18, hellBug19];

var player = new Player(10, 400);


var reaper = new Reaper(90, 400);


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
