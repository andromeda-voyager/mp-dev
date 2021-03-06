// import { ChessPiece } from './chess-piece';
// import { Color } from './color';
// import { ChessMove } from './chess-move.model';
// import { STARTING_CHESSBOARD } from './starting-chessboard';

// export class Chessboard {

//     readonly FIRST_ROW = 0;
//     readonly LAST_ROW = 7;
//     chessSquareHistory: Map<number, number> = new Map();
//     private removedPieces: ChessPiece[] = [];
//     private turn = Color.WHITE;
//     private chessboard: ChessPiece[] = [];
//     private blackKingLocation: number;
//     private whiteKingLocation: number;
//     private moves: ChessMove[] = [];

//     getBoardString() {
//         let boardStr: string = "";
//         for (const piece of this.chessboard) {
//             boardStr += piece;
//         }
//         return boardStr;
//     }
//     constructor(chessboard?: Chessboard) {

//         if (chessboard) {
//             this.chessSquareHistory = chessboard.chessSquareHistory;
//             this.removedPieces = chessboard.removedPieces;
//             this.turn = chessboard.turn;
//             this.chessboard = chessboard.chessboard;
//             this.blackKingLocation = chessboard.blackKingLocation;
//             this.whiteKingLocation = chessboard.whiteKingLocation;;
//             this.moves = chessboard.moves;
//         }
//         else {
//             this.chessboard = JSON.parse(JSON.stringify(STARTING_CHESSBOARD));

//             this.blackKingLocation = 4;
//             this.whiteKingLocation = 60;

//         }
//     }

//     // isPlayerVersusComputer() {
//     //     return this.whitePlayerID == "AI" || this.blackPlayerID == "AI";
//     // }
//     isValidLocation(index: number): boolean {
//         return index > -1 && index < 64;
//     }

//     getBoardArray() {
//         return this.chessboard;
//     }

//     applyMove(chessMove: ChessMove) {
//         this.movePiece(chessMove);
//     }

//     getLastMove() {
//         return this.moves[this.moves.length - 1];
//     }

//     getTurn() {
//         return this.turn;
//     }

//     isLegalMove(chessMove: ChessMove): boolean {
//         if (chessMove == null) return false;
//         let attackingPiece = this.chessPieceAt(chessMove.from);
//         return (this.getColorOf(attackingPiece) == this.turn &&
//             this.isValidMove(chessMove.from, chessMove.to) &&
//             !this.isInCheckAfterMove(chessMove));
//     }

//     isCheckmate(): boolean {
//         if (this.isInCheck(this.turn)) return (this.getAllMoves().length == 0);
//         else return false;
//     }

//     evaluate() {
//         let boardValue = 0;
//         for (const piece of this.chessboard) {
//             boardValue += this.valueOf(piece);
//         }
//         if (this.isCheckmate()) {
//             boardValue += -200;
//         }
//         return boardValue;
//     }


//     getOpponentColor(color: Color): Color {
//         return color == Color.WHITE ? Color.BLACK : Color.WHITE;
//     }

//     valueOf(piece: number): number {
//         return this.getColorOf(piece) == this.turn ? Math.abs(piece) : -(Math.abs(piece));
//     }

//     printTurn() {
//         console.log("Turn : " + this.turn);
//     }

//     isStalemate(): boolean {
//         if (this.isInCheck(this.turn)) return false;
//         else return (this.getAllMoves().length == 0);
//     }

//     updateLocation(chessPiece: ChessPiece, newLocation: number) {
//         if (chessPiece == ChessPiece.WHITE_KING) this.whiteKingLocation = newLocation;
//         else if (chessPiece == ChessPiece.BLACK_KING) this.blackKingLocation = newLocation;
//     }

//     movePiece(chessMove: ChessMove) {
//         let target = this.chessPieceAt(chessMove.to);
//         let attackingPiece = this.chessPieceAt(chessMove.from);

//         if (this.isCastleMove(chessMove)) { // castling if true  //target != ChessPiece.EMPTY && target.color == attackingPiece.color
//             this.applyCastleMove(chessMove);
//         } else {
//             this.updateLocation(attackingPiece, chessMove.to);
//             this.incrementSquareHistory(chessMove.to);
//             this.chessboard[chessMove.to] = attackingPiece;

