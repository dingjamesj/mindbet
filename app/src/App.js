import React, { useState } from "react";
import "./App.css";
import Stopwatch from "./components/stopwatch/Stopwatch";
import Cam from "./components/camera/Cam";
import Tabs from "./components/tabs/Tabs";

function App() {
  const [currentTab, setCurrentTab] = useState("timer");
  const [isLookingDown, setIsLookingDown] = useState(false);

  const [time, setTime] = useState(0);

  return (
    <div className="App">
      <div className="sideBar">
        <Tabs updateCurrentTab={setCurrentTab} />
      </div>
      <div className="mainWindow">
        {currentTab === "timer" ? (
          <div>
            <Stopwatch running={isLookingDown} time={time} setTime={setTime} />
            <Cam onGazeChange={setIsLookingDown} />
          </div>
        ) : (
          <h1>put all the gambling stuff here</h1>
        )}
      </div>
    </div>
  );
}

export default App;
