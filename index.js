var rank = ["A", "B", "C", "D", "E", "F", "G", "H"];
var file = ["1", "2", "3", "4", "5", "6", "7", "8"];

const rankMap = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8 };
const dot =
  "<svg height='80' width='70'><circle cx='48' cy='50' r='9' fill='red'/></svg>";

// helper function: remove item from array by value
function remove(arr, e) {
  var index = arr.indexOf(e);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
// get text color for each tile
function getColor(tile) {
  let cl;
    if (
      ((rankMap[tile[0]] - Number(tile[1])) % 8) % 2 ===
      0
    ) {
      cl = "white";
    } else {
      cl = "black";
    }
  return cl;
}

// get object key by value
function KBV(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
// generate peice
function getPiece(type, tile, color) {
  if (type === "p") {
    return new Pawn(tile, color);
  }
  if (type === "k") {
    return new Knight(tile, color);
  }
  if (type === "b") {
    return new Bishop(tile, color);
  }
  if (type === "R") {
    return new Rook(tile, color);
  }
  if (type === "K") {
    return new King(tile, color);
  }
  if (type === "Q") {
    return new Queen(tile, color);
  }
}
// convert [x,y] to tile name (i.e. [2,3]->'B3')
function posToTile(pos) {
  return KBV(rankMap,pos[0])+pos[1]
}

//-----------------------------------------------------------
//                    CHESSBOARD CLASS
class Chessboard {
  constructor() {
    // keeps track of active pieces
    this.board = {};
    // lists all board tiles by name
    this.tileId = [];
    this.freeSpaces = [];
    // keeps track of spaces open for movement
    this.dots = [];
    // keeps track of pieces open for capture
    this.captureSet = []
    
    this.moves = []
    this.moveCount = 0
    
    for (var i = 0; i < rank.length; i++) {
      for (var j = 0; j < file.length; j++) {
        this.tileId.push(rank[j] + file[7 - i]);
      }
    }
        
    this.init();
    this.turn = 'white'
  }

  //                      MOVE PIECE
  moveReady(pc) {
    if (pc.color === this.turn) {
      
      $("#" + pc.pos).css("color", "red");
      // show tiles available for movement
      pc.moveset(this)
      // show pieces available for capture
      pc.captureSet(this)
      console.log(this.captureSet)
      if (this.captureSet.includes('K')) {       
      }
    }
  }

  move(pc, tile) {
    // remove newly occupied tile from freespaces
    remove(this.freeSpaces, tile);
    // add previous tile to freespaces
    this.freeSpaces.push(pc.pos);
    // delete original piece
    delete this.board[pc.type + "_" + pc.pos];
    $("#" + pc.pos).empty();
    // create new piece instance of the same type/color
    var newpiece = pc.type + "_" + tile;
    this.board[newpiece] = getPiece(pc.type, tile, pc.color);

    // edge case: pawn opening movement
    if (this.board[newpiece].type === "p") {
      this.board[newpiece].start = false;
    }
    
    var move = this.board[newpiece].id
    if (this.moveCount % 2 == 0 && this.movecount !== 0) {
      this.moves.push(move)
    }
    else {
      this.moves[this.moves.length-1] += ' ' + move
    }
    this.moveCount++;
    
    if (pc.color === 'white') {
      this.turn = 'black';
    }
    else {
      this.turn = 'white';
    }
    
    console.log('moves:' + this.moves )
  }
  
  //             CAPTURE PIECE
  capture(atkr,captive) {
    console.log(atkr.id + ' captures ' + captive.id + '!')
    
    $("#"+captive.pos).empty()
    $("#"+captive.pos).css('color','black')
    
    this.move(atkr,captive.pos)
    
    delete this.board[captive.id]
    this.deleteDots()
    this.clearCaptureSet();
  }

  //                   ADD TILES
  addTile(id, i) {
    var color;
    var colorMap = {'black':'rgb(71, 64, 77)','white':'rgb(235, 204, 52)'}
    if (((id.charAt(1) - i) % 8) % 2 === 0) {
      color = "white";
    } else {
      color = "black";
    }
    var tile = "<div class='tile' id='" + id + "'> </div>";
    $(".grid-container").append(tile);
    $("#" + id).css("background-color", colorMap[color]);
  }
  
  //              CLEAR MOVEMENT DOTS
  deleteDots() {
    for (var i = 0; i < this.dots.length; i++) {
      var dot = this.dots[i];
      $("#" + dot).empty();
    }
    this.dots = [];
  }
  //              CLEAR CAPTURABLE PIECES
  clearCaptureSet() {
    for (var i = 0; i < this.captureSet.length; i++) {
      let tile = this.captureSet[i].pos
      $('#'+tile).css('color','black');
    }
    this.captureSet = [];
  }

  //                INITIALIZE BOARD
  init() {
    this.freeSpaces = this.tileId;
    
    for (var i = 0; i < this.tileId.length; i++) {
      this.addTile(this.tileId[i], i);
    }

    //              PAWNS
    for (var i = 0; i < rank.length; i++) {
      let id_w = rank[i] + "2";
      let id_b = rank[i] + "7";
      remove(this.freeSpaces, id_w);
      remove(this.freeSpaces, id_b);
      this.board["p_" + id_w] = new Pawn(id_w, "white");
      this.board["p_" + id_b] = new Pawn(id_b, "black");
    }
    //             ROOKS
    this.board["R_A1"] = new Rook("A1", "white");
    remove(this.freeSpaces, "A1");
    this.board["R_H1"] = new Rook("H1", "white");
    remove(this.freeSpaces, "H1");
    this.board["R_A8"] = new Rook("A8", "black");
    remove(this.freeSpaces, "A8");
    this.board["R_H8"] = new Rook("H8", "black");
    remove(this.freeSpaces, "H8");

    //            KNIGHTS
    this.board["k_B1"] = new Knight("B1", "white");
    remove(this.freeSpaces, "B1");
    this.board["k_G1"] = new Knight("G1", "white");
    remove(this.freeSpaces, "G1");
    this.board["k_B8"] = new Knight("B8", "black");
    remove(this.freeSpaces, "B8");
    this.board["k_G8"] = new Knight("G8", "black");
    remove(this.freeSpaces, "G8");
    //           BISHOPS
    this.board["b_C1"] = new Bishop("C1", "white");
    remove(this.freeSpaces, "C1");
    this.board["b_F1"] = new Bishop("F1", "white");
    remove(this.freeSpaces, "F1");
    this.board["b_C8"] = new Bishop("C8", "black");
    remove(this.freeSpaces, "C8");
    this.board["b_F8"] = new Bishop("F8", "black");
    remove(this.freeSpaces, "F8");

    //           QUEENS
    this.board["Q_D1"] = new Queen("D1", "white");
    remove(this.freeSpaces, "D1");
    this.board["Q_E8"] = new Queen("E8", "black");
    remove(this.freeSpaces, "E8");

    //           KINGS
    this.board["K_E1"] = new King("E1", "white");
    remove(this.freeSpaces, "E1");
    this.board["K_D8"] = new King("D8", "black");
    remove(this.freeSpaces, "D8");
  }
}

//                           PIECE CLASSES
//-----------------------------------------------------------------------------

class Piece {
  constructor(tile, type, color) {
    this.type = type;
    this.id = this.type + tile;
    this.pos = tile;
    this.char = "";
    this.color = color;
  }
  draw() {
    $("#" + this.pos).append("<div id = '"+this.type+"_" +this.pos +
        "' class = 'piece'>"+this.char +"</div>")
  }
  moveset(B) {}
  captureSet(B) {}
}

class Pawn extends Piece {
  constructor(tile, color) {
    super(tile, "p", color);
    this.start = true;
    this.char = {'white':'&#9817;','black':'&#9823;'}[color]

    this.draw();
  }


  moveset(B) {
      if (this.color === "white") {
        var poss = this.pos[0] + (Number(this.pos[1]) + 1);
        var poss_start = poss[0] + (Number(poss[1]) + 1);
        console.log(poss);
      } else {
        var poss = this.pos[0] + (Number(this.pos[1]) - 1);
        var poss_start = poss[0] + (Number(poss[1]) - 1);
        console.log(poss);
      }
      if (B.freeSpaces.includes(poss)) {
        $("#" + poss).append(dot);
        B.dots.push(poss);
        if (this.start === true && B.freeSpaces.includes(poss_start)) {
          $("#" + poss_start).append(dot);
          B.dots.push(poss_start);
        }
      }
      this.ready = true;
    }
  
  captureSet(B) {
    let dir = 1;
    if (this.color === 'black') { dir = -1;}
    var posR = [rankMap[this.pos[0]]+dir,Number(this.pos[1])+dir]
    var posL = [rankMap[this.pos[0]]-dir,Number(this.pos[1])+dir]

    if ($('#'+posToTile(posR)).find('.piece')[0]) {
      let pieceR = B.board[$('#'+posToTile(posR)).find('.piece').attr('id')]
      if (pieceR.color !== this.color) {
        $('#'+posToTile(posR)).css('color','red')
        B.captureSet.push(pieceR);
      }
    }

    if ($('#'+posToTile(posL)).find('.piece')[0]) {
      let pieceL = B.board[$('#'+posToTile(posL)).find('.piece').attr('id')]
      if (pieceL.color !== this.color) {
        $('#'+posToTile(posL)).css('color','red')
        B.captureSet.push(pieceL);
      }
    }
  }
 }

 function generateMoveset(pc,B,indices,limited=false) {
    var pos = [rankMap[pc.pos[0]], Number(pc.pos[1])]
    let poss = []
    let boundariesFound = false

    for (var i = 0; i < indices.length; i++) {
        while (!boundariesFound) {
            pos[0] += indices[i][0];
            pos[1] += indices[i][1];
            console.log(i + ' : ' + pos)
            if (posToTile(pos)) {
                if(B.freeSpaces.includes(posToTile(pos))) {
                    poss.push(posToTile(pos))
                    if (limited == true) {
                      break;
                    }
                }
                else {
                    pc.boundaries.push(posToTile(pos))
                    break;
                }
            }
            else {
                boundariesFound = true;
            }
        }
        pos = [rankMap[pc.pos[0]], Number(pc.pos[1])];
        boundariesFound = false;
    }
    
    for (var i = 0; i < poss.length; i++) {
      $("#" + poss[i]).append(dot);
        B.dots.push(poss[i]);
    }
  }

function generateCaptureSet(pc,B) {
  console.log(pc.id + ' boundary pieces: ' + pc.boundaries)
  for (var i = 0; i < pc.boundaries.length; i++) {
    var tile = pc.boundaries[i]
      if ($('#'+tile).find('.piece')[0]) {
        var id = $('#'+tile).find('.piece').attr('id')
        let piece = B.board[id]
        console.log(pc.id)
        if (piece.color !== pc.color) {
          B.captureSet.push(piece)
          $("#"+piece.pos).css('color','red')
        }
      } 
   }
}

class Bishop extends Piece {
  constructor(tile, color) {
    super(tile, "b", color);    
    this.indices = [[1,1],[1,-1],[-1,-1],[-1,1]]
    this.boundaries = []
    this.char = {'white':'&#9815;','black':'&#9821;'}[color]
    
    this.draw();
  }
  moveset(B) {
    generateMoveset(this,B,this.indices);
  }
  captureSet(B) {
    generateCaptureSet(this,B);
  }
}

class Knight extends Piece {
  constructor(tile, color) {
    super(tile, "k", color);    
    this.boundaries = []
    this.indices = [[1,2],[2,1],[-1,-2],[-2,-1],[-1,2],[-2,1],[1,-2],[2,-1]]
    this.char = {'white':'&#9816;','black':'&#9822;'}[color]
    
    this.draw();
  }
  moveset(B) {
    generateMoveset(this,B,this.indices,true)
  }
  captureSet(B) {
    generateCaptureSet(this,B);
  }
}

class Rook extends Piece {
  constructor(tile, color) {
    super(tile, "R", color);
    this.boundaries = [];
    this.indices = [[1,0],[-1,0],[0,1],[0,-1]]
    this.char = {'white':'&#9814;','black':'&#9820;'}[color]
    
    this.draw();
  }
  moveset(B) {
    generateMoveset(this,B,this.indices)
  }
  captureSet(B) {
    generateCaptureSet(this,B);
  }
  
}

class King extends Piece {
  constructor(tile, color) {
    super(tile, "K", color);
    this.boundaries = []
    this.indices = [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[0,1],[-1,0],[0,-1]]
    this.char = {'white':'&#9812;','black':'&#9818;'}[color]
    
    this.draw();
  }
  moveset(B) {
    generateMoveset(this,B,this.indices,true)
  }
  captureSet(B) {
    generateCaptureSet(this,B);
  }
}

class Queen extends Piece {
  constructor(tile, color) {
    super(tile, "Q", color);
    this.name = "Q";
    this.boundaries = []
    this.indices = [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[0,1],[-1,0],[0,-1]]
    this.char = {'white':'&#9813;','black':'&#9819;'}[color]
    
    this.draw();
  }
  moveset(B) {
    generateMoveset(this,B,this.indices)
  }
  captureSet(B) {
    generateCaptureSet(this,B);
  }
}

let B = new Chessboard();

//                            EVENT HANDLERS
//-----------------------------------------------------------------------------
var currPiece;
var lastPiece;

$(".tile").hover(function () {
  console.log($(this).attr("id"));
});

$(".tile").click(function () {
  // check if the clicked tile is empty
  var emptyTile;
  var cap = false
  // check if you clicked on an empty tile
  if (!$(this).find(".piece")[0]) {
    var emptyTile = true;
    if(currPiece){
      $("#" + currPiece.pos).css("color", 'black');
    }
    if (!B.dots.includes($(this).attr('id'))) {
      B.deleteDots();
      B.clearCaptureSet();
      $("#" + currPiece.pos).css("color", 'black');
    }
  }
  else {
    emptyTile = false;
  }

  // case: previous piece selected
  if (currPiece && !emptyTile) {
    if ($(this).find('.piece')[0]) {
      let id = $(this).find('.piece').attr('id')
      let pc = B.board[id]
      if (B.captureSet.includes(pc)) {
        B.capture(currPiece,pc)
        cap = true;
        B.deleteDots();
        B.clearCaptureSet();
      }
    }
    B.deleteDots()
    lastPiece = currPiece;

    let lastPieceId = lastPiece.name + "_" + lastPiece.pos;
    console.log("last piece: " + lastPieceId);
    console.log("curr piece: " + currPiece.id)
    
    $("#" + lastPiece.pos).css("color", 'black');
  
  }

  // if you've clicked a piece then an empty tile
  if (currPiece && emptyTile) {
    if (B.dots.includes(this.id)) {
      console.log("piece then tile");
      B.deleteDots();
      B.move(currPiece, this.id);
    }
  }

  // select piece
  if (!emptyTile) {
    var pieceHTML = $(this).find(".piece");
    if (typeof pieceHTML !== undefined) {
      var id = pieceHTML.attr("id");
      console.log("Piece: " + id);

      currPiece = B.board[id];
      console.log(currPiece);
      if (cap !== true) {
        B.moveReady(currPiece);
      }
      else {
        cap = false;
      }
    }
  }
});