//             this.removedPieces.push(target);
//             this.chessboard[chessMove.from] = ChessPiece.EMPTY;
//             if (chessMove.promotion != null) {
//                 this.chessboard[chessMove.to] = chessMove.promotion;
//             }
//         }
//         this.moves.push(chessMove);
//         this.changeTurn();
//     }

//     promotePawn(chessPiece: ChessPiece) {
//         let chessMove = this.getLastMove();
//         chessMove.promotion = chessPiece;
//         this.chessboard[chessMove.to] = chessMove.promotion;
//     }

//     applyCastleMove(chessMove: ChessMove) {
//         let rook = this.chessPieceAt(chessMove.to);
//         let king = this.chessPieceAt(chessMove.from);

//         this.chessboard[chessMove.from] = ChessPiece.EMPTY;
//         this.chessboard[chessMove.to] = ChessPiece.EMPTY;

//         let kingShift: number;
//         let rookShift: number;
//         if (chessMove.from % 8 < chessMove.to % 8) { //TODO test this change used to be .column
//             kingShift = 2;
//             rookShift = -2;
//         } else {
//             kingShift = -2;
//             rookShift = +3;
//         }

//         this.chessboard[chessMove.from + kingShift] = king;
//         this.chessboard[chessMove.to + rookShift] = rook;

//         this.updateLocation(king, chessMove.from + kingShift);
//         this.updateLocation(rook, chessMove.to + rookShift);
//         this.incrementSquareHistory(chessMove.from + kingShift);
//         this.incrementSquareHistory(chessMove.to + rookShift);
//     }


//     undoMove(chessMove: ChessMove) { // undo PROMOTIONS when implented TODO

//         let attacker = this.chessPieceAt(chessMove.to);
//         let target = this.chessPieceAt(chessMove.from);

//         if (target == ChessPiece.EMPTY) { // not a castle move if true
//             target = this.removedPieces.pop();
//         }
//         this.chessboard[chessMove.from] = attacker;
//         this.chessboard[chessMove.to] = target;


//         this.updateLocation(attacker, chessMove.from);
//         this.updateLocation(target, chessMove.to);
//         this.decrementSquareHistory(chessMove.to);

//         if (chessMove.promotion != null) this.undoPawnPromotion(chessMove);
//         this.moves.pop();

//         this.changeTurn();

//     }

//     incrementSquareHistory(boardLocation: number) {
//         this.chessSquareHistory.set(boardLocation, this.chessSquareHistory.get(boardLocation) + 1);
//     }

//     decrementSquareHistory(boardLocation: number) {
//         this.chessSquareHistory.set(boardLocation, this.chessSquareHistory.get(boardLocation) - 1);
//     }

//     getMovesForPieceAt(boardLocation: number): ChessMove[] {

//         switch (Math.abs(this.chessPieceAt(boardLocation))) {
//             case ChessPiece.PAWN: return this.getPawnMoves(boardLocation);
//             case ChessPiece.ROOK: return this.getRookMoves(boardLocation);
//             case ChessPiece.KNIGHT: return this.getKnightMoves(boardLocation);
//             case ChessPiece.BISHOP: return this.getBishopMoves(boardLocation);
//             case ChessPiece.QUEEN: return this.getQueenMoves(boardLocation);
//             case ChessPiece.KING: return this.getKingMoves(boardLocation);
//             default: return [];
//         }
//     }

//     getValidMovesForPieceAt(boardLocation: number): ChessMove[] {
//         if (this.isTurnOfPiece(this.chessPieceAt(boardLocation))) {
//             return this.removeIllegalMoves(this.getMovesForPieceAt(boardLocation));}
//         else return [];
//     }

//     changeTurn() {
//         this.turn = this.turn == Color.WHITE ? Color.BLACK : Color.WHITE;
//     }

