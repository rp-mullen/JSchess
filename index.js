var rank = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var file = ['1', '2', '3', '4', '5', '6', '7', '8'];

var board = {};

var tileId = []
for (var i = 0; i < rank.length; i++) {
  for (var j = 0; j < file.length; j++) {
    tileId.push(rank[j] + file[7-i])
  }
}

function addTile(id, i) {  
  var color;

	// get the 
  if (((id.charAt(1) -i ) % 8) % 2 === 0) {
    color = 'white';
  } else {
    color = 'black';
  }
	

  var tile = "<div class='tile' id='" + id + "'> </div>";
  $('.grid-container').append(tile)
  $('#' + id).css('background-color', color);
}

function getRank(i) {
  return tileId[i].charAt(0)
}

function setupPieces() {

}

function createBoard() {
  for (var i = 0; i < tileId.length; i++) {
    addTile(tileId[i], i);
  }

  setupPieces();
}


createBoard();

class Piece {
  constructor(tile,name) {
    this.name = name
    this.moves = []
    this.limit = true
    this.pos = tile
    this.char = ""
    
    this.draw()
  }

  capture(pc) {

  }

  move() {
    if (this.moves.includes('up')) {}
    if (this.moves.includes('up-down')) {}
    if (this.moves.includes('left-right')) {}
    if (this.moves.includes('diag')) {}
    if (this.moves.includes('corners')) {}
  }

  draw() {
    
  /*https://www.pngegg.com/en/png-eymwn*/ 
    $('#' + this.pos).append("<div id = '" + this.name + '_' + this.pos + "' class = 'piece'>" + this.char + "</div>")
  }
}


class Pawn extends Piece {
  constructor(tile,color) {
    super(tile,'p');
    this.name = 'p'
    this.moves = ['up']
    this.limit = true;
    if (color === 'white') {
      this.char = "&#9817;"
    }
    else if (color === "black") {
      this.char = "&#9823;"
    }
    this.draw();
  }
}

class Bishop extends Piece {
  constructor(tile,color) {
    super(tile,'b');
    this.name = 'b'
    this.moves = ['diag']
    this.limit = false
    if (color === 'white') {
      this.char = "&#9815;"
    }
    else if (color === 'black') {
      this.char = "&#9821;"
    }
    this.draw();
  }
}

class Knight extends Piece {
  constructor(tile,color) {
    super(tile,'k');
    this.name = 'k'
    this.moves = ['corners']
    this.limit = true;
    if (color === 'white') {
      this.char = "&#9816;"
    }
    if (color === 'black') {
      this.char = "&#9822;"
    }
    this.draw();
  }
}

class Rook extends Piece {
  constructor(tile,color) {
    super(tile,'R');
    this.name = 'R'
    this.moves = ['up-down', 'left-right']
    this.limit = false
    if (color === "white") {
      this.char = "&#9814;"
    }
    else if (color === "black") {
      this.char = "&#9820;"
    }
    this.draw();
  }
}

class King extends Piece {
  constructor(tile,color) {
    super(tile,'K');
    this.name = 'K'
    this.moves = ['up-down', 'left-right', 'diag']
    this.limit = true
    if (color === "white") {
      this.char = "&#9812;"
    }
    else if (color === "black") {
      this.char = "&#9818;"
    }
    this.draw();
  }
}

class Queen extends Piece {
  constructor(tile,color) {
    super(tile,'Q');
    this.name = 'Q'
    this.moves = ['up-down', 'left-right', 'diag']
    this.limit = false
    if (color === "white") {
      this.char = "&#9813;"
    }
  	else if (color === "black") {
      this.char = "&#9819;"
    }
    this.draw();
  }
}

$('.tile').hover(function() {
  console.log($(this).attr('id'));
  console.log($(this).find('.piece').attr('id'));
})

$('.piece').hover(function() {
	console.log("piece: " + $('.tile > div:eq(1)').attr('id'))
  //highlightMoves();
})

$('.tile').click(function() {
  var piece = $(this).find('.piece')
  if (typeof piece !== undefined) {
    var id = piece.attr('id')
    console.log("Piece: " + id)
  }
})

function init() {
  var letters = "ABCDEFGH"
  for (var i = 0; i < letters.length; i++) {
    let id_white = letters[i] + "2";
    let id_black = letters[i] + "7"
    board["p_"+id_white] = new Pawn(id_white,"white")
    board["p_"+id_black] = new Pawn(id_black,"black")
  }
  
  board["R_A1"] = new Rook("A1","white")
  board["R_H1"] = new Rook("H1","white")
  board["R_A8"] = new Rook("A8","black")
  board["R_H8"] = new Rook("H8","black")
  
  board["k_B1"] = new Knight("B1","white")
  board["k_G1"] = new Knight("G1","white")
  board["k_B8"] = new Knight("B8","black")
  board["k_G8"] = new Knight("G8","black")
  
  board["b_C1"] = new Bishop("C1","white")
  board["b_F1"] = new Bishop("F1","white")
  board["b_C8"] = new Bishop("C8","black")
  board["b_F8"] = new Bishop("F8","black")
  
  board["Q_D1"] = new Queen("D1","white")
  board["Q_E8"] = new Queen("E8","black")
  
  board["K_w"] = new King("E1","white")
  board["K_b"] = new King("D8","black")
}

init()
