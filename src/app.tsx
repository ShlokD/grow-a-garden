import { useState } from "preact/hooks";
import GardenGrid from "./garden-grid";

const getHighScore = () => {
  try {
    const stored = localStorage.getItem("highScore");
    return Number(stored);
  } catch (_) {
    return 0;
  }
};

const saveHighScore = (score: number) => {
  try {
    localStorage.setItem("highScore", String(score));
  } catch (_) {
    return;
  }
};

export function App() {
  const [gameState, setGameState] = useState("INIT");
  const [highScore, setHighScore] = useState(getHighScore());
  const [score, setScore] = useState(0);
  const showGameOverScreen = (newScore: number) => {
    setGameState("END");
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      saveHighScore(newScore);
    }
  };

  const restart = () => {
    setScore(0);
    setGameState("PLAY");
  };
  return (
    <main className="flex flex-col min-h-screen w-full bg-green-400 p-2">
      <h1 className="self-center p-4 text-white font-bold text-4xl">
        Grow a Garden
      </h1>
      <details className="text-2xl font-bold">
        <summary>Instructions</summary>
        <ul>
          <li>Tap an empty plot to grow crops </li>
          <li>Wait for the crop to be ready for harvest</li>
          <li>Harvest each crop before it wilts to win points</li>
          <li>If an empty plot remains empty, it will become barren</li>
          <li>Tap a barren plot to make it fertile again before planting</li>
        </ul>
      </details>
      {gameState === "INIT" && (
        <button
          onClick={() => setGameState("PLAY")}
          className="py-4 px-6 w-5/6 hover:bg-gray-600 self-center bg-black rounded-2xl text-2xl my-8 text-white font-bold">
          Start
        </button>
      )}

      {gameState === "PLAY" && (
        <GardenGrid handleGameOver={showGameOverScreen} />
      )}

      {gameState === "END" && (
        <div className="flex flex-col items-center gap-4 my-8">
          <p className="text-4xl font-bold">Final Score {score}</p>
          <p className="text-4xl font-bold">High Score {highScore}</p>
          <button
            onClick={restart}
            className="py-4 px-6 w-5/6 hover:bg-gray-600 self-center bg-black rounded-2xl text-2xl my-8 text-white font-bold">
            New Game
          </button>
        </div>
      )}
    </main>
  );
}
