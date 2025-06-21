import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import './Tabs.css';

const Tabs = ({updateCurrentTab}) => {
	const [selected, setSelected] = useState('timer');
	const handleChange = (e, val) => {
		if (val) {
			setSelected(val);
			updateCurrentTab(val);
		}
	}
	return (
		<ToggleButtonGroup color="primary" exclusive className="Tabs" value={selected} onChange={handleChange}>
			<ToggleButton value="timer">Timer</ToggleButton>
			<ToggleButton value="play">Play</ToggleButton>
		</ToggleButtonGroup>
	)
}

export default Tabs;
