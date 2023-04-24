import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import BoardComponent from './components/BoardComponent';
import EndGameModal from './components/EndGameModal';
import LostFigures from './components/LostFigures';
import StartGameModal from './components/StartGameModal';
import Timer from './components/Timer';
import { Board } from './models/Board';
import { Colors } from './models/Colors';
import { Player } from './models/Player';

//todo сделать так, чтобы пользователь сам задавал время - done +
//  модалки на начало и конец игры + нельзя трогать доску после истечения 
//  времени (сделал через css, возможно ли сделать как-либо нативно в div'e?)
// вынес компоненты endGameModal и StartGameModal в App, переделываю.....done!


//===========
//todo сделать логику движения короля - done
// Доработать - король не может сьесть фигуру, если ее никто не защищает и она стоит рядом
// по вертикали или горизонтали (по диагонали все норм)
// Работает пока не проверяется невозможность похода на атакуемую клетку

//===========
// todo сделать проверку, когда время истекает  - done

//===========
// todo сделать рокировку - DONE
// сделать проверку что клетки при рокировке не атакуются!!!!

//===========
// todo бага - первым ходом пешка может перепрыгнуть через 
// другую фигуру, стоящую перед ней - частично сделано, только для черных
// СДЕЛАНО !!!

//===========
//todo если фигура защишает короля от удара, то ее нельзя двигать

//===========
//todo добавить буквы снизу и цифры сбоку (координаты) 


//===========
// todo условия для шаха и мата, инфо --- 1:11:01




function App() {
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [board, setBoard] = useState(new Board())
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE))
  const [blackPlayer, setblackPlayer] = useState(new Player(Colors.BLACK))
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [lostPlayer, setLostPlayer] = useState<Player | null>(null)
  const [time, setTime] = useState<number | null>(0)
  const [modal, setModal] = useState<boolean>(false)

  useEffect(() => {
    restart()
    setCurrentPlayer(whitePlayer)
  }, [])

  function restart() {
    const newBoard = new Board();
    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
    setGameOver(false)
    setCurrentPlayer(whitePlayer)
  }

  function swapPlayer() {
    setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer)
  }

  function isGameOver() {
    setGameOver(true)
  }


  function hideModal() {
    setModal(false)
  }
  function showModal() {
    setModal(true)
  }



  return (
    <div className="app">
      <button onClick={() => console.log(gameOver, currentPlayer, time)} >lostPlayer</button>
      {
        gameOver && modal ? (
          < EndGameModal
            time={time}
            currentPlayer={currentPlayer}
            hideModal={hideModal}
          />)
          : ''
      }
      <Timer
        isGameOver={isGameOver}
        showModal={showModal}
        setTime={setTime}
        time={time}
        restart={restart}
        currentPlayer={currentPlayer}
      />
      <BoardComponent
        disabled={gameOver}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        board={board}
        setBoard={setBoard}
        isGameOver={isGameOver}
      />
      <div>
        <LostFigures
          title='Черные фигуры'
          figures={board.lostBlackFigures}
        />
        <LostFigures
          title='Белые фигуры'
          figures={board.lostWhiteFigures}
        />
      </div>
    </div >
  );
}

export default App;
