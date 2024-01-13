class Chessboard {
  constructor(chessboardElement, letters, initialChessboard, capturedPiecesElement, movesTable) {
    this.chessboardElement = chessboardElement;
    this.letters = letters;
    this.initialChessboard = initialChessboard;
    this.pieces = []; // Store references to all pieces
    this.draggedPiece = null; // Store the piece being dragged
    this.capturedPiecesElement = capturedPiecesElement; // Element for captured pieces
    this.movesTable = movesTable; // Element for moves table
    this.moves = []; // Array to store moves

    this.chessboardElement.classList.add("chessboard");
  }

  setupChessboard() {

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.classList.add("square");
        if ((row + col) % 2 !== 0) {
          square.classList.add("odd");
        }
        square.dataset.row = row;
        square.dataset.col = col;
        this.chessboardElement.appendChild(square);

        // Add letters and numbers on the sides
        if (row === 7) {
          const label = new Label(this.letters[col], "col");
          square.appendChild(label.element);
        }
        if (col === 0) {
          const label = new Label(8 - row, "row");
          square.appendChild(label.element);
        }

        // Add chess pieces with drag-and-drop
        const pieceType = this.initialChessboard[row][col];
        if (pieceType) {
          const piece = new Piece(pieceType);
          square.appendChild(piece.element);
          this.pieces.push(piece);

          piece.element.draggable = true;
          piece.element.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", "");
            this.draggedPiece = piece; // Store the reference to the dragged piece
          });
        }
      }
    }

    // Add event listener for dropping
    this.chessboardElement.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    // Add event listener for dropping
    this.chessboardElement.addEventListener("drop", (event) => {
      event.preventDefault();

      const targetSquare = event.target.closest(".square");
      if (targetSquare) {
        const newRow = parseInt(targetSquare.dataset.row);
        const newCol = parseInt(targetSquare.dataset.col);

        console.log(this.draggedPiece.color);

        if (!isNaN(newRow) && !isNaN(newCol) && this.isValidMove(this.draggedPiece, newRow, newCol)) {
          this.movePiece(this.draggedPiece, newRow, newCol);
        } else {
          console.log("Invalid move!");
        }
      }

      this.draggedPiece = null; // Reset the dragged piece reference
    });
  }

  isValidMove(piece, newRow, newCol) {
    // Check if it's in the board's boundaries
    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {
      console.log(`Move is invalid: Out of bounds`);
      return false;
    }

    // Get the current position of the piece
    const currentRow = parseInt(piece.element.parentElement.dataset.row);
    const currentCol = parseInt(piece.element.parentElement.dataset.col);

    let capturing = false;

    // Check if the target square is empty or contains a piece of the same color
    const targetSquare = this.chessboardElement.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
    const targetPiece = targetSquare ? targetSquare.querySelector('.piece') : null;

    // if (targetPiece) {
    //   console.log("Target square:", targetSquare);
    //   console.log("Target piece:", targetPiece);
    // }

    // console.log(`Target square: ${targetPiece ? targetPiece.outerHTML : 'Empty'}`);

    if (targetPiece) {
      // console.log("targetPiece:", targetPiece);
      // console.log(targetPiece.color); // Check the color of targetPiece
      // console.log(this.draggedPiece.color);
      if (targetPiece.color === piece.color) {
        console.log(`Move is invalid: Target square has a piece of the same color`);
        return false;
      }
      capturing = true;
    }

    // Check if the path is clear (no jumping over pieces, except for knights)
    if (!this.isPathClear(piece, currentRow, currentCol, newRow, newCol)) {
      console.log(`Move is invalid: Path is not clear`);
      return false;
    }

    console.log(`Move is valid`);

    return piece.isValidMove(currentRow, currentCol, newRow, newCol, capturing);
  }

  isPathClear(piece, currentRow, currentCol, newRow, newCol) {
    // Knights can jump over other pieces
    if (piece.type === 'w-knight' || piece.type === 'b-knight') {
      return true;
    }

    const rowDirection = Math.sign(newRow - currentRow);
    const colDirection = Math.sign(newCol - currentCol);

    let row = currentRow + rowDirection;
    let col = currentCol + colDirection;

    console.log(`Checking path from (${currentRow}, ${currentCol}) to (${newRow}, ${newCol})`);

    while (row !== newRow || col !== newCol) {
      console.log(`Checking square (${row}, ${col})`);
      const square = this.chessboardElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
      if (square && square.querySelector('.piece')) {
        // There is a piece in the way
        console.log(`Piece found at (${row}, ${col})`);
        return false;
      }
      row += rowDirection;
      col += colDirection;
    }

    // The path is clear
    console.log(`Path is clear`);
    return true;
  }

  movePiece(piece, newRow, newCol) {
    const targetSquare = this.chessboardElement.querySelector(
      `[data-row='${newRow}'][data-col='${newCol}']`
    );
  
    // Capture logic
    const targetPiece = targetSquare.querySelector('.piece');
    console.log(`Target Piece: ${targetPiece ? targetPiece.type : 'None'}`);
  
    if (targetPiece) {
      const isCaptureAllowed = this.isValidMove(piece, newRow, newCol, true);
      console.log(`Is Capture Allowed: ${isCaptureAllowed}`);
      if (isCaptureAllowed) {
        // Move the captured piece to the captured pieces area
        this.capturedPiecesElement.appendChild(targetPiece.cloneNode(true));
        targetPiece.remove(); // Remove the captured piece from the board
      } else {
        console.log(`Capture not allowed!`);
        return; // Exit the function if capture is not allowed
      }
    }
  
    targetSquare.appendChild(piece.element);
    piece.movePiece(newRow, newCol);
  
    // Update the initialChessboard array after the move
    this.updateInitialChessboard();
  
    // Record the move
    const move = {
      piece: this.getPieceDenotation(piece.type),
      to: `${this.letters[newCol]}${8 - newRow}`, // e.g., 'e5'
    };
  
    this.moves.push(move);
    this.updateMovesTable(move); // Pass the move information to the updateMovesTable method
  }

    getPieceDenotation(pieceType) {
      switch (pieceType) {
        case 'b-pawn':
        case 'w-pawn':
          return '';
  
        case 'w-knight':
        case 'b-knight':
          return 'N';
  
        case 'w-bishop':
        case 'b-bishop':
          return 'B';
  
        case 'w-queen':
        case 'b-queen':
          return 'Q';
  
        case 'w-king':
        case 'b-king':
          return 'K';
  
        case 'w-rook':
        case 'b-rook':
          return 'R';
  
        default:
          console.error(`Unknown piece type: ${pieceType}`);
          return '';
      }
    }

  updateInitialChessboard() {
    // Reset the initialChessboard array
    this.initialChessboard = Array.from({ length: 8 }, () => Array(8).fill(null));

    // Update the array with the current pieces
    this.pieces.forEach(piece => {
      const row = parseInt(piece.element.dataset.row);
      const col = parseInt(piece.element.dataset.col);

      if (!isNaN(row) && !isNaN(col)) { // Check if row and col are valid numbers
        this.initialChessboard[row][col] = piece.type;
      }
    });
  }

  updateMovesTable(move) {
    // Select the appropriate table based on the move color
    const movesTable = document.getElementById("chess-moves");
  
    // Create a new row for each move and append it to the table
    const row = movesTable.insertRow();
    const moveNumberCell = row.insertCell(0);
    const moveDetailsCell = row.insertCell(1);
  
    moveNumberCell.textContent = Math.ceil(this.moves.length / 2); // Move number for both white and black
    moveDetailsCell.textContent = move.piece + " " + move.to; // Move details
  }
}