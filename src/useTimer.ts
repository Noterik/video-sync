import { useState, useCallback, useLayoutEffect, useRef } from "react";
import raf from "raf";

interface UseTimerArgs {
  from?: number;
  duration?: number;
  rate?: number;
}

const limitToRange = (min: number, max: number, n: number) =>
  Math.min(max, Math.max(min, n));

export const useTimer = ({ from = 0, duration, rate = 1 }: UseTimerArgs) => {
  const [time, setTime] = useState(from);
  const [running, setRunning] = useState(false);
  const end = duration ? from + duration : Infinity;

  // Mutable time value, changing this won't cause a rerender.
  const cTime = useRef<number>(from);

  const checkedSetTime = useCallback(
    t => {
      const newTime = limitToRange(from, end, t);
      setTime(newTime);
      cTime.current = newTime;
      //If the calculated time is different from newTime, then it was out of range, and so the clock should be stopped.
      if (t !== newTime) {
        setRunning(false);
      }
    },
    [from, end]
  );

  const start = useCallback(() => {
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  useLayoutEffect(() => {
    if (!running) return;

    let id: number;
    let lastTimestamp: number;
    const tick = (timestamp: number) => {
      const diff = !lastTimestamp ? 0 : (timestamp - lastTimestamp) * rate;
      lastTimestamp = timestamp;
      cTime.current += diff;
      setTime(cTime.current);
      id = raf(tick);
    };

    id = raf(tick);
    return () => raf.cancel(id);
  }, [running, rate]);

  return {
    running,
    start,
    stop,
    setTime: checkedSetTime,
    time
  };
};
