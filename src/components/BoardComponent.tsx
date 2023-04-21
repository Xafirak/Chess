import React, { FC, useEffect, useState } from 'react'
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Colors } from '../models/Colors';
import { FigureNames } from '../models/figures/Figures';
import { Player } from '../models/Player';
import CellComponent from './CellComponent';

interface BoardProps {
    disabled: boolean
    board: Board
    setBoard: (board: Board) => void
    currentPlayer: Player | null
    swapPlayer: () => void
    isGameOver: () => void
}

const BoardComponent: FC<BoardProps> = ({
    board, setBoard, currentPlayer, swapPlayer, disabled, isGameOver
}) => {

    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)

    function click(cell: Cell) {
        if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
            selectedCell.moveFigure(cell)
            swapPlayer()
            setSelectedCell(null)
        } else {
            if (cell.figure?.color === currentPlayer?.color) {
                setSelectedCell(cell)
            }
        }
    }

    useEffect(() => {
        hightlightCells()
    }, [selectedCell])

    function hightlightCells() {
        board.hightlightCells(selectedCell)
        updateBoard()
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    return (
        <div className={disabled ? 'disabled' : ''}>
            <h3>Текущий игрок - {currentPlayer?.color}</h3>
            <div className='board' >
                {board.cells.map((row, index) =>
                    <React.Fragment key={index} >
                        {row.map(cell =>
                            <CellComponent
                                click={click}
                                selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                cell={cell}
                                key={cell.id}
                            />
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    )
};

export default BoardComponent
