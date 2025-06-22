import React from "react";
import "./Leaderboard.css";
const Leaderboard = ({data}) => {
	const sortedData = data.sort((a, b) => a - b);
	return (
		<div className="mainWrapper">
			<div className="columnFlexContainer">
				<h2>Leaderboard</h2>
				<div className="rowFlexContainer">
					<div className="positionColumn">
						<div className="columnFlexContainer">
							<p>&nbsp;</p>
							{
								sortedData.map((e, i) => (
									<p>{(i + 1) + ". "}</p>
								))
							}
						</div>
					</div>
					<div className="nameColumn">
						<div className="columnFlexContainer">
							<p>Name</p>
							{
								sortedData.map(e => (
									<p>{e.username}</p>
								))
							}
						</div>
					</div>
					<div className="columnFlexContainer">
						<p>Points</p>
						{
							sortedData.map(e => (
								<p>{e.points}</p>
							))
						}
					</div>
				</div>
			</div>
		</div>
	)	

}

export default Leaderboard;
