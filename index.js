var rank = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var file = ['1', '2', '3', '4', '5', '6', '7', '8'];

const rankMap = {'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8}
const dot = "<svg height='80' width='70'><circle cx='48' cy='50' r='11' fill='red'/></svg>";
function remove(arr,e) {
  var index = arr.indexOf(e);
  if (index > -1) {
    arr.splice(index,1);
  }
}

class Chessboard {
  constructor() {
    this.board = {};
    this.tileId = [];
    this.generateTileIDs();

    this.freeSpaces = this.tileId;

    this.init();
    console.log(this.freeSpaces)
  }

  //                         TILE IDs
  generateTileIDs() {
    for (var i = 0; i < rank.length; i++) {
      for (var j = 0; j < file.length; j++) {
        this.tileId.push(rank[j] + file[7-i])
      }
    }
  }

  //                      MOVE PIECE
  move(pc) {
    $('#'+pc.pos).css('color', 'red');

    //      PAWN
    if (pc.name === 'p') {
      if (pc.color === 'white') {
        var poss = pc.pos[0]+(Number(pc.pos[1])+1)
        var poss_start = poss[0]+(Number(poss[1])+1)
        console.log(poss);
      }
      else {
        var poss = pc.pos[0]+(Number(pc.pos[1])-1)
        var poss_start = poss[0]+(Number(poss[1])-1)
        console.log(poss);
      }
      if (this.freeSpaces.includes(poss)) {
        $('#'+poss).append(dot);
        if (pc.start === true && this.freeSpaces.includes(poss_start)) {
          $('#'+poss_start).append(dot);
        }
      }

    }

    //      KNIGHT
    if (pc.name === 'k') {

    }

  }

  //                    ADD TILE SQUARES
  addTile(id, i) {
    var color;
    if (((id.charAt(1) -i ) % 8) % 2 === 0) {
      color = 'white';
    } else {
      color = 'black';
    }
    var tile = "<div class='tile' id='" + id + "'> </div>";
    $('.grid-container').append(tile)
    $('#' + id).css('background-color', color);
    if (color === 'black') {
      $('#' + id).css('color', 'white');
    }
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
      remove(this.freeSpaces,id_white);
      remove(this.freeSpaces,id_black);
      this.board["p_"+id_white] = new Pawn(id_white,"white")
      this.board["p_"+id_black] = new Pawn(id_black,"black")
    }
    //             ROOKS
    this.board["R_A1"] = new Rook("A1","white")
    remove(this.freeSpaces,"A1");
    this.board["R_H1"] = new Rook("H1","white")
    remove(this.freeSpaces,"H1");
    this.board["R_A8"] = new Rook("A8","black")
    remove(this.freeSpaces,"A8");
    this.board["R_H8"] = new Rook("H8","black")
    remove(this.freeSpaces,"H8");

    //            KNIGHTS
    this.board["k_B1"] = new Knight("B1","white")
    remove(this.freeSpaces,"B1");
    this.board["k_G1"] = new Knight("G1","white")
    remove(this.freeSpaces,"G1");
    this.board["k_B8"] = new Knight("B8","black")
    remove(this.freeSpaces,"B8");
    this.board["k_G8"] = new Knight("G8","black")
    remove(this.freeSpaces,"G8");
    //           BISHOPS
    this.board["b_C1"] = new Bishop("C1","white")
    remove(this.freeSpaces,"C1");
    this.board["b_F1"] = new Bishop("F1","white")
    remove(this.freeSpaces,"F1");
    this.board["b_C8"] = new Bishop("C8","black")
    remove(this.freeSpaces,"C8");
    this.board["b_F8"] = new Bishop("F8","black")
    remove(this.freeSpaces,"F8");

    //           QUEENS
    this.board["Q_D1"] = new Queen("D1","white")
    remove(this.freeSpaces,"D1");
    this.board["Q_E8"] = new Queen("E8","black")
    remove(this.freeSpaces,"E8");

    //           KINGS
    this.board["K_w"] = new King("E1","white")
    remove(this.freeSpaces,"E1");
    this.board["K_b"] = new King("D8","black")
    remove(this.freeSpaces,"D8");
  }

}


//                           PIECE CLASSES
//-----------------------------------------------------------------------------

class Piece {
  constructor(tile,name,color) {
    this.name = name
    this.moves = []
    this.limit = true
    this.pos = tile
    this.char = ""
    this.color = color
  }

  draw() {
    $('#' + this.pos).append("<div id = '" + this.name + '_' + this.pos +
     "' class = 'piece'>" + this.char + "</div>")
  }
}


class Pawn extends Piece {
  constructor(tile,color) {
    super(tile,'p',color);
    this.name = 'p'
    this.start = true;

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
    super(tile,'b',color);
    this.name = 'b'
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
    super(tile,'k',color);
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
    super(tile,'R',color);
    this.name = 'R'
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
    super(tile,'K',color);
    this.name = 'K'
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
    super(tile,'Q',color);
    this.name = 'Q'
    if (color === "white") {
      this.char = "&#9813;"
    }
  	else if (color === "black") {
      this.char = "&#9819;"
    }
    this.draw();
  }
}

let B = new Chessboard();

//                            EVENT HANDLERS
//-----------------------------------------------------------------------------
$('.tile').hover(function() {
  console.log($(this).attr('id'));
  console.log($(this).find('.piece').attr('id'));
})

$('.piece').hover(function() {
	console.log("piece: " + $('.tile > div:eq(1)').attr('id'))
  //highlightMoves();
})

$('.tile').click(function() {
  var pieceHTML = $(this).find('.piece')
  if (typeof pieceHTML !== undefined) {
    var id = pieceHTML.attr('id')
    console.log("Piece: " + id)

    var piece = B.board[id]
    console.log(piece)
    B.move(piece);
  }
})
//-----------------------------------------------------------------------------

//                           INITIALIZER
//-----------------------------------------------------------------------------
