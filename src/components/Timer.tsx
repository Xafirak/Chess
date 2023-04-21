import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Colors } from '../models/Colors';
import { Player } from './../models/Player';
import EndGameModal from './EndGameModal';
import StartGameModal from './StartGameModal';

interface TimerProps {
    currentPlayer: Player | null
    restart: () => void
    time: number | null
    setTime: (n: number | null) => void
    showModal: () => void
    isGameOver: () => void
}
// cделать логику задавания времени игры


const Timer: FC<TimerProps> = ({
    currentPlayer, restart, time, setTime, showModal, isGameOver
}) => {
    const [blackTime, setBlackTime] = useState<number | null>(time)
    const [whiteTime, setWhiteTime] = useState<number | null>(time)
    const timer = useRef<null | ReturnType<typeof setInterval>>(null)


    // Вопрос - стоит ли делать зависимость  от whiteTime, blackTime?
    // идет же постоянная перерисовка страницы при тике setInterval, что
    // нагружает браузер или перерисовывается

    useEffect(() => {
        startTimer()
    }, [currentPlayer, blackTime, whiteTime])





    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current)
        }
        const callback = currentPlayer?.color === Colors.WHITE
            ? decrementWhiteTimer : decrementBlackTimer

        timer.current = setInterval(callback, 1000)
        if (whiteTime === 0 || blackTime === 0) {
            clearInterval(timer.current)
        }
        if ((whiteTime === 0 && blackTime! > 0)
            || (blackTime === 0 && whiteTime! > 0)) {
            isGameOver()
            showModal()
            setTime(0)
        }
    }

    function decrementBlackTimer() {
        setBlackTime(prev => prev! - 1)
    }
    function decrementWhiteTimer() {
        setWhiteTime(prev => prev! - 1)
    }

    function handleRestart() {
        restart()
        setBlackTime(0)
        setWhiteTime(0)
    }



    function changeHandler(e: ChangeEvent<HTMLInputElement>) {
        setTime(+e.target.value)
    }
    function startButton(e: React.MouseEvent<HTMLButtonElement>) {
        setBlackTime(time)
        setWhiteTime(time)
        startTimer()
    }

    return (
        <div>
            {whiteTime === 0 && blackTime === 0 ?
                <StartGameModal
                    changeHandler={changeHandler}
                    startButton={startButton}
                />
                :
                ''
            }

            <button onClick={handleRestart}>Restart game </button>
            <h2> {currentPlayer?.color === Colors.BLACK ? '==> ' : ''}Черные: {blackTime}</h2>
            <h2> {currentPlayer?.color === Colors.WHITE ? '==> ' : ''}Белые: {whiteTime}</h2>
        </div>
    )
};

export default Timer








