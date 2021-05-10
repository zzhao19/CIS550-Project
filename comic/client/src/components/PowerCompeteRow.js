import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class PowerCompeteRow extends React.Component {

	// define content output display for power search in PowerCompete.js

	render() {
		return (
			<div className="power">
				<div className="name">{this.props.power_name}</div>
			</div>
		);
	};
};