//     getAllMoves(): ChessMove[] {
//         let moves: ChessMove[] = [];
//         this.chessboard.forEach((chessPiece, boardLocation) => {
//             if (this.isTurnOfPiece(chessPiece)) {
//                 moves = moves.concat(this.getMovesForPieceAt(boardLocation));
//             }
//         })

//         moves = this.removeIllegalMoves(moves);
//         return moves;
//     }

//     isTurnOfPiece(chessPiece: ChessPiece) {
//         return this.getColorOf(chessPiece) == this.turn;
//     }

//     removeIllegalMoves(moves: ChessMove[]) {
//         let legalMoves = [];
//         for (let move of moves) {
//             if (!this.isInCheckAfterMove(move)) {
//                 legalMoves.push(move);
//             }
//         }

//         return legalMoves;
//     }

//     getKingLocation(color: Color): number {
//         return Color.WHITE == color ? this.whiteKingLocation : this.blackKingLocation;
//     }


//     isInCheckAfterMove(chessMove: ChessMove): boolean {
//         let colorOfPlayer = this.turn;
//         this.movePiece(chessMove);
//         let isInCheck = this.isInCheck(colorOfPlayer);
//         this.undoMove(chessMove);
//         return isInCheck;

//     }

//     undoPawnPromotion(chessMove: ChessMove) {
//         if (this.chessPieceAt(chessMove.from) == ChessPiece.WHITE_PAWN) this.chessboard[chessMove.from] = ChessPiece.WHITE_PAWN;
//         else this.chessboard[chessMove.from] = ChessPiece.BLACK_PAWN;
//     }


//     isInLeftMostColumn(boardLocation: number): boolean {
//         return boardLocation % 8 == 0;
//     }

//     isInRightMostColumn(boardLocation: number): boolean {
//         return (boardLocation + 1) % 8 == 0;
//     }

//     isInFirstRow(boardLocation: number): boolean {
//         return boardLocation > -1 && boardLocation < 8;
//     }

//     isInLastRow(boardLocation: number): boolean {
//         return boardLocation > 55 && boardLocation < 64;
//     }

//     getColorOf(chessPiece: ChessPiece) {
//         switch (Math.sign(chessPiece)) {
//             case -1: return Color.BLACK;
//             case 1: return Color.WHITE;
//             case 0: return Color.EMPTY;
//             case 2: return Color.RANDOM;
//         }
//     }

//     getPawnMoves(from: number) {
//         let pawnColor = this.getColorOf(this.chessPieceAt(from));
//         let pawnMoves = [];
//         let direction = pawnColor == Color.WHITE ? -8 : 8;
//         let locationForwardOne = from + direction;
//         if (this.isValidLocation(locationForwardOne) && this.isEmptyAt(locationForwardOne)) {
//             pawnMoves.push(new ChessMove(from, locationForwardOne));
//         }

//         if (!this.isInLeftMostColumn(from)) {
//             direction = pawnColor == Color.WHITE ? -9 : 7;
//             let moveToLeftDiagonal = from + direction;
//             if (this.isValidLocation(moveToLeftDiagonal)) {
//                 if (this.isAttackingEnemy(from, moveToLeftDiagonal)) {
//                     pawnMoves.push(new ChessMove(from, moveToLeftDiagonal));
//                 }
//             }
//         }

//         if (!this.isInRightMostColumn(from)) {
//             direction = pawnColor == Color.WHITE ? -7 : 9;
//             let moveToRightDiagonal = from + direction;
//             if (this.isValidLocation(moveToRightDiagonal)) {
//                 if (this.isAttackingEnemy(from, moveToRightDiagonal)) {
//                     pawnMoves.push(new ChessMove(from, moveToRightDiagonal));
//                 }
//             }
//         }
//         if (this.isPawnStartingLocation(from)) {
//             direction = pawnColor == Color.WHITE ? -16 : 16;
//             let locationForwardTwo = from + direction;
//             if (this.isValidLocation(locationForwardTwo) && this.isEmptyAt(locationForwardTwo) && this.isEmptyAt(locationForwardOne)) { //TODO test removing location forwardone
//                 pawnMoves.push(new ChessMove(from, locationForwardTwo));
//             }
//         }
//         return this.removeIllegalMoves(pawnMoves);
//     }

