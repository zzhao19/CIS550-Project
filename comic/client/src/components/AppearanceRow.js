import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AppearanceRow extends React.Component {
	
	// define the display of appearance search results in Search.js

	render() {
		return (
			<div className="appearanceResults">
				<div className="Character">{this.props.Character}</div>
			</div>
		);
	};
};
