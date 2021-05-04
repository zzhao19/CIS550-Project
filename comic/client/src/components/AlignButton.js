import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AlignButton extends React.Component {
	/* props looks like:
		{
			id
			onClick
			keyword
		}
	*/
	
	render() {
		return (
			<div className="align" id={this.props.id} onClick={this.props.onClick}>
				{this.props.align}
			</div>
		);
	};
};