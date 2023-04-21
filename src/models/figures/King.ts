import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figures";
import blackLogo from '../../assets/black-king.png'
import whiteLogo from '../../assets/white-king.png'

export class King extends Figure {
    isFirstStep: boolean = true
    canMoveResolved: boolean = false
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.KING
    }


    canMove(target: Cell): boolean {
        // if (this.isChecked === true) {
        //     return this.canMoveResolved
        // } else {

        // проверка возможности рокировки        
        if (this.isFirstStep === true)
            if (this.cell.isCastlingAvaliable(target)) {
                return true
            }
        if (!super.canMove(target))
            return false

        // ход по вертикали
        if (this.cell.moveVerticallyKing(target))
            return true

        // ход по горизонтали
        if (this.cell.moveHorizontallyKing(target))
            return true

        // ход по диагонали
        if (this.cell.moveDiagonallyKing(target))
            return true

        this.isChecked = true
        return false
        // }
    }

    moveFigure(target: Cell): void {
        super.moveFigure(target)
        this.isFirstStep = false

        if (target.x === this.cell.x + 2) {
            target.Castling()
        }
        else if (target.x === this.cell.x - 2) {
            target.Castling()
        }
    }
}