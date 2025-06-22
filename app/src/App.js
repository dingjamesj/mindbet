import React, { useState } from "react";
import "./App.css";
import Stopwatch from "./components/stopwatch/Stopwatch";
import Tabs from "./components/tabs/Tabs";
import Leaderboard from "./components/leaderboard/Leaderboard";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

function App() {
	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	const [currentTab, setCurrentTab] = useState("timer");
	const [running, setRunning] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [roomInfo, setRoomInfo] = useState([]);
	const sessionInfo = {
		roomId: null,
		username: null,
	}

	const initializeRoomLogin = async () => {
		const {data, e} = await supabase.from("rooms").select("username, points").eq("roomid", sessionInfo.roomId);
		setRoomInfo(data)
	}

	const setLogin = (roomId, username) => {
		sessionInfo.roomId = roomId;
		sessionInfo.username = username;
		initializeRoomLogin();
		setIsSignedIn(true);
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
							<Stopwatch running={running} />
						) : (
							<div className="playContainer">
								<div className="mainPlayPanel">
									<h1>put all the gambling stuff here</h1>
								</div>
								<div className="leaderboardSideBar">
									<Leaderboard data={roomInfo} />
								</div>
							</div>
						)}
					</div>
					
				</div>
			) : (
				<div style={{margin: "auto"}}>
					<h1 onClick={(e) => setLogin(80, 'a')}>Put login screen here</h1>
				</div>
			)}
		</div>
	);
}

export default App;
