		var sketchProc=function(processingInstance){ with (processingInstance){
// NIE RUSZAĆ TEGO NA GÓRZE /\ 
		
var sizeX = 600;
var sizeY = 600;

size(sizeX, sizeY);
frameRate(60);


// Scroll down to "About" for instructions on this project ↓

// dodanie nowych ekranow do gry
var game_state = 1; // 0: Title screen. 1: Play. 3: Game over.

// nowa proba odliczanie
var startTime = Date.now();
//Podaj ile minut ma gracz na wykonanie zadania
var czasNaZadanie = 1;

var klwiaturaWcisnieta = false;

var Tile = function(x, y, face) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.face = face;
    this.isFaceUp = false;
    this.isMatch = false;
    this.maxTime = 15;

    
};

Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};

Tile.prototype.draw = function() {
   
    if (this.isFaceUp) {
        fill(214, 247, 202);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.width, 10);
        image(this.face, this.x, this.y, this.width, this.width);
    } else {
        if(this.isUnderMouse(mouseX, mouseY) ){
        fill(47, 26, 235);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.width, 10);
        //image(requestImage("avatars/leaf-red.png"), this.x, this.y, this.width, this.width);
        
        } else {
        fill(214, 247, 202);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.width, 10);
        //image(requestImage("avatars/leaf-green.png"), this.x, this.y, this.width, this.width);
        }
    }
    loop();
};

// Global config
var NUM_COLS = 5;
var NUM_ROWS = 4;

// Declare an array of all possible faces
var faces = [
    requestImage("avatars/leafers-seed.png"),
    requestImage("avatars/leafers-seedling.png"),
    requestImage("avatars/leafers-sapling.png"),
    requestImage("avatars/leafers-tree.png"),
    requestImage("avatars/leafers-ultimate.png"),
    requestImage("avatars/marcimus.png"),
    requestImage("avatars/mr-pants.png"),
    requestImage("avatars/mr-pink.png"),
    requestImage("avatars/old-spice-man.png"),
    requestImage("avatars/robot_female_1.png")
];

// Make an array which has 2 of each, then randomize it
var possibleFaces = faces.slice(0);
var selected = [];
for (var i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
    // Randomly pick one from the array of remaining faces
    var randomInd = floor(random(possibleFaces.length));
    var face = possibleFaces[randomInd];
    // Push twice onto array
    selected.push(face);
    selected.push(face);
    // Remove from array
    possibleFaces.splice(randomInd, 1);
}

// Now shuffle the elements of that array
var shuffleArray = function(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var ind = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[ind];
        array[ind] = temp;
    }
};
shuffleArray(selected);

// Create the tiles
var tiles = [];
for (var i = 0; i < NUM_COLS; i++) {
    for (var j = 0; j < NUM_ROWS; j++) {
        var tileX = i * 78 + 10;
        var tileY = j * 78 + 40;
        var tileFace = selected.pop();
        tiles.push(new Tile(tileX, tileY, tileFace));
    }
}

background(255, 255, 255);

var numTries = 0;
var numMatches = 0;
var flippedTiles = [];
var delayStartFC = null;


var mousePressed = function() {

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.isUnderMouse(mouseX, mouseY)) {
                if (flippedTiles.length < 2 && !tile.isFaceUp) {
                    tile.isFaceUp = true;
                    flippedTiles.push(tile);
                    if (flippedTiles.length === 2) {
                        numTries++;
                        if (flippedTiles[0].face === flippedTiles[1].face) {
                            flippedTiles[0].isMatch = true;
                            flippedTiles[1].isMatch = true;
                            flippedTiles.length = 0;
                            numMatches++;
                        }
                        delayStartFC = frameCount;
                    }
                }
                loop();
            }
        }
};


