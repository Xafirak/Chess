import { Colors } from "./Colors"
import { Figure, FigureNames } from "./figures/Figures";
import { Board } from './Board';
import { King } from "./figures/King";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";

export class Cell {
   readonly x: number;
   readonly y: number;
   readonly color: Colors;
   figure: Figure | null;
   board: Board;
   available: boolean; //можно ли переместиться
   id: number // для реакт ключей

   constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.figure = figure;
      this.board = board;
      this.available = false;
      this.id = Math.random()
   }

   isEmpty(): boolean {
      //если фигура на клетке - "король", то фигура как бы может сходить за клетку за ним
      // сделано, для того, чтобы проверка cellIsUnderAttack работала для клеток за королем
      //Бага -  фигуры могут перепрыгнуть через своего короля, и пробивать клетки за своим 
      // королем
      // if (this.figure?.name === FigureNames.KING)
      //    return true
      return this.figure === null
   }

   isEnemy(target: Cell): boolean {
      if (target.figure) {
         return this.figure?.color !== target.figure.color
      }
      return false
   }

   isEmptyVertical(target: Cell): boolean {
      if (this.x !== target.x) {
         return false
      }

      const min = Math.min(this.y, target.y)
      const max = Math.max(this.y, target.y)
      for (let y = min + 1; y < max; y++) {
         if (!this.board.getCell(this.x, y).isEmpty()) {
            return false
         }
      }
      return true
   }
   // нигде не используется
   isCheck(target: Cell) {
      if (target.figure?.name === FigureNames.KING) {
      }
   }

   isEmptyHorizontal(target: Cell): boolean {
      if (this.y !== target.y) {
         return false
      }

      const min = Math.min(this.x, target.x)
      const max = Math.max(this.x, target.x)
      for (let x = min + 1; x < max; x++) {
         if (!this.board.getCell(x, this.y).isEmpty()) {
            return false
         }
      }
      return true
   }
   isEmptyDiagonal(target: Cell): boolean {
      const absX = Math.abs(target.x - this.x)
      const absY = Math.abs(target.y - this.y)
      if (absY !== absX)
         return false

      const dy = this.y < target.y ? 1 : -1
      const dx = this.x < target.x ? 1 : -1

      for (let i = 1; i < absY; i++) {
         if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty())
            return false
      }
      return true
   }

   setFigure(figure: Figure) {
      this.figure = figure
      this.figure.cell = this
   }

   addLostFigure(figure: Figure) {

      figure.color === Colors.BLACK
         ? this.board.lostBlackFigures.push(figure)
         : this.board.lostWhiteFigures.push(figure)
   }
   // создаю логику удаления фигуры из массива оставшихся фигур, это для 
   // создания логики невозможности короля сходить на пробиваемую клетку
   removeFigure(figure: Figure) {
      figure.color === Colors.BLACK
         ? this.board.blackFiguesLeft
            .splice(this.board.blackFiguesLeft.indexOf(figure), 1)
         : this.board.whiteFiguesLeft
            .splice(this.board.whiteFiguesLeft.indexOf(figure), 1)
   }

   moveFigure(target: Cell) {
      if (this.figure && this.figure?.canMove(target)) {
         this.figure.moveFigure(target)
         if (target.figure) {
            this.addLostFigure(target.figure)
            this.removeFigure(target.figure)
         }
         target.setFigure(this.figure)
         this.figure = null
      }
   }

   // проверка - если клетка под атакой вражеской фигуры
   // Бага - если 2 короля стоят напротив друг друга, то выбор любого из них приводит 
   // к max callstack exceed
   cellIsUnderAttack(figure: Figure | null): boolean {
      if (figure?.color === Colors.BLACK) {
         return this.board.whiteFiguesLeft.some(fig =>
            fig.canMove(this)) ?
            true : false
      } else {
         return this.board.blackFiguesLeft.some(fig =>
            fig.canMove(this)) ?
            true : false
      }
   }

   // ход по вертикали
   moveVerticallyKing(target: Cell) {
      if ((target.y === this.y + 1 || target.y === this.y - 1)
         && target.x === this.x
         && !this.board.getCell(target.x, target.y).cellIsUnderAttack(this.figure)
      )
         return true
   }

   // ход по горизонтали
   moveHorizontallyKing(target: Cell) {
      if ((target.x === this.x + 1 || target.x === this.x - 1)
         && target.y === this.y
         && !this.board.getCell(target.x, target.y).cellIsUnderAttack(this.figure)
      ) return true
   }

   // ход по диагонали
   moveDiagonallyKing(target: Cell) {
      if ((target.y === this.y + 1 || target.y === this.y - 1)
         && (target.x === this.x + 1 || target.x === this.x - 1)
         && !this.board.getCell(target.x, target.y).cellIsUnderAttack(this.figure)
      ) return true
   }

   // Рокировка
   isCastlingAvaliable(target: Cell) {

      let rightRook;
      let leftRook;

      // проверка, сходила ли ладья перед рокировкой, добавил новое
      // свойство firstStep в Figures
      (this.board.getCell(this.x + 3, this.y).figure?.firstStep === true) ?
         rightRook = true : rightRook = false;

      (this.board.getCell(this.x - 4, this.y).figure?.firstStep === true) ?
         leftRook = true : leftRook = false;


      // Проверка, пустые ли клетки до ладьи и есть ли сама ладья            
      if ((
         target.x === this.x + 2
         && this.board.getCell(target.x - 1, target.y).isEmpty()
         && this.board.getCell(target.x + 1, target.y).figure?.name === FigureNames.ROOK
         && rightRook
         ||
         target.x === this.x - 2
         && this.board.getCell(target.x + 1, target.y).isEmpty()
         && this.board.getCell(target.x - 1, target.y).isEmpty()
         && this.board.getCell(target.x - 2, target.y).figure?.name === FigureNames.ROOK
         && leftRook
      )
         && target.y === this.y
         && this.board.getCell(target.x, target.y).isEmpty()
      ) return true

      return false
   }

   Castling() {

      if (this.board.getCell(this.x + 1, this.y).figure?.name === FigureNames.ROOK) {
         this.board.getCell(this.x + 1, this.y).figure!.cell = this.board.getCell(this.x - 1, this.y)
         this.board.getCell(this.x - 1, this.y).setFigure(this.board.getCell(this.x + 1, this.y).figure!)
         this.board.getCell(this.x + 1, this.y).figure = null
      } else if (this.board.getCell(this.x - 2, this.y).figure?.name === FigureNames.ROOK) {
         this.board.getCell(this.x - 2, this.y).figure!.cell = this.board.getCell(this.x + 1, this.y)
         this.board.getCell(this.x + 1, this.y).setFigure(this.board.getCell(this.x - 2, this.y).figure!)
         this.board.getCell(this.x - 2, this.y).figure = null
      }
   }

}