//     getMovesInPath(startingLocation: number, rowDirection: number, columnDirection: number) {
//         let moves = [];
//         let row = Math.trunc(startingLocation / 8) + rowDirection;
//         let column = Math.trunc(startingLocation % 8) + columnDirection;
//         while (this.isValidRow(row) && this.isValidColumn(column)) {
//             let locationInPath = (row * 8 + column);
//             if (this.isAttackingEnemy(startingLocation, locationInPath)) {
//                 // add move to enemy location and return since enemy blocking path
//                 moves.push(new ChessMove(startingLocation, locationInPath));
//                 return moves;
//             } else if (this.isEmptyAt(locationInPath)) {
//                 moves.push(new ChessMove(startingLocation, locationInPath));
//             } else {
//                 return moves; // friendly piece blocking path 
//             }
//             row += rowDirection;
//             column += columnDirection;
//         }
//         return moves;
//     }

//     isMoveWithinSameRow(locationOne: number, locationTwo: number) {
//         return (Math.trunc(locationOne / 8) == Math.trunc(locationTwo / 8));
//     }

//     getRookMoves(from: number) {
//         let moves = [];
//         moves = moves.concat(this.getMovesInPath(from, 0, -1));   //left
//         moves = moves.concat(this.getMovesInPath(from, 0, 1));    //right
//         moves = moves.concat(this.getMovesInPath(from, -1, 0));   // up
//         moves = moves.concat(this.getMovesInPath(from, 1, 0));    // down

//         return this.removeIllegalMoves(moves);
//     }

//     isValidRow(row: number) {
//         return row > -1 && row < 8;
//     }

//     isValidColumn(column: number) {
//         return column > -1 && column < 8;
//     }

//     getKnightMoves(from: number) {
//         let moves = [];

//         if (this.isValidKnightMove(from, from + 17)) moves.push(new ChessMove(from, from + 17));
//         if (this.isValidKnightMove(from, from + 15)) moves.push(new ChessMove(from, from + 15));
//         if (this.isValidKnightMove(from, from - 17)) moves.push(new ChessMove(from, from - 17));
//         if (this.isValidKnightMove(from, from - 15)) moves.push(new ChessMove(from, from - 15));
//         if (this.isValidKnightMove(from, from + 6)) moves.push(new ChessMove(from, from + 6));
//         if (this.isValidKnightMove(from, from + 10)) moves.push(new ChessMove(from, from + 10));
//         if (this.isValidKnightMove(from, from - 6)) moves.push(new ChessMove(from, from - 6));
//         if (this.isValidKnightMove(from, from - 10)) moves.push(new ChessMove(from, from - 10));

//         return this.removeIllegalMoves(moves);
//     }

//     isAttackingEnemy(from: number, to: number): boolean {
//         return (!this.isEmptyAt(to) && Math.sign(this.chessPieceAt(from)) != Math.sign(this.chessPieceAt(to)));
//     }

//     isAttackingEnemyOrEmpty(from: number, to: number): boolean {
//         return (Math.sign(this.chessPieceAt(from)) != Math.sign(this.chessPieceAt(to)));
//     }

//     chessPieceAt(boardLocation: number): ChessPiece {
//         return this.chessboard[boardLocation];
//     }

//     getBishopMoves(from: number) {
//         let moves = [];
//         moves = moves.concat(this.getMovesInPath(from, 1, 1));
//         moves = moves.concat(this.getMovesInPath(from, -1, -1));
//         moves = moves.concat(this.getMovesInPath(from, 1, -1));
//         moves = moves.concat(this.getMovesInPath(from, -1, 1));
//         return this.removeIllegalMoves(moves);
//     }

//     getQueenMoves(from: number) {
//         let moves = [];
//         moves = moves.concat(this.getBishopMoves(from));
//         moves = moves.concat(this.getRookMoves(from));
//         return moves;
//     }

