import React, { useState, useEffect } from "react";
import "./App.css";
import Stopwatch from "./components/stopwatch/Stopwatch";
import Cam from "./components/camera/Cam";
import Tabs from "./components/tabs/Tabs";
import Leaderboard from "./components/leaderboard/Leaderboard";
import PlayerInfoDisplay from "./components/playerInfoDisplay/PlayerInfoDisplay";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const sessionInfo = {
	roomId: null,
	username: null,
}

function App() {
	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	const [currentTab, setCurrentTab] = useState("timer");
	const [isLookingDown, setIsLookingDown] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [roomInfo, setRoomInfo] = useState([]);
	const [time, setTime] = useState(0);

	const playerInfo = roomInfo.length ? roomInfo.find(e => e.username === sessionInfo.username) : null;

	const initializeRoomLogin = async () => {
		const {data, e} = await supabase.from("rooms").select("username, points").eq("roomid", sessionInfo.roomId);
		setRoomInfo(data);
		console.log(playerInfo);
	}

	const setLogin = (roomId, username) => {
		sessionInfo.roomId = roomId;
		sessionInfo.username = username;
		initializeRoomLogin();
		setIsSignedIn(true);
		console.log(':3');
		console.log(sessionInfo);
	}


	return (
		<div className="App">
			{isSignedIn ? (
				<div className="mainWrapper">
					<div className="sideBar">
						<Tabs updateCurrentTab={setCurrentTab} />
					</div>
					<div className="mainPanel">
						{currentTab === "timer" ? (
							<div>
            <Stopwatch running={isLookingDown} time={time} setTime={setTime} />
            <Cam onGazeChange={setIsLookingDown} />
          </div>
						) : (
							<div className="playContainer">
								<div className="mainPlayPanel">
									<h1>put all the gambling stuff here</h1>
								</div>
								<div className="leaderboardSideBar">
									<PlayerInfoDisplay data={playerInfo} />
									<Leaderboard data={roomInfo} />
								</div>
							</div>
						)}
					</div>
					
				</div>
			) : (
				<div style={{margin: "auto"}}>
					<h1 onClick={(e) => setLogin(80, 'nicospronk')}>Put login screen here</h1>
				</div>
			)}
		</div>
	);
}

export default App;
