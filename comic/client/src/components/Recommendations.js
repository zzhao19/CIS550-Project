import React from 'react';
import PageNavbar from './PageNavbar';
import BestComicsRow from './BestComicsRow';
import BestCharactersRow from './BestCharactersRow';
import '../style/BestComics.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Select from "react-dropdown-select";

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		    labelField: "props.value",
		    valueField: "props.value",
		    searchable: true,
			selectedTitle: "",
            selectedName: "",
			titles: [],
			comics: [],
			names: [],
			characters: []
		};

		this.submitTitle = this.submitTitle.bind(this);
		this.submitName = this.submitName.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
	};

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

        fetch("http://localhost:8081/name",{
          method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(namesList => {
          if (!namesList) return;

          const namesDivs = namesList.map((name, i) => (
            <option className="namesOption" key={i} value={name.name}>{name.name}</option>
          ));
          this.setState({
            names: namesDivs
          });
        }, err => {
          console.log(err);
        });
     };

	handleTitleChange(e){
		this.setState(
		    {selectedTitle:e[0].props.value},
		    ()=>console.log(this.state.selectedTitle)
		);
	};

	handleNameChange(e){
		this.setState(
		    {selectedName:e[0].props.value},
		    ()=>console.log(this.state.selectedName)
		);
	};

	submitTitle() {
	    const myUrlWithParams = `http://localhost:8081/bestcomics/${this.state.selectedTitle}`;

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
            issueNumber={comicObj.issueNumber}
            numChar={comicObj.NumCha}
            commonChar={comicObj.CommonCharacters}
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

	submitName() {
	    const myUrlWithParams = `http://localhost:8081/bestcharacters/${this.state.selectedName}`;

        console.log(myUrlWithParams)
        fetch(myUrlWithParams,
        {
          method:"GET"
        }).then(res => {return res.json();
        }, err => {console.log(err);
        }).then(charactersList => {if (!charactersList) return;
        console.log(charactersList)
        const charactersDivs = charactersList.map((characterObj, i) =>
          <BestCharactersRow
            name={characterObj.Name}
            numBooks={characterObj.numBooks}
            topMatchBook={characterObj.topMatchBook}
            alignment={characterObj.Alignment}
            superpowers={characterObj.Superpowers}
          />
        );

          this.setState({
            characters: charactersDivs
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
	};

	render() {

	    const{selectedTitle}=this.state;
	    const{selectedName}=this.state;

		return (
			<div className="Recommendations">

				<PageNavbar active="bestcomics" />

				<h1 class='text-center text-light'> <br/> NEED RECOMMENDATIONS? </h1>

                <Tabs>

                    <div className = 'TabList'>
                      <Tab>Recommend Some Comic Books</Tab>
                      <Tab>Recommend Some Characters</Tab>
                    </div>

                    <TabPanel>
                        <div className="container bestcomics-container">
                            <div className="jumbotron jumbotron-comicsearch">
                                <div className="h5">Best Comic Books For You</div>

                                    we

                                    <Select
                                        placeholder='Please select your favorite comic book title'
                                        options={this.state.titles}
                                        value={selectedTitle}
                                        searchable={this.state.searchable}
                                        labelField={this.state.labelField}
                                        valueField={this.state.valueField}
                                        onChange={this.handleTitleChange}
                                        id="titlesDropdown"
                                    />
                                    <button className="submit-btn" id="submitBtn" onClick={this.submitTitle}>Submit</button>
                            </div>

                            <div className="jumbotron">
                                <div className="comics-container">
                                    <div className="comic">
                                      <div className="header0"><strong>Title</strong></div>
                                      <div className="header1"><strong>Issue Year</strong></div>
                                      <div className="header1"><strong>Issue Number</strong></div>
                                      <div className="header1"><strong># Common Characters</strong></div>
                                      <div className="header2"><strong>Common Characters Names</strong></div>
                                    </div>
                            <div className="comics-container" id="results">
                              {this.state.comics}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="container bestcharacters-container">
                            <div className="jumbotron jumbotron-comicsresult">
                                <div className="h5">Best Characters For You</div>

                                    we

                                    <Select
                                        placeholder='Please select your favorite character name'
                                        options={this.state.names}
                                        value={selectedName}
                                        searchable={this.state.searchable}
                                        labelField={this.state.labelField}
                                        valueField={this.state.valueField}
                                        onChange={this.handleNameChange}
                                        id="namesDropdown"
                                    />

                                    <button className="submit-btn" id="submitBtn" onClick={this.submitName}>Submit</button>
                            </div>

                            <div className="jumbotron">
                                <div className="characters-container">
                                    <div className="characters">
                                      <div className="header"><strong>Name</strong></div>
                                      <div className="header"><strong>numBooks</strong></div>
                                      <div className="header"><strong>topMatchBook</strong></div>
                                      <div className="header"><strong>Alignment</strong></div>
                                      <div className="header"><strong>Superpowers</strong></div>
                                    </div>
                            <div className="characters-container" id="results">
                              {this.state.characters}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>


                </Tabs>
			</div>
		);
	};
};
