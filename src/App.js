import React from "react";
import { nanoid } from "nanoid";
import Die from "./Die";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [dots, setDots] = React.useState(false);
  const [currentScore, setCurrentScore] = React.useState(0);
  const [leaderboard, setLeaderboard] = React.useState([]);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setLeaderboard((oldLeaderboard) => [...oldLeaderboard, currentScore]);
    }
  }, [dice]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    };
  }

  function increaseScore() {
    if (!tenzies) {
      setCurrentScore((oldScore) => oldScore + 1);
    } else {
      setCurrentScore((oldScore) => 0);
    }
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      increaseScore();
    } else {
      setTenzies(false);
      increaseScore();
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      dots={dots}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      <header>
        {leaderboard.length && (
          <div className="leaderboard">
            <h3>Leaderboard</h3>
            <ul>
              {leaderboard
                .sort((a, b) => a - b)
                .map((value) => (
                  <li key={nanoid()}>{value}</li>
                ))}
            </ul>
          </div>
        )}
        <div className="current-score">
          <h2>Score</h2>
          <span className="score">{currentScore}</span>
        </div>
        <button
          className={`toggle-dots ${dots && "toggled"}`}
          onClick={() => setDots((dots) => !dots)}
        >
          Dots
        </button>
      </header>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <div className="dice-container">{diceElements}</div>

      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
