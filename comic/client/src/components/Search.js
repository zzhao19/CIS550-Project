import React from 'react';
import PageNavbar from './PageNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../style/Search.css';
import Top10SeriesRow from './Top10SeriesRow';
import AppearanceRow from './AppearanceRow';
import CharsFromTitleRow from './CharsFromTitleRow';

import '../style/react-tabs.css';
import Select from "react-dropdown-select";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';


export default class Search extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
      //first tab
      titles: [],
      selectedTitle: "",
      charsFromTitle: [],

      //appearance stuff
      eyeColors: [],
      hairColors: [],
      alignments: [],
      universes: [],
      genders: [],

      a: [],
      selectedEyeColor: "",
      selectedHairColor: "",
      selectedAlignment: "",
      selectedUniverse: "",
      selectedGender: "",

      //tab 2
      charName: "",
			top10series: [],

      //old
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

    //Appearance
    this.handleEyeChange = this.handleEyeChange.bind(this);
    this.handleHairChange = this.handleHairChange.bind(this);
    this.handleUniverseChange = this.handleUniverseChange.bind(this);
    this.handleAlignmentChange = this.handleAlignmentChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.submitAppearance = this.submitAppearance.bind(this);

    //tab 2
    this.handlecharNameChange = this.handlecharNameChange.bind(this);
    this.submitChar = this.submitChar.bind(this);

    //old
    this.submitTitle = this.submitTitle.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
	};

  /* on loading page, show options for
  eyecolor, haircolor, alignment, gender, and universe
  in dropdown lists for appearance search*/
	componentDidMount() {

      fetch("http://localhost:8081/title",{
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(titleList => {
        if (!titleList) return;

        const titleDivs = titleList.map((title, i) => (
          <option className="titleOption" key={i} value={title.title}>{title.title}</option>
        ));
        this.setState({
          titles: titleDivs
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

      //appearances
      fetch("http://localhost:8081/eyeColor",{
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(eyeColorsList => {
        if (!eyeColorsList) return;

        const eyeColorsDivs = eyeColorsList.map((eyeColor, i) => (
          <option className="eyeColorOption" key={i} value={eyeColor.EyeColor}>{eyeColor.EyeColor}</option>
        ));
        this.setState({
          eyeColors: eyeColorsDivs
        });
      }, err => {
        console.log(err);
      });

      fetch("http://localhost:8081/hairColor",{
        method: 'GET'
      }).then(res => {
       return res.json();
     }, err => {
       console.log(err);
     }).then(hairColorsList => {
       if (!hairColorsList) return;

       const hairColorsDivs = hairColorsList.map((hairColor, i) => (
         <option className="hairColorOption" key={i} value={hairColor.HairColor}>{hairColor.HairColor}</option>
       ));
       this.setState({
         hairColors: hairColorsDivs
       });
     }, err => {
       console.log(err);
     });

     fetch("http://localhost:8081/alignment",{
       method: 'GET'
     }).then(res => {
       return res.json();
     }, err => {
       console.log(err);
     }).then(alignmentList => {
       if (!alignmentList) return;

       const alignmentDivs = alignmentList.map((alignment, i) => (
         <option className="alignmentOption" key={i} value={alignment.Alignment}>{alignment.Alignment}</option>
       ));
       this.setState({
         alignments: alignmentDivs
       });
     }, err => {
       console.log(err);
     });

     fetch("http://localhost:8081/gender",{
       method: 'GET'
     }).then(res => {
       return res.json();
     }, err => {
       console.log(err);
     }).then(genderList => {
       if (!genderList) return;

       const genderDivs = genderList.map((gender, i) => (
         <option className="genderOption" key={i} value={gender.Gender}>{gender.Gender}</option>
       ));
       this.setState({
         genders: genderDivs
       });
     }, err => {
       console.log(err);
     });

     fetch("http://localhost:8081/universe",{
       method: 'GET'
     }).then(res => {
       return res.json();
     }, err => {
       console.log(err);
     }).then(universeList => {
       if (!universeList) return;

       const universeDivs = universeList.map((universe, i) => (
         <option className="universeOption" key={i} value={universe.Universe}>{universe.Universe}</option>
       ));
       this.setState({
         universes: universeDivs
       });
     }, err => {
       console.log(err);
     });
  };

  // handle the selection in the dropdown list
  handlecharNameChange(e) {
    this.setState(
      {charName:e[0].props.value},
      ()=>console.log(this.state.charName)
    );
  };

  handleTitleChange(e){
		this.setState(
		    {selectedTitle:e[0].props.value},
		    ()=>console.log(this.state.selectedTitle)
		);
	};

  // handlie appearance properties selection
  handleEyeChange(e){
    this.setState(
        {selectedEyeColor:e[0].props.value},
        ()=>console.log(this.state.selectedEyeColor)
    );
  };
  handleHairChange(e){
    this.setState(
        {selectedHairColor:e[0].props.value},
        ()=>console.log(this.state.selectedHairColor)
    );
  };
  handleUniverseChange(e){
    this.setState(
        {selectedUniverse:e[0].props.value},
        ()=>console.log(this.state.selectedUniverse)
    );
  };
  handleAlignmentChange(e){
    this.setState(
        {selectedAlignment:e[0].props.value},
        ()=>console.log(this.state.selectedAlignment)
    );
  };
  handleGenderChange(e){
    this.setState(
        {selectedGender:e[0].props.value},
        ()=>console.log(this.state.selectedGender)
    );
  };

  /* pass in the selected appearance properties to the query 
  for search results*/
  submitAppearance() {
      const myUrlWithParams = `http://localhost:8081/search/${this.state.selectedEyeColor}/${this.state.selectedGender}/${this.state.selectedHairColor}/${this.state.selectedAlignment}/${this.state.selectedUniverse}`;

        console.log(myUrlWithParams)
        fetch(myUrlWithParams,
        {
          method:"GET"
        }).then(res => {return res.json();
        }, err => {console.log(err);
        }).then(appearanceList => {if (!appearanceList) return;
        console.log(appearanceList)
        const appearanceDivs = appearanceList.map((appearance, i) =>
          <AppearanceRow
            Character={appearance.Character}
          />
        );

          this.setState({
            a: appearanceDivs
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
  };

  // pass in the selected comic book title for character info
  submitTitle() {
      const myUrlWithParams = `http://localhost:8081/search/charsFromTitle/${this.state.selectedTitle}`;

        console.log(myUrlWithParams)
        fetch(myUrlWithParams,
        {
          method:"GET"
        }).then(res => {return res.json();
        }, err => {console.log(err);
        }).then(charsFromTitleList => {if (!charsFromTitleList) return;
        console.log(charsFromTitleList)
        const charsFromTitleDivs = charsFromTitleList.map((charsFromTitleObj, i) =>
          <CharsFromTitleRow
            Character={charsFromTitleObj.Character}
            Alignment={charsFromTitleObj.Alignment}
            Gender={charsFromTitleObj.Gender}
            Status={charsFromTitleObj.Status}
            Appearances={charsFromTitleObj.Appearances}
          />
        );

          this.setState({
            charsFromTitle: charsFromTitleDivs
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
  };

  // pass in the selected character to query the comics they are in
  submitChar() {

		fetch(`http://localhost:8081/search/${this.state.charName}`, {
			method: "GET"
		})
			.then(res => res.json())
			.then(top10seriesList => {
				console.log(top10seriesList); //displays our JSON object in the console
				let top10seriesDivs = top10seriesList.map((series, i) =>

          <Top10SeriesRow
            title={series.title}
            num={series.num}
          />
				);

				// This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					top10series: top10seriesDivs
				});
			})
			.catch(err => console.log(err))
	};

	render() {

	    const{selectedTitle}=this.state;
	    const{selectedName}=this.state;
      const{charName}=this.state;
	    const{selectedEyeColor}=this.state;
      const{selectedHairColor}=this.state;
	    const{selectedGender}=this.state;
      const{selectedAlignment}=this.state;
      const{selectedUniverse}=this.state;

		return (
			<div className="Search">
				<PageNavbar active="search " />
				<h1 class='text-center text-light'> <br/> Search </h1>

        {/* setup the tabs for each function */}
        <Tabs>

            {/* 3 major search function pages */}
            <TabList>
              <Tab>Search by Appearance</Tab>
              <Tab>Search for Comic Book Series by Character</Tab>
              <Tab>Search for Character by Comic Book</Tab>
            </TabList>

            {/* first tab panel: search for characters by appearance features */}
            <TabPanel>
                <div className="container appearance-container">
                  <div class='row'>
                    <div class='col-lg-7'>
                      <div className="jumbotron jumbotron-appearancesearch">
                        <div className="h5">Select an appearance! </div>
                        <div className="h6">This will return the top 20 characters by appearance with the selected features. </div>

                          {/* for each appearance feature use a dropdown list for selection */}
                          <Select
                              placeholder='Please select eye color'
                              options={this.state.eyeColors}
                              value={this.state.selectedEyeColor}
                              searchable={this.state.searchable}
                              labelField={this.state.labelField}
                              valueField={this.state.valueField}
                              onChange={this.handleEyeChange}
                              id="eyeColorDropdown"
                          />
                          <br></br>
                          <Select
                              placeholder='Please select hair color'
                              options={this.state.hairColors}
                              value={this.state.selectedHairColor}
                              searchable={this.state.searchable}
                              labelField={this.state.labelField}
                              valueField={this.state.valueField}
                              onChange={this.handleHairChange}
                              id="hairColorDropdown"
                          />
                          <br></br>
                          <Select
                              placeholder='Please select alignment'
                              options={this.state.alignments}
                              value={this.state.selectedAlignment}
                              searchable={this.state.searchable}
                              labelField={this.state.labelField}
                              valueField={this.state.valueField}
                              onChange={this.handleAlignmentChange}
                              id="alignmentDropdown"
                          />
                          <br></br>
                          <Select
                              placeholder='Please select gender'
                              options={this.state.genders}
                              value={this.state.selectedGender}
                              searchable={this.state.searchable}
                              labelField={this.state.labelField}
                              valueField={this.state.valueField}
                              onChange={this.handleGenderChange}
                              id="genderDropdown"
                          />
                          <br></br>
                          <Select
                              placeholder='Please select universe'
                              options={this.state.universes}
                              value={this.state.selectedUniverse}
                              searchable={this.state.searchable}
                              labelField={this.state.labelField}
                              valueField={this.state.valueField}
                              onChange={this.handleUniverseChange}
                              id="universeDropdown"
                          />
                          <br/>
                          {/* define a submit button that trigers query */}
                          <button className="submit-btn" id="submitBtn" onClick={this.submitAppearance}> Submit </button>
                            </div>
                          </div>

                          {/* container for appearance search results */}
                          <div class='col-lg-5'>
                            <div className="appearance-container">
                              <div className="jumbotron jumbotron-appearanceresult">
                                <div className="appearance">
                                  <div className="header0"><strong>Character</strong></div>
                                </div>
                                <div className="appearance-container" id="results">
                                  {this.state.a}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
            </TabPanel>

            {/* second tab: search for characters by characters */}
            <TabPanel>
              <div className="container top10series-container">
                <div class='row'>
                  <div class='col-md-8 col-lg-8'>
                    <div className="jumbotron jumbotron-seriessearch">
                      <div className="h5">Search for the series a character appears in most!</div>
                      <div className="h6">This will return the top 10 most appeared in series a character is in. </div>

                        {/* selection dropdown list for comic selection */}
                        <Select
                            placeholder='Please select your favorite character name'
                            options={this.state.names}
                            value={this.state.selectedName}
                            searchable={this.state.searchable}
                            labelField={this.state.labelField}
                            valueField={this.state.valueField}
                            onChange={this.handlecharNameChange}
                            id="charNamesDropdown"
                        />
                        <br/>
                        <button className="submit-btn" id="submitBtn" onClick={this.submitChar}>Submit</button>
                    </div>
                  </div>
                  
                  <div class='col-md-4 col-lg-4'>

                    {/* insert a gif for styling */}
                    <div>
                      <img src='https://media1.giphy.com/media/10bKPDUM5H7m7u/giphy.gif' height="276" width="100%"></img>
                    </div>
                  </div>
                </div>
                
                {/* search result display container */}
                <div className="jumbotron jumbotron-seriesresult">
                  <div className="top10series-container">
                    <div className="series">
                      <div className="header0"><strong>Series Title</strong></div>
                      <div className="header1"><strong>Number of Appearances</strong></div>
                    </div>
                    <div className="top10series-container" id="results">
                      {this.state.top10series}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* third tab: search for comics by characters */}
            <TabPanel>
              <div className="container charsFromTitle-container">
                <div class='row'>

                  {/* gif for styling */}
                  <div class='col-md-4 col-lg-4'>
                    <div>
                      <img src='https://media.tenor.com/images/bc1d387e3362076edc5be2a61389466e/tenor.gif' height="276" width="100%"></img>
                    </div>
                  </div>
                  
                  {/* search comic dropdown list container */}
                  <div class='col-md-8 col-lg-8'>
                    <div className="jumbotron jumbotron-charssearch">
                      <div className="h5">Search for the series a character appears in most!</div>
                      <div className="h6">(Complicated query, please give a few seconds to load!)</div>
                      <Select
                          placeholder='Please select your favorite book title'
                          options={this.state.titles}
                          value={this.state.selectedTitle}
                          searchable={this.state.searchable}
                          labelField={this.state.labelField}
                          valueField={this.state.valueField}
                          onChange={this.handleTitleChange}
                          id="charNamesDropdown"
                      />
                      <br/>
                      <button className="submit-btn" id="submitBtn" onClick={this.submitTitle}>Submit</button>
                    </div>
                  </div>
                </div>
                
                {/* character search output container */}
                <div className="jumbotron jumbotron-charsresult">
                  <div className="charsFromTitle-container">
                    <div className="charSeries">
                      <div className="header0"><strong>Character</strong></div>
                      <div className="header1"><strong>Alignment</strong></div>
                      <div className="header2"><strong>Gender</strong></div>
                      <div className="header3"><strong>Status</strong></div>
                      <div className="header4"><strong>Appearances</strong></div>
                    </div>
                    <div className="charsFromTitle-container" id="results">
                      {this.state.charsFromTitle}
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
