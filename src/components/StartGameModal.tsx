import React, { useState, FC } from 'react'
import '../App.css'

type StartGameModal = {
    startButton: (e: React.MouseEvent<HTMLButtonElement>) => void
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const StartGameModal: FC<StartGameModal> = ({ startButton, changeHandler }) => {


    return (

        <div className="modal">
            <section className="modal-main">
                <h1>Введите время игры</h1>
                <div>
                    <input onChange={changeHandler} type="text" />
                </div>

                <div>
                    <button onClick={startButton}>Start!</button>
                </div>
            </section>
        </div>
    )
};

export default StartGameModal
