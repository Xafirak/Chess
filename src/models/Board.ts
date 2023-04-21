import { Cell } from './Cell';
import { Colors } from './Colors';
import { Pawn } from './figures/Pawn';
import { Queen } from './figures/Queen';
import { Bishop } from './figures/Bishop';
import { King } from './figures/King';
import { Knight } from './figures/Knight';
import { Rook } from './figures/Rook';
import { Figure, FigureNames } from './figures/Figures';


export class Board {
    cells: Cell[][] = []
    lostBlackFigures: Figure[] = []
    lostWhiteFigures: Figure[] = []

    //создаю масивы существующих фигур, чтобы создать проверку,
    // может ли фигура сходить на поле, и если да, то король не может 
    // туда сходить
    whiteFiguesLeft: Figure[] = []
    blackFiguesLeft: Figure[] = []



    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = []

            for (let j = 0; j < 8; j++) {

                if ((i + j) % 2 !== 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null)) // black cells
                } else {
                    row.push(new Cell(this, j, i, Colors.WHITE, null)) // white cells
                }
            }
            this.cells.push(row)
        }
    }

    public getCopyBoard(): Board {
        const newBoard = new Board()
        newBoard.cells = this.cells
        newBoard.lostWhiteFigures = this.lostWhiteFigures
        newBoard.lostBlackFigures = this.lostBlackFigures
        newBoard.whiteFiguesLeft = this.whiteFiguesLeft
        newBoard.blackFiguesLeft = this.blackFiguesLeft
        return newBoard
    }

    public hightlightCells(selectedCell: Cell | null) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.available = !!selectedCell?.figure?.canMove(target)
            }
        }
    }
    //поиск любого короля на доске
    whereIsKing(color: Colors) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                if (target.figure?.name === FigureNames.KING && target.figure?.color === color)
                    return target.figure
            }
        }
    }



    public getCell(x: number, y: number) {
        return this.cells[y][x]
    }



    public addFigures() {
        // this.addPawns()
        // this.addBishops()
        // this.addKnights()
        this.addRooks()
        this.addQueens()
        this.addKings()
    }


    //создаю фигуры и пушу их все в соотв. цвету массивы 
    private addPawns() {

        for (let i = 0; i < 8; i++) {
            this.blackFiguesLeft.push(
                new Pawn(Colors.BLACK, this.getCell(i, 1))
            )
            this.whiteFiguesLeft.push(
                new Pawn(Colors.WHITE, this.getCell(i, 6))
            )
        }
    }

    private addKings() {

        // this.blackFiguesLeft.push(
            new King(Colors.BLACK, this.getCell(4, 0))
        // )

        // this.whiteFiguesLeft.push(
            new King(Colors.WHITE, this.getCell(4, 7))
        // )
    }

    private addQueens() {

        this.blackFiguesLeft.push(
            new Queen(Colors.BLACK, this.getCell(3, 0))
        )
        this.whiteFiguesLeft.push(
            new Queen(Colors.WHITE, this.getCell(3, 7))
        )
    }

    private addBishops() {

        this.blackFiguesLeft.push(
            new Bishop(Colors.BLACK, this.getCell(2, 0)),
            new Bishop(Colors.BLACK, this.getCell(5, 0))
        )

        this.whiteFiguesLeft.push(
            new Bishop(Colors.WHITE, this.getCell(2, 7)),
            new Bishop(Colors.WHITE, this.getCell(5, 7))
        )
    }

    private addKnights() {

        this.blackFiguesLeft.push(
            new Knight(Colors.BLACK, this.getCell(1, 0)),
            new Knight(Colors.BLACK, this.getCell(6, 0))
        )

        this.whiteFiguesLeft.push(
            new Knight(Colors.WHITE, this.getCell(1, 7)),
            new Knight(Colors.WHITE, this.getCell(6, 7))
        )
    }

    private addRooks() {

        this.blackFiguesLeft.push(
            new Rook(Colors.BLACK, this.getCell(0, 0)),
            new Rook(Colors.BLACK, this.getCell(7, 0))
        )
        this.whiteFiguesLeft.push(
            new Rook(Colors.WHITE, this.getCell(0, 7)),
            new Rook(Colors.WHITE, this.getCell(7, 7)),
        )
    }

    // public addFisherFigures() {

    // }

}