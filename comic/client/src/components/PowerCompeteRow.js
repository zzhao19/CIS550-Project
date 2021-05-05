import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class PowerCompeteRow extends React.Component {

	render() {
		return (
			<div className="power">
				<div className="name">{this.props.power_name}</div>
			</div>
		);
	};
};