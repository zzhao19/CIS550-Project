import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CharButton extends React.Component {
	/* props looks like:
		{
			id
			onClick
			keyword
		}
	*/
	
	render() {
		return (
			<div className="char" id={this.props.id} onClick={this.props.onClick}>
				{this.props.char}
			</div>
		);
	};
};