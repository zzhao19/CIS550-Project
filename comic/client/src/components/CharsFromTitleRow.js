import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CharsFromTitleRow extends React.Component {
	
	// define the return content output in the submitTtile function in Search.js

	render() {
		return (
			<div className="charsFromTitleResults">
				<div className="Character">{this.props.Character}</div>
        <div className="Alignment">{this.props.Alignment}</div>
        <div className="Gender">{this.props.Gender}</div>
        <div className="Status">{this.props.Status}</div>
        <div className="Appearances">{this.props.Appearances}</div>
			</div>
		);
	};
};
