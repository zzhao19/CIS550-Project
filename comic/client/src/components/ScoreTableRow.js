import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class ScoreTableRow extends React.Component {

	/* define the row display for power dimension score output
	replaced with radar charts and bar charts in later version */

	render() {
		return (
			<div className="score">
				<div className="category">{this.props.category}</div>
				<div className="score">{this.props.score}</div>
			</div>
		);
	};
};