import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		};
	};

	componentDidMount() {

		// define page list
		const pageList = ['Search', 'Recommendations', 'Power', 'Movies'];

		// for each page define onclick display and hyperlinks
		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			} else {
				return <a className="nav-item nav-link" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		});

		this.setState({
			navDivs: navbarDivs
		});
	};

	

	render() {
		return (
			<div className="PageNavbar">
				<nav className="navbar navbar-expand-lg navbar-light bg-light">

					{/* add a home page navigation in the bar */}
				  	<a className="nav-item nav-link active text-dark" href="/"><b>Home</b></a>
			      	<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			        	<div className="navbar-nav">
							{this.state.navDivs}
			        	</div>
			      	</div>
				</nav>
			</div>
    	);
	};
};