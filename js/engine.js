/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas,
        ctx,
        lastTime,

        loadCanvas = function() {
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d')
            //div = document.createElement('div'); 
            //div.id = "canvas";
            canvas.id     = "canvas";
            canvas.width  = 505;
            canvas.height = 606;
            win.sharedCanvas = canvas;
            //doc.body.appendChild(canDiv);
            canDiv.appendChild(canvas);

        };
        loadCanvas();

        //****How to make these values global? Need sharedBoard.
        win.numRows = 6;
        win.numCols = 5;

        // win.sharedCanvas = canvas;


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        if(player.isDead){
            allEnemyGhosts.forEach(function(ghost) {
                ghost.update(dt);
            });
        }
        if(player.hasLost){
            allHellBugs.forEach(function(hellBug) {
                hellBug.update(dt);
            });
            reaper.update(player.x, player.y);
        }

        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
       
        var rowImagesHell = [
            'images/hell-water-block.png', 
            'images/hell-stone-block.png',  
            'images/hell-stone-block.png',   
            'images/hell-stone-block.png',   
            'images/hell-stone-block.png',   
            'images/hell-stone-block.png'   
            
         
        ],

        rowImagesWin = [
            'images/Dirt-Block.png',   
            'images/Stone-Block-Tall.png',
            'images/Dirt-Block.png',    
            'images/Dirt-Block.png',   
            'images/Dirt-Block.png',   
            'images/Dirt-Block.png',
            'images/Door-Tall-Closed.png',
            'images/char-boy.png'
        ],
            // numRows = 6,
            // numCols = 5,
            // row, col;

        // }
        //player is dead; render hell
         rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png',    // Row 2 of 2 of grass
        ],
            // numRows = 6,
            // numCols = 5,
        row, col;
       

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        if(!player.hasLost && !player.hasKey){
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /* The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to our images
                     * so that we get the benefits of caching these images, since
                     * we're using them over and over.
                     */
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
        }
        else if(player.hasKey){
            ctx.drawImage(Resources.get(rowImagesWin[1]), 1*101, 0*83);
            ctx.drawImage(Resources.get(rowImagesWin[1]), 3*101, 0*83);
            for (row = 0; row < numRows; row++){
                for (col = 0; col < numCols; col++){
                    if(!(row === 0 && (col === 1 || col === 3)) && !(row ===1 && col === 2)){
                    ctx.drawImage(Resources.get(rowImagesWin[row]), col*101, row*83);
                    }
                }
            }
           ctx.drawImage(Resources.get(rowImagesWin[7]), 2*101, 0*83);
           ctx.drawImage(Resources.get(rowImagesWin[6]), 2*101, 1*83);

        }
        
         else{
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /* The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to our images
                     * so that we get the benefits of caching these images, since
                     * we're using them over and over.
                     */
                    ctx.drawImage(Resources.get(rowImagesHell[row]), col * 101, row * 83);
                }
            }
        }
      
        if(player.isDead && !player.hasLost){
            for(var i in deathTokens){
                //deathTokens[i].render();
                //console.log(deathTokens[i].x, deathTokens[i].y);
                //TODO:
                ctx.drawImage(Resources.get(deathTokens[i].sprite), deathTokens[i].x * 101, deathTokens[i].y * 83);
            }   
        }
        //console.log(player.sprite);

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        //if(player.sprite === "images/char-princess-girl.png"){
        if(!player.hasLost && !player.hasKey){
            allEnemies.forEach(function(enemy) {
                enemy.render();
            });
        }
        if(!player.hasLost && !player.isDead && keys[0] !== undefined){
            keys[0].render();
        }
        if(player.hasLost){
            allHellBugs.forEach(function(hellBug) {
                hellBug.render();
                
            });
            reaper.render();
        }
        if(player.isDead){
            allEnemyGhosts.forEach(function(ghost) {
                ghost.render();
            });
        }
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/glowing-bug.png',
        'images/pink-bug.png',
        'images/purple-bug.png',
        'images/blue-bug.png',
        'images/green-bug.png',
        'images/char-boy.png',
        'images/char-princess-girl.png',
        'images/gemBlueSml.png',
        'images/KeySml.png',
        'images/char-princess-girl-ghost.png',
        'images/blue-ghost-bug.png',
        'images/smiley_face.png',
        'images/reaperGhost.png',
        'images/hell-stone-block.png',
        'images/hell-water-block.png',
        'images/hell-grass-block.png',
        'images/hell-bug.png',
        'images/Dirt-Block.png',
        'images/Door-Tall-Closed.png',
        'images/Stone-Block-Tall.png'




    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);