//     getKingMoves(from: number) {
//         let moves = [];
//         let potentialMoveLocations = [];
//         // positions around king (starting above and moving clockwise)
//         potentialMoveLocations.push(from - 8);
//         if (!this.isInRightMostColumn(from)) {
//             potentialMoveLocations.push(from - 7);
//             potentialMoveLocations.push(from + 1);
//             potentialMoveLocations.push(from + 9);
//         }
//         potentialMoveLocations.push(from + 8);
//         if (!this.isInLeftMostColumn(from)) {
//             potentialMoveLocations.push(from + 7);
//             potentialMoveLocations.push(from - 1);
//             potentialMoveLocations.push(from - 9);
//         }

//         for (let to of potentialMoveLocations) {
//             if (this.isValidLocation(to)) {
//                 if (this.isAttackingEnemy(from, to) || this.isEmptyAt(to)) {
//                     moves.push(new ChessMove(from, to));
//                 }
//             }
//         }
//         return this.removeIllegalMoves(moves);
//     }



//     isInCheck(color: Color): boolean {
//         let kingLocation = this.getKingLocation(color);
//         if (this.isEnemyKnightAroundKing(kingLocation)) return true;
//         if (this.isInCheckFrom(0, -1, kingLocation)) return true;
//         if (this.isInCheckFrom(0, 1, kingLocation)) return true;
//         if (this.isInCheckFrom(1, -1, kingLocation)) return true;
//         if (this.isInCheckFrom(1, 1, kingLocation)) return true;
//         if (this.isInCheckFrom(1, 0, kingLocation)) return true;
//         if (this.isInCheckFrom(-1, -1, kingLocation)) return true;
//         if (this.isInCheckFrom(-1, 1, kingLocation)) return true;
//         if (this.isInCheckFrom(-1, 0, kingLocation)) return true;
//         return false;
//     }

//     isInCheckFrom(rowDirection: number, columnDirection: number, kingLocation: number): boolean {
//         let row = Math.trunc(kingLocation / 8) + rowDirection;
//         let column = kingLocation % 8 + columnDirection;

//         while (this.isValidRow(row) && this.isValidColumn(column)) {
//             let locationInPath = (row * 8 + column);
//             if (this.isOccupiedAt(locationInPath)) {
//                 return this.isValidMove(locationInPath, kingLocation); //pathIsClear = true because path has already been determined to be clear;
//             }
//             row += rowDirection;
//             column += columnDirection;
//         }
//     }

//     needsPawnPromotion(chessMove: ChessMove): boolean {
//         return (chessMove.promotion == null && ((this.isWhitePawn(chessMove.to) && chessMove.to < 8) ||
//             (this.isBlackPawn(chessMove.to) && chessMove.to > 55)))
//     }

//     isWhitePawn(boardLocation: number): boolean {
//         return this.chessPieceAt(boardLocation) == ChessPiece.WHITE_PAWN;
//     }

//     isBlackPawn(boardLocation: number): boolean {
//         return this.chessPieceAt(boardLocation) == ChessPiece.BLACK_PAWN;
//     }

//     isOccupiedAt(boardLocation: number): boolean {
//         return this.chessboard[boardLocation] != ChessPiece.EMPTY;
//     }

//     isValidMove(from: number, to: number): boolean {

//         switch (Math.abs(this.chessPieceAt(from))) {
//             case ChessPiece.PAWN: return this.isValidPawnMove(from, to);
//             case ChessPiece.ROOK: return this.isValidRookMove(from, to);
//             case ChessPiece.KNIGHT: return this.isValidKnightMove(from, to);
//             case ChessPiece.BISHOP: return this.isValidBishopMove(from, to);
//             case ChessPiece.QUEEN: return this.isValidQueenMove(from, to);
//             case ChessPiece.KING: return this.isValidKingMove(from, to);
//             default: return false;
//         }
//     }

//     isValidRookMove(from: number, to: number): boolean {
//         return (this.isAttackingEnemyOrEmpty(from, to)
//             && this.isPathClear(from, to)
//             && (this.isMoveWithinSameColumn(from, to) || this.isMoveWithinSameRow(to, from)));
//     }

