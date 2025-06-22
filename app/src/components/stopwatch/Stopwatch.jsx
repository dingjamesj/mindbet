import React, { useEffect, useState, useRef } from "react";
import "./Stopwatch.css";

const Stopwatch = ({ running, time, setTime }) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => setTime((t) => t + 1), 10);
      }
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [running, setTime]);

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  return (
    <div className="stopwatch-container">
      <p className="stopwatch-time">
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
};

export default Stopwatch;