//Reset moja funkcja !!!!
var restart = function() {
    startTime = Date.now();
    Tile.prototype.draw();

    // Make an array which has 2 of each, then randomize it
    possibleFaces = faces.slice(0);
    selected = [];
    for (var i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
        // Randomly pick one from the array of remaining faces
        var randomInd = floor(random(possibleFaces.length));
        var face = possibleFaces[randomInd];
        // Push twice onto array
        selected.push(face);
        selected.push(face);
        // Remove from array
        possibleFaces.splice(randomInd, 1);
    }
    
    shuffleArray(selected);
    
    // Create the tiles
    tiles = [];
    for (var i = 0; i < NUM_COLS; i++) {
        for (var j = 0; j < NUM_ROWS; j++) {
            var tileX = i * 78 + 10;
            var tileY = j * 78 + 40;
            var tileFace = selected.pop();
            tiles.push(new Tile(tileX, tileY, tileFace));
        }
    }
    
    numTries = 0;
    numMatches = 0;
    flippedTiles = [];
    delayStartFC = null;
    
    mousePressed();

};

var keyPressed = function () {
  klwiaturaWcisnieta = true;
};

var keyReleased = function () {
    klwiaturaWcisnieta = false;
};


//funkcja odliczanie czasu
var czasDoKoncaZadznia = function () {
    var ileZostaloCzasu = czasNaZadanie - Math.floor((Date.now()-startTime)/60000);
    return ileZostaloCzasu;
}

//ukradzione z KhAc
var title = function(str, x, y, blur_size, blur_alpha, col_text, col_outline) {
    if (col_outline !== undefined) {
        fill((col_outline & 0x00ffffff) | (blur_alpha<<24));
    }
    for (var a = 0; a < 360; a += 10) {
        if (col_outline === undefined) {
            fill(lerpColor(
                    lerpColor(col_text, 0, 0.9),
                    lerpColor(col_text, color(255,255,255), 0.4),
                    cos(a+120)>0?1:((cos(a+120)+1)/2)
                )
                & 0x00ffffff
                | (blur_alpha<<24)
            );
        }
        text(str, x+blur_size*cos(a), y+blur_size*sin(a));
    }
    fill(col_text);
    text(str, x, y);
};


var draw = function() {
    var title_red = color(255, 100, 50); // should be const
    var title_grn = color(13, 184, 67);  // should be const

   // ekran wyboru wielkosci planszy

    //zrobic

   // ekran gry
   if (game_state === 1) {


        background(255, 255, 255);
        if (delayStartFC && (frameCount - delayStartFC) > 30) {
            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                if (!tile.isMatch) {
                    tile.isFaceUp = false;
                }
            }
            flippedTiles = [];
            delayStartFC = null;
            noLoop();
        }

        for (var i = 0; i < tiles.length; i++) {
            tiles[i].draw();
        }

        if (numMatches === tiles.length/2) {
            fill(0, 0, 0);
            textSize(20);
            text("You found them all in " + numTries + " tries!", 20, 375);

        }
        // ciagle wywolywanie aktualnego czasu
        Date.now();
        // nowy licznik czasu

        if (numMatches !== tiles.length/2){
            fill(0,0,0);
            textSize(20);
            if(czasDoKoncaZadznia()<=0) {

            text("CZAS MINAL KONIEC GRY!",15,15,2000,20);

            } else {
                text("Pozostaly czas gry " + czasDoKoncaZadznia() + " min." ,15,15,2000,20);
            }
        }
    }

        if(czasDoKoncaZadznia()<=0) {
            game_state = 3;
         }

    //ekran game ober i punkty

    if (game_state === 3) {
        background(255, 255, 255);
        textSize(100);
        title("Game",  46+random(8),  80+random(8), 4, 45, title_red);
        title("Over!", 61+random(8), 180+random(8), 4, 45, title_red);
        textSize(30);

        title("KONIEC CZASU", 10, 240, 2.5, 35, title_grn);
        fill(0, 0, 0);
        textSize(20);
        text("press keyboard to play again.", 10, 280);
    }



    if (klwiaturaWcisnieta) {
      game_state = 1;
      restart();
    } 

};

noLoop();






// NIE RUSZAĆ TEGO POD SPODEM \/ 
		}};