//     isMoveWithinSameDiagonal(from: number, to: number): boolean {
//         return Math.abs(Math.trunc(to / 8) - Math.trunc(from / 8)) == Math.abs(to % 8 - from % 8);
//     }


//     isValidBishopMove(from: number, to: number): boolean {
//         return (this.isAttackingEnemyOrEmpty(from, to)
//             && this.isPathClear(from, to)
//             && this.isMoveWithinSameDiagonal(from, to));
//     }

//     isValidKingMove(from: number, to: number): boolean {
//         return (this.isAttackingEnemyOrEmpty(from, to)
//             && this.isMoveOneSquareAway(from, to))
//             || this.isValidCastleMove(from, to);
//     }

//     isMoveOneSquareAway(from: number, to: number): boolean {
//         return Math.abs(Math.trunc(to / 8) - Math.trunc(from / 8)) < 2 && Math.abs(to % 8 - from % 8) < 2
//     }

//     hasPieceAtMoved(boardLocation: number): boolean {
//         return this.chessSquareHistory.get(boardLocation) > 0;
//     }
//     isValidCastleMove(from: number, to: number): boolean {
//         let king = this.chessPieceAt(from);
//         let rook = this.chessPieceAt(to);


//         if (Math.abs(rook) != ChessPiece.ROOK || !this.isPathClear(from, to) || Math.abs(king) != ChessPiece.KING || this.hasPieceAtMoved(from) || this.hasPieceAtMoved(to) || Math.sign(rook) != Math.sign(king)) return false;

//         let direction = to > from ? 1 : -1; // determine if king is castling to the right or left
//         let locationInPath = from;

//         if (this.isInCheck(this.getColorOf(king))) { // can't be in check when castling
//             return false;
//         }

//         while (locationInPath != to) { // king can't be in check along path to rook when castling (does not check final postion as that is checked before this is called)
//             locationInPath += direction;
//             let chessMove = new ChessMove(from, locationInPath);
//             if (this.isInCheckAfterMove(chessMove)) {
//                 return false;
//             }

//         }
//         return true;
//     }

//     isValidKnightMove(from: number, to: number): boolean {
//         let toRow = Math.trunc(to / 8);
//         let toColumn = to % 8;
//         let fromRow = Math.trunc(from / 8);
//         let fromColumn = from % 8;
//         if (this.isValidLocation(to)) {
//             return (this.isAttackingEnemyOrEmpty(from, to)
//                 && ((Math.abs(toRow - fromRow) == 2 && Math.abs(toColumn - fromColumn) == 1)
//                     || (Math.abs(toRow - fromRow) == 1 && Math.abs(toColumn - fromColumn) == 2)));
//         } else return false;
//     }

//     isValidQueenMove(from: number, to: number): boolean {
//         return this.isValidBishopMove(from, to) || this.isValidRookMove(from, to);
//     }

//     isValidPawnMove(from: number, to: number): boolean {
//         return this.isValidPawnDiagonalMove(from, to) || this.isValidPawnForwardMove(from, to);
//     }


//     isValidPawnDiagonalMove(from: number, to: number): boolean {

//         if (this.isAttackingEnemy(from, to)) {
//             if (this.isOneColumnAway(from, to)) {
//                 if (this.isWhitePieceAt(from)) {
//                     return ((from - 9 == to && !this.isInLeftMostColumn(from)) || (from - 7 == to && !this.isInRightMostColumn(from)));
//                 }
//                 else if (this.isBlackPieceAt(from)) {
//                     return ((from + 7 == to && !this.isInLeftMostColumn(from)) || (from + 9 == to && !this.isInRightMostColumn(from)));
//                 }
//             }
//         }
//         return false;
//     }

//     isPawnStartingLocation(boardLocation: number): boolean {
//         return (this.isBlackPieceAt(boardLocation) && Math.trunc(boardLocation / 8) == 1) || (this.isWhitePieceAt(boardLocation) && Math.trunc(boardLocation / 8) == 6);
//     }

//     isWhitePieceAt(boardLocation: number): boolean {
//         return this.getColorOf(this.chessPieceAt(boardLocation)) == Color.WHITE;
//     }

