import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AlignButton extends React.Component {

	// define the alignment choice buttons in PowerCompete.js
	
	render() {
		return (
			<div className="align" id={this.props.id} onClick={this.props.onClick}>
				{this.props.align}
			</div>
		);
	};
};