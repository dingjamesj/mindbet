import React, { useState, useEffect } from "react";
import "./Points.css";
import "../stopwatch/Stopwatch";

const Points = ({ time }) => {
  const calculatePoints = (time) => {
    if (!time) return 0;
    return time;
  };
  const points = calculatePoints(time);

  return (
    <div className="points-container">
      <h2>Points: {points}</h2>
    </div>
  );
};

export default Points;
