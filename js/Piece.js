class Piece {
  constructor(pieceType) {
    this.element = document.createElement("div");
    this.element.classList.add("piece");
    this.element.style.backgroundImage = `url('./chess-pieces/${pieceType}.png')`;
    this.element.id = pieceType;
    this.type = pieceType;
    this.color = pieceType.startsWith('w') ? 'white' : 'black'; // Identify piece color
    this.element.color = this.color;
  }

  isValidMove(currentRow, currentCol, newRow, newCol, capturing) {
    // Implement rules based on the type of piece
    const pieceType = this.element.style.backgroundImage.split("/").pop().replace(/["']/g, "").replace('.png)', '');

    switch (this.type) {
      case 'b-pawn':
        if(!capturing){
          if (currentRow === 1) {
            return newRow === currentRow + 1 || newRow === currentRow + 2;
          } else {
            return newRow === currentRow + 1;
          }
        }
        else {
          return (Math.abs(newCol - currentCol) === 1 && newRow === currentRow + 1);
        }

      case 'w-pawn':
        if(!capturing){
          if (currentRow === 6) {
            return newRow === currentRow - 1 || newRow === currentRow - 2;
          } else {
            return newRow === currentRow - 1;
          }
        }
        else {
          return (Math.abs(newCol - currentCol) === 1 && newRow === currentRow - 1);
        }

      case 'b-rook':
      case 'w-rook':
        return newCol === currentCol || newRow === currentRow;

      case 'w-knight':
      case 'b-knight':
        return (Math.abs(newRow - currentRow) === 2 && Math.abs(newCol - currentCol) === 1) ||
               (Math.abs(newRow - currentRow) === 1 && Math.abs(newCol - currentCol) === 2);

      case 'w-bishop':
      case 'b-bishop':
        return Math.abs(newRow - currentRow) === Math.abs(newCol - currentCol);

      case 'w-queen':
      case 'b-queen':
        return newCol === currentCol || newRow === currentRow || Math.abs(newRow - currentRow) === Math.abs(newCol - currentCol);

      case 'w-king':
      case 'b-king':
        return Math.abs(newRow - currentRow) <= 1 && Math.abs(newCol - currentCol) <= 1;

      default:
        console.error(`Unknown piece type: ${this.type}`);
        return false;
    }
  }

  movePiece(newRow, newCol) {
    // Implement the move logic if needed
    // For example, updating the position or any other relevant logic
    this.element.dataset.row = newRow;
    this.element.dataset.col = newCol;
  }
}