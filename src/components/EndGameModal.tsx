import React, { FC } from 'react'
import { Colors } from '../models/Colors';
import { Player } from '../models/Player';

type EndGameModalType = {
    currentPlayer: Player | null
    hideModal: () => void
    time: number | null
}

const EndGameModal: FC<EndGameModalType> = ({ currentPlayer, hideModal, time }) => {
    return (
        <div>
            <div className="modal">
                <section className="modal-main">
                    {time === 0 ?
                        (
                            currentPlayer?.color === Colors.WHITE ?
                                <h1>Время вышло! Черные победили!</h1>
                                :
                                <h1>Время вышло! Белые победили!</h1>
                        )
                        :
                        (
                            currentPlayer?.color === Colors.WHITE ?
                                <h1>Мат! Черные победили!</h1>
                                :
                                <h1>Мат! Белые победили!</h1>
                        )
                    }
                    {/* currentPlayer?.color === Colors.WHITE ?
                    <h1>Время вышло! Черные победили!</h1>
                    :
                    <h1>Время вышло! Белые победили!</h1> */}

                    <button onClick={hideModal} >Ok</button>
                </section>
            </div>

        </div>
    )
};

export default EndGameModal
