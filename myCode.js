		var sketchProc=function(processingInstance){ with (processingInstance){
// NIE RUSZAĆ TEGO NA GÓRZE /\ 
		
var sizeX = 600;
var sizeY = 600;

size(sizeX, sizeY);
frameRate(60);


// Scroll down to "About" for instructions on this project ↓

// Global config
var NUM_COLS = 5;
var NUM_ROWS = 4;

// dodanie nowych ekranow do gry
var game_state = 0; // 0: Start screen. 1: Play. 3: Game over. 4:You Won.

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

//Konstruktor do przyciskow

var Button = function(config) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.width = config.width || 170;
    this.height = config.height || 50;
    this.label = config.label || "Click";
};

Button.prototype.draw = function() {
    fill(0, 234, 255);
    rect(this.x, this.y, this.width, this.height, 5);
    fill(0, 0, 0);
    textSize(19);
    textAlign(LEFT, TOP);
    text(this.label, this.x+10, this.y+this.height/4);
};

var btn1 = new Button({
    x: 100,
    y: 70,
    label: "Game board 5 x 4"
});

var btn2 = new Button({
    x: 100,
    y: 170,
    label: "Game board 4 x 4"
});
var btn3 = new Button({
    x: 100,
    y: 270,
    label: "Game board 2 x 2"
});



Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};
// kopia funkcji dla przyciskow ( tak na probe)
Button.prototype.isMouseInside  = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.height;
};

var numTries = 0;
var numMatches = 0;
var flippedTiles = [];
var delayStartFC = null;


var mousePressed = function() {
    if (game_state !== 0) {
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
    }
        //dla ekranu wyboru planszy
    else if (game_state === 0) {
            if (btn1.isMouseInside(mouseX,mouseY)) {
                NUM_COLS = 5;
                NUM_ROWS = 4;
                game_state = 1;
                restart();
            }
            else if (btn2.isMouseInside(mouseX,mouseY)) {
                NUM_COLS = 4;
                NUM_ROWS = 4;
                game_state = 1;
                restart();
            }
            else if (btn3.isMouseInside(mouseX,mouseY)) {
                NUM_COLS = 2;
                NUM_ROWS = 2;
                game_state = 1;
                restart();
            }

    }
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

   //Ekran startowy
      if (game_state === 0) {
           background(255, 255, 255);
           textSize(30);
           title("Choose game board", 30+random(8),  30+random(8), 4, 45, title_grn);
           btn1.draw();
           btn2.draw();
           btn3.draw();
      }

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

        // ciagle wywolywanie aktualnego czasu
        Date.now();

        // czas do konca gry
        fill(0,0,0);
        textSize(25);
        text("Pozostaly czas gry " + czasDoKoncaZadznia() + " min." ,20,10,2000,30);

        if(czasDoKoncaZadznia()<=0) {
            game_state = 3;
        }
        if (numMatches === tiles.length/2) {
            game_state = 4;
        }
   }



    //ekran game ober i punkty

   if (game_state === 3) {
        background(255, 255, 255);
        textSize(100);
        title("Game",  46+random(8),  20+random(8), 4, 45, title_red);
        title("Over!", 61+random(8), 120+random(8), 4, 45, title_red);
        textSize(30);
        title("TIME OUT", 10, 240, 2.5, 35, title_grn);
        fill(0, 0, 0);
        textSize(20);
        text("press keyboard to play again.", 10, 300);
   }

    // ekran wygranej
   if (game_state === 4) {
            background(255, 255, 255);
            textSize(100);
            title("You",  46+random(8),  20+random(8), 4, 45, title_red);
            title("Won!", 61+random(8), 120+random(8), 4, 45, title_red);
            textSize(30);
            title("You found them all in", 10, 240, 2.5, 35, title_grn);
            title(numTries+ " tries!", 10, 270, 2.5, 35, title_grn);
            fill(0, 0, 0);
            textSize(20);
            text("press keyboard to play again.", 10, 300);
       }







    if (klwiaturaWcisnieta) {
      game_state = 0;
      //restart();
    } 

};

noLoop();






// NIE RUSZAĆ TEGO POD SPODEM \/ 
		}};
