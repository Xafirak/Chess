import { Colors } from "../Colors";
import logo from '../../assets/black-king.png'
import { Cell } from './../Cell';
import { throws } from "assert";

export enum FigureNames {
    FIGURE = "Фигура",
    KING = "Король",
    KNIGHT = "Конь",
    PAWN = "Пешка",
    QUEEN = "Ферзь",
    ROOK = "Ладья",
    BISHOP = "Слон",
}

export class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    id: number;
    firstStep: boolean
    blackKingIsUnderAttack: boolean
    whiteKingIsUnderAttack: boolean
    isChecked: boolean

    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = Math.random()
        this.firstStep = true
        this.blackKingIsUnderAttack = false
        this.whiteKingIsUnderAttack = false
        this.isChecked = false   // Добавил для устранения баги королей
    }


    canMove(target: Cell): boolean {

        if (target.figure?.name === FigureNames.KING)
            return false

        if (this.color === Colors.BLACK) {
            if (target.figure?.color === this.color)
                return false
        }

        if (this.color === Colors.WHITE) {
            if (target.figure?.color === this.color)
                return false
        }

        return true
    }

    moveFigure(target: Cell) {
        this.firstStep = false
        this.isChecked = false
    }

}