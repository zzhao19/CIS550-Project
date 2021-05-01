import React from 'react';
import ReactDOM from "react-dom";
import PageNavbar from './PageNavbar';
import BestComicsRow from './BestComicsRow';
import '../style/BestComics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from "react-dropdown-select";

export default class BestComics extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		    labelField: "props.value",
		    valueField: "props.value",
		    searchable: true,
			selectedTitle: "",
			selectedYear: "",
			selectedNumber: "",
			selectedVersion: "",
			titles: [],
			years: [],
			numbers: [],
			versions: [],
			comics: []
		};

		this.submitTitleYearNumberVersion = this.submitTitleYearNumberVersion.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleNumberChange = this.handleNumberChange.bind(this);
		this.handleVersionChange = this.handleVersionChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
        fetch("http://localhost:8081/title",{
          method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(titlesList => {
          if (!titlesList) return;

          const titlesDivs = titlesList.map((title, i) => (
            <option className="titlesOption" key={i} value={title.title}>{title.title}</option>
          ));
          this.setState({
            titles: titlesDivs
          });
        }, err => {
          console.log(err);
        });

        fetch("http://localhost:8081/year",{
          method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(yearsList => {
          if (!yearsList) return;

          const yearsDivs = yearsList.map((year, i) => (
            <option className="yearsOption" key={i} value={year.issueYear}>{year.issueYear}</option>
          ));

          this.setState({
            years: yearsDivs
          });
        }, err => {
          console.log(err);
        });

        fetch("http://localhost:8081/number",{
          method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(numbersList => {
          if (!numbersList) return;

          const numbersDivs = numbersList.map((number, i) => (
            <option className="numbersOption" key={i} value={number.issueNumber}>{number.issueNumber}</option>
          ));

          this.setState({
            numbers: numbersDivs
          });
        }, err => {
          console.log(err);
        });

        fetch("http://localhost:8081/version",{
          method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(versionsList => {
          if (!versionsList) return;

          const versionsDivs = versionsList.map((version, i) => (
            <option className="versionsOption" key={i} value={version.version}>{version.version}</option>
          ));

          this.setState({
            versions: versionsDivs
          });
        }, err => {
          console.log(err);
        });
     };

	/* ---- Q3a (Best Movies) ---- */

	setTitle = selectedTitle => this.setState({selectedTitle});



	handleTitleChange(e) {
		this.setState({
			selectedTitle: e.target.value
		});
	};

	handleYearChange(e) {
		this.setState({
			selectedYear: e.target.value
		});
	};

	handleNumberChange(e) {
		this.setState({
			selectedNumber: e.target.value
		});
	};

	handleVersionChange(e) {
		this.setState({
			selectedVersion: e.target.value
		});
	};

	/* ---- Q3b (Best Movies) ---- */
	submitTitleYearNumberVersion() {
	    const myUrlWithParams = `http://localhost:8081/bestcomics/${this.state.selectedTitle}&${this.state.selectedYear}&${this.state.selectedNumber}&${this.state.selectedVersion}`;

        console.log(myUrlWithParams)
        fetch(myUrlWithParams,
        {
          method:"GET"
        }).then(res => {return res.json();
        }, err => {console.log(err);
        }).then(comicsList => {if (!comicsList) return;
        console.log(comicsList)
        const comicsDivs = comicsList.map((comicObj, i) =>
          <BestComicsRow
            title={comicObj.title}
            issueYear={comicObj.issueYear}
            numChar={comicObj.NumCha}
            commonChar={comicObj.CommonCharacters}
            description={comicObj.description}
          />
        );

          this.setState({
            comics: comicsDivs
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
	};

	render() {
		return (
			<div className="BestComics">

				<PageNavbar active="bestcomics" />

				<div className="container bestcomics-container">
					<div className="jumbotron">
						<div className="h5">Best Comics</div>

							<Select
							    placeholder='Please select your comic book title'
							    options={this.state.titles}
							    values={[]}
							    searchable={this.state.searchable}
							    labelField={this.state.labelField}
							    valueField={this.state.valueField}
							    onChange={values => this.setTitle(values)}
							    id="titlesDropdown">
							</Select>

							<Select placeholder='Please select the issue year of your comic book'
							    searchable={this.state.searchable}
							    options={this.state.years}
							    labelField={this.state.labelField}
							    valueField={this.state.valueField}
							    onChange={values=>this.handleYearChange}
							    id="yearsDropdown">
							</Select>

							<Select placeholder='Please seflect the issue number of your comic book'
							    searchable={this.state.searchable}
							    options={this.state.numbers}
							    labelField={this.state.labelField}
							    valueField={this.state.valueField}
							    onChange={values=>this.handleNumberChange}
							    id="numbersDropdown">
							</Select>

							<Select placeholder='Please select your comic book version ("None" if not a special version)'
							    searchable={this.state.searchable}
							    options={this.state.versions}
							    labelField={this.state.labelField}
							    valueField={this.state.valueField}
							    onChange={values=>this.handleVersionChange}
							    id="versionsDropdown">
							</Select>

							<button className="submit-btn" id="submitBtn" onClick={this.submitTitleYearNumberVersion}>Submit</button>

					</div>
					<div className="jumbotron">
						<div className="comics-container">
							<div className="comic">
			          <div className="header"><strong>title</strong></div>
			          <div className="header"><strong>issueYear</strong></div>
					  <div className="header"><strong>issueNumber</strong></div>
					  <div className="header"><strong>numChar</strong></div>
					  <div className="header"><strong>commonChar</strong></div>
					  <div className="header"><strong>description</strong></div>
			        </div>
			        <div className="comics-container" id="results">
			          {this.state.comics}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
