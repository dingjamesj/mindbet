// App.js
import React, { useState } from "react";
import Stopwatch from "./components/stopwatch/Stopwatch";
import Camera from "./components/camera/Cam";

function App() {
  const [running, setRunning] = useState(false);

  return (
    <div className="App">
      <Stopwatch running={running} />
      <Camera
        onDirectionChange={(direction) => {
          if (direction === "Looking Down") setRunning(true);
          else setRunning(false);
        }}
      />
    </div>
  );
}

export default App;
