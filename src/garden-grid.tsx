import { useEffect, useRef, useState } from "preact/hooks";

type GardenGridProps = {
  handleGameOver: (score: number) => void;
};

enum PlotStates {
  EMPTY,
  PLANTED,
  READY,
  BARREN,
  WILT,
  REPAIR,
}

const PLOT_TIMES: Record<PlotStates, number> = {
  [PlotStates.EMPTY]: 3,
  [PlotStates.PLANTED]: 5,
  [PlotStates.READY]: 3,
  [PlotStates.WILT]: Infinity,
  [PlotStates.BARREN]: Infinity,
  [PlotStates.REPAIR]: 2,
};

const PLOT_MACHINE: Record<PlotStates, PlotStates> = {
  [PlotStates.EMPTY]: PlotStates.BARREN,
  [PlotStates.PLANTED]: PlotStates.READY,
  [PlotStates.READY]: PlotStates.WILT,
  [PlotStates.REPAIR]: PlotStates.EMPTY,
  [PlotStates.WILT]: PlotStates.WILT,
  [PlotStates.BARREN]: PlotStates.BARREN,
};

const PLOT_CLASS: Record<PlotStates, string> = {
  [PlotStates.EMPTY]: "bg-green-600",
  [PlotStates.PLANTED]: "bg-green-600",
  [PlotStates.READY]: "bg-yellow-600",
  [PlotStates.WILT]: "bg-red-800",
  [PlotStates.BARREN]: "bg-gray-900",
  [PlotStates.REPAIR]: "bg-blue-500",
};

const PLOT_ICONS: Record<PlotStates, string> = {
  [PlotStates.EMPTY]: "",
  [PlotStates.WILT]: "🪦",
  [PlotStates.BARREN]: "💀",
  [PlotStates.REPAIR]: "⛏️",
  [PlotStates.PLANTED]: "🌱",
  [PlotStates.READY]: "🌻",
};

type Plot = {
  type: PlotStates;
  icon: string | null;
  time: number;
};
const GardenGrid = ({ handleGameOver }: GardenGridProps) => {
  const score = useRef<number>(0);
  const [time, setTime] = useState(30);
  const timer = useRef<number | null>(null);
  const [grid, setGrid] = useState<Plot[]>(
    new Array(16).fill(0).map(() => ({
      type: PlotStates.EMPTY,
      icon: null,
      time: PLOT_TIMES[PlotStates.EMPTY],
    }))
  );

  const calculateNext = () => {
    setTime((prev) => {
      if (prev <= 0) {
        if (timer.current) {
          clearInterval(timer.current);
        }
        handleGameOver(score.current);
        return prev;
      }
      return prev - 1;
    });

    setGrid((prev) => {
      const newGrid = [...prev].map((item) => {
        const newTime = item.time - 1;
        if (newTime === 0) {
          const next = PLOT_MACHINE[item.type];
          return {
            ...item,
            type: next,
            time: PLOT_TIMES[next],
            icon: PLOT_ICONS[next] || "",
          };
        }
        return { ...item, time: newTime };
      });
      return newGrid;
    });
  };

  const setNextPlotState = (index: number) => {
    let currentScore = 0;
    setGrid((prev) => {
      const newGrid = [...prev].map((item, i) => {
        if (index === i) {
          if (item.type === PlotStates.EMPTY) {
            return {
              type: PlotStates.PLANTED,
              icon: PLOT_ICONS[PlotStates.PLANTED],
              time: PLOT_TIMES[PlotStates.PLANTED],
            };
          }

          if (item.type === PlotStates.READY || item.type === PlotStates.WILT) {
            currentScore += item.type === PlotStates.READY ? 10 : 0;
            return {
              type: PlotStates.EMPTY,
              icon: "",
              time: PLOT_TIMES[PlotStates.EMPTY],
            };
          }

          if (item.type === PlotStates.BARREN) {
            return {
              type: PlotStates.REPAIR,
              icon: PLOT_ICONS[PlotStates.REPAIR],
              time: PLOT_TIMES[PlotStates.REPAIR],
            };
          }
        }
        return item;
      });
      return newGrid;
    });

    score.current += currentScore;
  };

  useEffect(() => {
    timer.current = window.setInterval(calculateNext, 1000);

    return () => {
      if (timer?.current) {
        clearInterval(timer?.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full my-4">
      <div className="flex self-center gap-2 w-11/12">
        <p className="p-4 text-4xl font-bold w-1/2 text-center border-2 border-dotted border-black">
          {time}s
        </p>
        <p className="p-4 text-4xl font-bold text-center w-1/2 border-2 border-dotted border-black">
          Score {score.current}
        </p>
      </div>

      <div className="grid grid-cols-4 w-5/6 my-8 self-center">
        {grid.map((plot, i) => {
          return (
            <button
              key={`plot-${i}`}
              className={`${PLOT_CLASS[plot.type]} h-36 border-2 text-6xl`}
              onClick={() => setNextPlotState(i)}>
              {plot.icon || ""}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GardenGrid;
