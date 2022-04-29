var rank = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var file = ['1', '2', '3', '4', '5', '6', '7', '8'];
var board = [];

rnkMap = {
  'A': 0,
  'B': 0,
  'C': 0,
  'D': 1,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7
}

for (var i = 0; i < rank.length; i++) {
  for (var j = 0; j < file.length; j++) {
    board.push([rnkMap[i], file[i]]);
  }
}

var tileId = []

for (var i = 0; i < rank.length; i++) {
  for (var j = 0; j < file.length; j++) {
    tileId.push(rank[j] + file[7-i])
  }
}
console.log(tileId)

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
  constructor(tile) {
    this.name = ''
    this.moves = []
    this.limit = true
    this.pos = tile
    this.image = ""
    
    this.draw(tile)
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

  draw(id) {
  /*https://www.pngegg.com/en/png-eymwn*/ 
    $('#' + id).append("<div id = '" + this.name + '_' + id + "' class = 'piece'>" + this.image + "</div>")
  }
}


class Pawn extends Piece {
  constructor(tile) {
    super(tile);
    this.name = 'p'
    this.moves = ['up']
    this.limit = true
  }
}

class Bishop extends Piece {
  constructor(tile) {
    super(tile);
    this.name = 'b'
    this.moves = ['diag']
    this.limit = false
  }
}

class Knight extends Piece {
  constructor(tile) {
    super(tile);
    this.name = 'k'
    this.moves = ['corners']
    this.limit = true;
  }
}

class Rook extends Piece {
  constructor(tile) {
    super(tile);
    this.name = 'R'
    this.moves = ['up-down', 'left-right']
    this.limit = false
  }
}

class King extends Piece {
  constructor(tile) {
    super(tile);
    this.name = 'K'
    this.moves = ['up-down', 'left-right', 'diag']
    this.limit = true
  }
}

class Queen extends Piece {
  constructor(tile) {
    super(tile);
    this.name = 'Q'
    this.moves = ['up-down', 'left-right', 'diag']
    this.limit = false
  	this.image = "<img src='https://www.pinclipart.com/picdir/middle/526-5269941_drawing-chess-queen-transparent-png-clipart-free-download.png'></img>"
  }
}

$('.tile').hover(function() {
  console.log($(this).attr('id'));
  console.log($(this).find('.piece').attr('id'));
})

$('.piece').hover(function() {
	console.log($('.tile > div:eq(1)').attr('id'))
  //highlightMoves();
})

var p = new Pawn('A2')
var K = new Queen('B2')

p.draw('A2')
K.draw('B2')

