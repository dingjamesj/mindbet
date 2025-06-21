import React, { useState } from 'react';
import "./App.css";
import Stopwatch from "./components/stopwatch/Stopwatch";
import Points from "./components/points/Points";
import Tabs from "./components/tabs/Tabs"

function App() {
	const [currentTab, setCurrentTab] = useState('timer');

	return (
		<div className="App">
			<div className="sideBar">
				<Tabs updateCurrentTab={setCurrentTab}/>
			</div>
			<div className="mainWindow">
				{
					currentTab === 'timer' ? (
						<Stopwatch/>
					) : (
						<h1>put all the gambling stuff here</h1>
					)
				}
			</div>
		</div>
		);
}

export default App;
