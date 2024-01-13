document.addEventListener("DOMContentLoaded", function () {
  const chessboardElement = document.getElementById("chessboard");
  const capturedPiecesElement = document.getElementById("captured-pieces");
  const movesTable = document.getElementById("moves-table");

  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const initialChessboard = [
    ['b-rook', 'b-knight', 'b-bishop', 'b-queen', 'b-king', 'b-bishop', 'b-knight', 'b-rook'],
    ['b-pawn', 'b-pawn', 'b-pawn', 'b-pawn', 'b-pawn', 'b-pawn', 'b-pawn', 'b-pawn'],
    [null, null, null, null, null, null, null, null], // Empty row
    [null, null, null, null, null, null, null, null], // Empty row
    [null, null, null, null, null, null, null, null], // Empty row
    [null, null, null, null, null, null, null, null], // Empty row
    ['w-pawn', 'w-pawn', 'w-pawn', 'w-pawn', 'w-pawn', 'w-pawn', 'w-pawn', 'w-pawn'],
    ['w-rook', 'w-knight', 'w-bishop', 'w-queen', 'w-king', 'w-bishop', 'w-knight', 'w-rook'],
  ];

  const chessboard = new Chessboard(chessboardElement, letters, initialChessboard, capturedPiecesElement, movesTable);
  
  chessboard.setupChessboard();
});
