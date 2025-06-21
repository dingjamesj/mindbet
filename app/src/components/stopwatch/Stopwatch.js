import React, { useState, useEffect } from "react";
import "./Stopwatch.css";

const Stopwatch = ({ running }) => {
  const [time, setTime] = useState(0);
  console.log(running);
  useEffect(() => {
    let intervalId;
    if (running) {
      intervalId = setInterval(() => setTime((t) => t + 1), 10); // ✅ correct update
    }
    return () => clearInterval(intervalId);
  }, [running]);

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
