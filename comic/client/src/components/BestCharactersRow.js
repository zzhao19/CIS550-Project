import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestCharactersRow extends React.Component {

	// define the display content of best character recommendation results in Recommendation.js

	render() {
		return (
			<div className="characterResults">
				<div className="name">{this.props.name}</div>
				<div className="numBooks">{this.props.numBooks}</div>
				<div className="topMatchBook">{this.props.topMatchBook}</div>
				<div className="alignment">{this.props.alignment}</div>
				<div className="superpowers">{this.props.superpowers}</div>
			</div>
		);
	};
};
