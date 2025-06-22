import React from "react";

const PlayerInfoDisplay = ({data}) => {
		console.log(data);
	return (
		<div>
			<p><strong>Username: </strong>{data.username}</p>
			<p><strong>Points: </strong>{data.points}</p>
		</div>
	)
}

export default PlayerInfoDisplay;
