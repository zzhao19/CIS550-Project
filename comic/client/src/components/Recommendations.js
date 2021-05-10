import React from 'react';
import PageNavbar from './PageNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../style/Recommendations.css';
import BestComicsRow from './BestComicsRow';
import BestCharactersRow from './BestCharactersRow';

import '../style/react-tabs.css';
import Select from "react-dropdown-select";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import SimpleImageSlider from "react-simple-image-slider";


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

  // on load retrive all comic titles and characters
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

  // handle comic and character selection events
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

  // pass in selected comic book title to query and retrive outputs
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
          console.log(err);
        });
	};

  // pass selected character name to query and retrive outputs
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

      // image urls for sliders
	    const comicimages = [
          {url: "https://static01.nyt.com/images/2018/05/15/learning/TeenTitansLN/TeenTitansLN-jumbo.jpg?quality=90&auto=webp"},
          {url: "https://www.verdict.co.uk/wp-content/uploads/2017/09/get-into-comic-books.jpg"},
          {url: "https://ichef.bbci.co.uk/news/976/cpsprodpb/154E4/production/_109086278_spidermanhulk976.jpg"},
          {url: "https://i.ytimg.com/vi/54rdv2WqURs/maxresdefault.jpg"},
          {url: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/08/2020-Comics-Cropped.jpg?q=50&fit=crop&w=960&h=500&dpr=1.5"},
        ];

	    const characterimages = [
          {url: "https://i.annihil.us/u/prod/marvel/i/mg/b/f0/5a6a3c922daf3/clean.jpg"},
          {url: "https://nerdist.com/wp-content/uploads/2020/04/DC-Comics-New-Comics-Header.jpg"},
          {url: "https://www.syfy.com/sites/syfy/files/styles/1200x680/public/2019/03/asm_newspaper_vol3_81-82-cover.jpg"},
          {url: "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/04/Iron-Man-Comic-Classic-Cover-Art.jpg"},
          {url: "https://assets1.ignimgs.com/2019/03/13/3yyrhsl-1552512066030.jpg"}
        ];

		return (
			<div className="Recommendations">
				<PageNavbar active="bestcomics" />
        <h1 class='text-center text-light'> <br/> Need Recommendations? </h1>
        
        {/* create tabs for both 
        comic recommendation and character recommendation*/}
        <Tabs>

            <TabList>
              <Tab>Recommend Some Comic Books</Tab>
              <Tab>Recommend Some Characters</Tab>
            </TabList>

            {/* first tab: recommend comics based on comic provided */}
            <TabPanel>
              <div className="container">
                <div class='row'>
                  <div class='col-md-8 col-lg-6'>
                    <div className="jumbotron jumbotron-comicsearch">
                      <div className="h5">Find the Best Comic Books For You  </div>
                      
                      {/* dropdown list properties*/}
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
                        <br/>
                        <button className="submit-btn" id="submitBtn" onClick={this.submitTitle}>Submit</button>
                    </div>
                  </div>

                  {/* slider properties */}
                  <div class='col-md-6 col-lg-6'>
                    <div className='container'>
                      <SimpleImageSlider
                      style={{ marginLeft: '8%', marginTop: '0%' }}
                      navStyle={2}
                      width={515}
                      height={248}
                      images={comicimages}
                      showBullets={true}
                      showNavs={true}
                      slideDuration={0.3}
                      />
                    </div>
                  </div>
                </div>

                {/* recommendation result container */}
                <div className="comics-container">
                  <div className="jumbotron jumbotron-comicsresult">
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

            {/* seond tab: recommending characters based on a chosen character */}
            <TabPanel>
              <div className="container">
                <div class='row'>
                  <div class='col-md-6 col-lg-6'>
                    <div className='container'>
                      {/* another image slider woohoo */}
                      <SimpleImageSlider
                      style={{ marginRight: '4%', marginTop: '0%' }}
                      navStyle={2}
                      width={515}
                      height={248}
                      images={characterimages}
                      showBullets={true}
                      showNavs={true}
                      slideDuration={0.3}
                      />
                    </div>
                  </div>

                  <div class='col-md-6 col-lg-6'>
                    <div className='container'>
                      <div className="jumbotron jumbotron-characterssearch">
                        <div className="h5">Find the Best Characters For You</div>
                        {/* character selection dropdown */}
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
                        <br/>
                        <button className="submit-btn" id="submitBtn" onClick={this.submitName}>Submit</button>
                      </div>
                    </div>
                  </div>    
                </div>

                <div className="characters-container">
                  <div className="jumbotron jumbotron-charactersresult">
                    <div className="character">
                      {/* use differently-centered header setups due to the variation in the length of output */}
                      <div className="header0"><strong>Name</strong></div>
                      <div className="header1"><strong># Matching Books</strong></div>
                      <div className="header1"><strong>Top Match Book</strong></div>
                      <div className="header1"><strong>Alignment</strong></div>
                      <div className="header2"><strong>Superpowers</strong></div>
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