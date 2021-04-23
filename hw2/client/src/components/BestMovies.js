import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './BestMoviesRow';
import '../style/BestMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestMovies extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			decades: [],
			genres: [],
			movies: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
		fetch("http://localhost:8081/decades",
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(decadeList => {
			if (!decadeList) return;

			const decadeLst = decadeList.map((dec, i) =>
				<option className="decadesOption" key = {i} value={dec.decade}>{dec.decade}</option>
			);
			
			this.setState({
				decades: decadeLst
			});

		}, err => {
			console.log(err);
		});

		fetch("http://localhost:8081/genres",
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(genreList => {
			if (!genreList) return;

			const genreLst = genreList.map((gen, i) =>
				<option className="genresOption" key = {i} value={gen.name}>{gen.name}</option>
			);
			
			this.setState({
				genres: genreLst
			});

		}, err => {
			console.log(err);
		});

	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	};

	handleGenreChange(e) {
		this.setState({
			selectedGenre: e.target.value
		});
	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		const dg_url = `http://localhost:8081/bestmovies/${this.state.selectedDecade}&${this.state.selectedGenre}`;
		
		fetch(dg_url,
		{
			method: "GET"
		})
		.then(res => {
			return res.json();
		}, err => {
			console.log(err);
		})
		.then(bestList => {
			if (!bestList) return;

			const bestResults = bestList.map((best, i) =>
			<BestMoviesRow
				title={best.title}
				id={best.movie_id}
				rating={best.rating}
			/>
		);
			this.setState({
				movies: bestResults
			});
		}, err => {
			console.log(err);
		});
	};

	render() {
		return (
			<div className="BestMovies">
				
				<PageNavbar active="bestgenres" />

				<div className="container bestmovies-container">
					<div className="jumbotron">
						<div className="h5">Best Movies</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			          <div className="header"><strong>Title</strong></div>
			          <div className="header"><strong>Movie ID</strong></div>
								<div className="header"><strong>Rating</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.movies}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