//     isBlackPieceAt(boardLocation: number): boolean {
//         return this.getColorOf(this.chessPieceAt(boardLocation)) == Color.BLACK;
//     }

//     isValidPawnForwardMove(from: number, to: number): boolean {

//         if (!this.isMoveWithinSameColumn(from, to) || !this.isEmptyAt(to)) return false;

//         let rowDifference = Math.trunc(from / 8) - Math.trunc(to / 8);
//         if (Math.abs(rowDifference) == 1) {
//             return (this.isBlackPieceAt(from) && rowDifference == -1) ||
//                 (this.isWhitePieceAt(from) && rowDifference == 1);
//         }

//         else if (Math.abs(rowDifference) == 2 && this.isPawnStartingLocation(from)) {
//             return (this.isPathClear(from, to) && (this.isBlackPieceAt(from) && rowDifference == -2) ||
//                 (this.isWhitePieceAt(from) && rowDifference == 2));
//         } else return false;

//     }

//     isMoveWithinSameColumn(from: number, to: number): boolean {
//         return from % 8 == to % 8;
//     }

//     isPathClear(from: number, to: number): boolean {

//         let row = Math.trunc(from / 8);
//         let column = from % 8;

//         let rowTo = Math.trunc(to / 8);
//         let columnTo = to % 8;

//         while (row != rowTo || column != columnTo) {
//             if (row != rowTo) {
//                 row = row < rowTo ? row + 1 : row - 1;
//             }
//             if (column != columnTo) {
//                 column = column < columnTo ? column + 1 : column - 1;
//             }
//             if (row == rowTo && column == columnTo) return true; // made it to moveTo location without finding a blocking piece 

//             if (this.chessboard[row * 8 + column] != ChessPiece.EMPTY) return false; // piece blocking path 
//         }
//         return true;
//     }

//     isEnemyKnightAroundKing(kingLocation: number): boolean {

//         return (this.isKnightAt(kingLocation + 17) && this.isValidKnightMove(kingLocation + 17, kingLocation))
//             || (this.isKnightAt(kingLocation + 15) && this.isValidKnightMove(kingLocation + 15, kingLocation))
//             || (this.isKnightAt(kingLocation - 17) && this.isValidKnightMove(kingLocation - 17, kingLocation))
//             || (this.isKnightAt(kingLocation - 15) && this.isValidKnightMove(kingLocation - 15, kingLocation))
//             || (this.isKnightAt(kingLocation + 6) && this.isValidKnightMove(kingLocation + 6, kingLocation))
//             || (this.isKnightAt(kingLocation + 10) && this.isValidKnightMove(kingLocation + 10, kingLocation))
//             || (this.isKnightAt(kingLocation - 6) && this.isValidKnightMove(kingLocation - 6, kingLocation))
//             || (this.isKnightAt(kingLocation - 10) && this.isValidKnightMove(kingLocation - 10, kingLocation));

//     }

//     isKnightAt(boardLocation: number): boolean {
//         let chessPiece = this.chessPieceAt(boardLocation);
//         return this.isValidLocation(boardLocation) && Math.abs(chessPiece) == ChessPiece.KNIGHT;
//     }

//     isValidRowAndColumn(row: number, column: number): boolean {
//         return row > -1 && row < 8 && column > -1 && column < 8;
//     }

//     isOneColumnAway(from: number, to: number): boolean {
//         return Math.abs(to % 8 - from % 8) == 1;
//     }
//     isEmptyAt(boardLocation: number): boolean {
//         return this.chessboard[boardLocation] == ChessPiece.EMPTY;
//     }

//     isCastleMove(chessMove: ChessMove): boolean {
//         return Math.sign(this.chessboard[chessMove.from]) == Math.sign(this.chessboard[chessMove.to]);
//     }

//     print() {
//         let row = "";
//         let column = 0;
//         for (const chessPiece of this.chessboard) {
//             row += chessPiece + " "
//             column++;
//             if (column == 8) {
//                 console.log(row);
//                 row = "";
//                 column = 0;
//             }
//         }
//     }
// }
