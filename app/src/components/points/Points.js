import React, { useState, useEffect } from "react";
import "./Points.css";
import "../stopwatch/Stopwatch";

const Points = ({ time }) => {
  const calculatePoints = (time) => {
    if (!time) return 0;

    let hour = 0
    let day = 0
    let token = 0
    let basemult = 0
    const date = new Date();
    let dayOfWeek = date.getDay()

    function checkDayConsistency() {
      // If today is not one day bigger than yesterday, reset day counter
    }

    function increaseHour() {
      hour += 1;
    }

    function changeDayOfWeek() {
      day = day + 1; 
      hour = 0;
      dayOfWeek += 1;
      if (dayOfWeek > 6) {
        dayOfWeek = 0;
      }
      //document.getElementById("DayOfWeek").innerHTML = "Day of Week: " + dayOfWeek;
    }

    function dailyBonus(x) {
      if (dayOfWeek < 2) {
        return (x**1.5)/1.3;
      } else if (dayOfWeek < 4) {
        return 1.8*x;
      } else if (dayOfWeek < 6) {
        return x + 0.5*Math.abs(10*Math.sin(0.5*x));
      } else if (dayOfWeek == 6) {
        a = (-1*x**2 + 1)/(-1.1*x) + 5
        if (a < 0) {
          return 0;
        } else {
          return a;
        }
      }
    }

    function baseMultiplier(d) {
      return basemult = (1.01)**d;
    }

    function updateToken(t,d) {
      token += dailyBonus(t*baseMultiplier(d), d);
      document.getElementById("Context").innerHTML = "Token: " + token;
      document.getElementById("Hour").innerHTML = "Hours: " + hour;
      document.getElementById("Day").innerHTML = "Days: " + day;
    }

    console.log("Bonjour");


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

