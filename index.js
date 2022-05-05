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

// key by value
function KBV(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

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

function posToTile(pos) {
  return KBV(rankMap,pos[0])+pos[1]
}

class Chessboard {
  constructor() {
    this.board = {};
    this.tileId = [];
    this.dots = [];
    this.captureSet = []
    
    this.generateTileIDs();

    this.freeSpaces = this.tileId;

    this.init();
    console.log(this.freeSpaces);
  }

  //                         TILE IDs
  generateTileIDs() {
    for (var i = 0; i < rank.length; i++) {
      for (var j = 0; j < file.length; j++) {
        this.tileId.push(rank[j] + file[7 - i]);
      }
    }
  }

  //                      MOVE PIECE
  moveReady(pc) {
    $("#" + pc.pos).css("color", "red");
    pc.moveset(this) 
    pc.captureSet(this)
  }

  move(pc, tile) {
    // remove newly occupied tile from freespaces
    remove(this.freeSpaces, tile);
    // add previous tile to freespaces
    this.freeSpaces.push(pc.pos);
    delete this.board[pc.name + "_" + pc.pos];
    $("#" + pc.pos).empty();

    var newpiece = pc.name + "_" + tile;

    this.board[newpiece] = getPiece(pc.name, tile, pc.color);

    // eliminate pawn starting conditions
    if (this.board[newpiece].name === "p") {
      this.board[newpiece].start = false;
    }
    console.log("newpiece: " + this.board[newpiece].id);
    this.clearCaptureSet()
  }

  //                    ADD TILE SQUARES
  addTile(id, i) {
    var color;
    if (((id.charAt(1) - i) % 8) % 2 === 0) {
      color = "white";
    } else {
      color = "black";
    }
    var tile = "<div class='tile' id='" + id + "'> </div>";
    $(".grid-container").append(tile);
    $("#" + id).css("background-color", color);
    if (color === "black") {
      $("#" + id).css("color", "white");
    }
  }

  deleteDots() {
    for (var i = 0; i < this.dots.length; i++) {
      var dot = this.dots[i];
      $("#" + dot).empty();
    }
    this.dots = [];
  }

  clearCaptureSet() {
    for (var i = 0; i < this.captureSet.length; i++) {
      let tile = this.captureSet[i].pos
      $('#'+tile).css('color',getColor(tile));
    }
    this.captureSet = [];
  }
  //                      INITIALIZE
  init() {
    for (var i = 0; i < this.tileId.length; i++) {
      this.addTile(this.tileId[i], i);
    }

    //              PAWNS
    for (var i = 0; i < rank.length; i++) {
      let id_white = rank[i] + "2";
      let id_black = rank[i] + "7";
      remove(this.freeSpaces, id_white);
      remove(this.freeSpaces, id_black);
      this.board["p_" + id_white] = new Pawn(id_white, "white");
      this.board["p_" + id_black] = new Pawn(id_black, "black");
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
  constructor(tile, name, color) {
    this.name = name;
    this.id = this.name + tile;
    this.pos = tile;
    this.char = "";
    this.color = color;
  }

  draw() {
    $("#" + this.pos).append(
      "<div id = '" +
        this.name +
        "_" +
        this.pos +
        "' class = 'piece'>" +
        this.char +
        "</div>"
    );
  }
  
  moveset(B) {
  }
}

class Pawn extends Piece {
  constructor(tile, color) {
    super(tile, "p", color);
    this.name = "p";
    this.start = true;

    if (color === "white") {
      this.char = "&#9817;";
    } else if (color === "black") {
      this.char = "&#9823;";
    }
    this.draw();
  }
  
  
  moveset(B) {
    console.log("pawn moving...");
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
    var posR = [rankMap[this.pos[0]]+1,Number(this.pos[1])+1]
    var posL = [rankMap[this.pos[0]]-1,Number(this.pos[1])+1]
    console.log('posR: '+posR +' '+posToTile(posR))
    console.log('posL: '+posL+ ' '+posToTile(posL))
    
    if ($('#'+posToTile(posR)).find('.piece')[0]) {
      console.log('piece found R: ' + ($('#'+posToTile(posR)).find('.piece').attr('id')))
      
      let pieceR = B.board[$('#'+posToTile(posR)).find('.piece').attr('id')]
      console.log('pieceR: '+pieceR.id)
      if (pieceR.color !== this.color) {
        $('#'+posToTile(posR)).css('color','red')
        B.captureSet.push(pieceR);
      }
    }
    
    if ($('#'+posToTile(posL)).find('.piece')[0]) {
      console.log('piece found L')
      let pieceL = B.board[$('#'+posToTile(posL)).find('.piece').attr('id')]
      if (pieceL.color !== this.color) {
        $('#'+posToTile(posL)).css('color','red')
        B.captureSet.push(pieceL);
      }
    }
  
  }
  
  
 }


class Bishop extends Piece {
  constructor(tile, color) {
    super(tile, "b", color);
    this.name = "b";
    if (color === "white") {
      this.char = "&#9815;";
    } else if (color === "black") {
      this.char = "&#9821;";
    }
    this.draw();
  }
  
  moveset(B) {
    var currpos = [rankMap[this.pos[0]], this.pos[1]]
    let poss = []
    let boundariesFound = 0
    let pos = currpos
    
    // calculate free up to 4 boundaries (either a piece or end of board)
    while (boundariesFound !== 1) {
      pos[0]++;
      pos[1]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
        }
      }
      else {
        boundariesFound++;
      }
    }
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 2) {
      pos[0]--;
      pos[1]++; 
      console.log(this.pos+' '+pos)
      console.log(posToTile(pos))
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 3) {
      pos[0]++;
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 4) {
      pos[0]--;
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    
    for (var i = 0; i < poss.length; i++) {
      $("#" + poss[i]).append(dot);
        B.dots.push(poss[i]);
    }
  }
}

class Knight extends Piece {
  constructor(tile, color) {
    super(tile, "k", color);
    this.name = "k";
    if (color === "white") {
      this.char = "&#9816;";
    }
    if (color === "black") {
      this.char = "&#9822;";
    }
    this.draw();
  }
  
  moveset(B) {
    
      console.log("knight moving...");
      var poss = [];
      var currpos = [rankMap[this.pos[0]],this.pos[1]];      
      // up 2 right 1
      if (KBV(rankMap, currpos[0] + 1)) {
        var space = KBV(rankMap, currpos[0] + 1) + (Number(currpos[1]) + 2);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // up 2 left 1
      if (KBV(rankMap, currpos[0] - 1)) {
        var space = KBV(rankMap, currpos[0] - 1) + (Number(currpos[1]) + 2);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // up 1 right 2
      if (KBV(rankMap, currpos[0] + 2)) {
        var space = KBV(rankMap, currpos[0] + 2) + (Number(currpos[1]) + 1);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // up 1 left 2
      if (KBV(rankMap, currpos[0] - 2)) {
        var space = KBV(rankMap, currpos[0] - 2) + (Number(currpos[1]) + 1);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // down 1 left 2
      if (KBV(rankMap, currpos[0] - 2)) {
        var space = KBV(rankMap, currpos[0] - 2) + Number(currpos[1] - 1);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // down 2 left 1
      if (KBV(rankMap, currpos[0] - 1)) {
        var space = KBV(rankMap, currpos[0] - 1) + Number(currpos[1] - 2);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // down 1 right 2
      if (KBV(rankMap, currpos[0] + 2)) {
        var space = KBV(rankMap, currpos[0] + 2) + Number(currpos[1] - 1);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // down 2 right 1
      if (KBV(rankMap, currpos[0] + 1)) {
        var space = KBV(rankMap, currpos[0] + 1) + Number(currpos[1] - 2);
        if (B.freeSpaces.includes(space)) {
          poss.push(space);
        }
      }
      // add dots
      for (var i = 0; i < poss.length; i++) {
        $("#" + poss[i]).append(dot);
        B.dots.push(poss[i]);
      }
    
  }
}

class Rook extends Piece {
  constructor(tile, color) {
    super(tile, "R", color);
    this.name = "R";
    if (color === "white") {
      this.char = "&#9814;";
    } else if (color === "black") {
      this.char = "&#9820;";
    }
    this.draw();
  }
  
  moveset(B) {
    var currpos = [rankMap[this.pos[0]], this.pos[1]]
    let poss = []
    let boundariesFound = 0
    let pos = currpos
pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 5) {
      pos[0]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 6) {
      pos[0]--;
       
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 7) {
      pos[1]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 8) {
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
        
    for (var i = 0; i < poss.length; i++) {
      $("#" + poss[i]).append(dot);
        B.dots.push(poss[i]);
    }
  }
}

class King extends Piece {
  constructor(tile, color) {
    super(tile, "K", color);
    this.name = "K";
    if (color === "white") {
      this.char = "&#9812;";
    } else if (color === "black") {
      this.char = "&#9818;";
    }
    this.draw();
  }
  
  moveset(B) {
    var currpos = [rankMap[this.pos[0]], this.pos[1]]
    let poss = []
    let boundariesFound = 0
    let pos = currpos
    
    // calculate free up to 4 boundaries (either a piece or end of board)
    while (boundariesFound !== 1) {
      pos[0]++;
      pos[1]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos));
          boundariesFound++;
          break;
        }
        else {
          break;
        }
      }
      else {
        boundariesFound++;
      }
    }
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 2) {
      pos[0]--;
      pos[1]++; 
      console.log(this.pos+' '+pos)
      console.log(posToTile(pos))
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
          boundariesFound++;
          break;
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 3) {
      pos[0]++;
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
          boundariesFound++;
          break;
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 4) {
      pos[0]--;
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
          boundariesFound++;
          break;
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 5) {
      pos[0]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
          boundariesFound++;
          break;
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 6) {
      pos[0]--;
       
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
          boundariesFound++;
          break;
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 7) {
      pos[1]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
          boundariesFound++;
          break;
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 8) {
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
          boundariesFound++;
          break;
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
        
    for (var i = 0; i < poss.length; i++) {
      $("#" + poss[i]).append(dot);
        B.dots.push(poss[i]);
    }
  }
}

class Queen extends Piece {
  constructor(tile, color) {
    super(tile, "Q", color);
    this.name = "Q";
    if (color === "white") {
      this.char = "&#9813;";
    } else if (color === "black") {
      this.char = "&#9819;";
    }
    this.draw();
  }
  
  moveset(B) {
    var currpos = [rankMap[this.pos[0]], this.pos[1]]
    let poss = []
    let boundariesFound = 0
    let pos = currpos
    
    // calculate free up to 4 boundaries (either a piece or end of board)
    while (boundariesFound !== 1) {
      pos[0]++;
      pos[1]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
        }
      }
      else {
        boundariesFound++;
      }
    }
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 2) {
      pos[0]--;
      pos[1]++; 
      console.log(this.pos+' '+pos)
      console.log(posToTile(pos))
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 3) {
      pos[0]++;
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 4) {
      pos[0]--;
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 5) {
      pos[0]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 6) {
      pos[0]--;
       
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 7) {
      pos[1]++; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
    
    pos = [rankMap[this.pos[0]], this.pos[1]];
    while (boundariesFound !== 8) {
      pos[1]--; 
      if (posToTile(pos)) {
        if(B.freeSpaces.includes(posToTile(pos))) {
          poss.push(posToTile(pos))
        }
        else {
          break;
          pos = [rankMap[this.pos[0]], this.pos[1]];
        }
      }
      else {
        boundariesFound++;
      }
    }
        
    for (var i = 0; i < poss.length; i++) {
      $("#" + poss[i]).append(dot);
        B.dots.push(poss[i]);
    }
  
  }
}

let B = new Chessboard();

//                            EVENT HANDLERS
//-----------------------------------------------------------------------------
var currPiece;
var lastPiece;

$(".tile").hover(function () {
  //console.log($(this).attr('id'));
  //console.log($(this).find('.piece').attr('id'));
  if ($(this).find(".piece")) {
  }
});

$(".piece").hover(function () {
  console.log("piece: " + $(this).find(".piece").attr("id"));
  //highlightMoves();
});

$(".tile").click(function () {
  // check if the clicked tile is empty
  var emptyTile;
  if (!$(this).find(".piece")[0]) {
    var emptyTile = true;
    console.log("empty");
    if (!B.dots.includes($(this).attr('id'))) {
      console.log('id: ' + $(this).attr('id'))
      B.deleteDots();
      B.clearCaptureSet();
      console.log(getColor($(this).attr('id')))
      $(this).find('.piece').css('color',getColor($(this).attr('id')))
    }
  } else {
    emptyTile = false;
  }

  // case: previous piece selected
  if (currPiece && !emptyTile) {
    lastPiece = currPiece;
    B.deleteDots();
    B.clearCaptureSet();
    let lastPieceId = lastPiece.name + "_" + lastPiece.pos;
    console.log("last piece: " + lastPieceId);
    console.log("curr piece: " + currPiece.id)
    let cl;
    if (
      ((rankMap[lastPiece.pos[0]] - Number(lastPiece.pos[1])) % 8) % 2 ===
      0
    ) {
      cl = "white";
    } else {
      cl = "black";
    }

    $("#" + lastPiece.pos).css("color", cl);
  }

  // if you've clicked a piece then an empty tile
  if (currPiece && emptyTile) {
    if (B.dots.includes(this.id)) {
      console.log("dot here");
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
      B.moveReady(currPiece);
    }
  }
});
