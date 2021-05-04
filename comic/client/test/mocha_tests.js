'use strict';

const {TOP_20_KEYWORDS, TOP_10, RECOMMEND, BEST_DECADEGENRES} = require('./validationData.js');
// const {TOP_20_KEYWORDS, TOP_10, RECOMMEND, BEST_OF} = require('./errorData.js');


const assert = require('assert');
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

/* ---------- Q1 (Dashboard) Tests ---------- */
describe('Dashboard page', () => {

  it('should automatically load all keyword buttons', (async () => {
      let driver = await new webdriver.Builder()
          .withCapabilities(webdriver.Capabilities.chrome())
          .build();
      try {
          await driver.get('http://localhost:3000/');
          for (const keyword of TOP_20_KEYWORDS) {
            // console.log(`------- Q1a: Testing that Button for Keyword = ${keyword} Exists -------`);
            await driver.wait(until.elementLocated(By.id(`button-${keyword}`)), 3000);
            const randButton = await driver.findElement(By.id(`button-${keyword}`));
            const buttonText = await randButton.getText();
            await randButton.click();
            // console.log(`Test: ${buttonText} == ${keyword}`);
            assert.equal(buttonText, keyword);
          }
        } finally {
          await driver.quit();
        }
    })
  );

  it('should display the top 10 movies of the keyword the user clicks', (async () => {
      let driver = await new webdriver.Builder()
          .withCapabilities(webdriver.Capabilities.chrome())
          .build();
      try {
          await driver.get('http://localhost:3000/');
          for (const keyword in TOP_10) {
            await driver.wait(until.elementLocated(By.id(`button-${keyword}`)), 10000);
            const button = await driver.findElement(By.id(`button-${keyword}`));
            await button.click();
            await driver.sleep(4000); // Wait for top movies to load.
            var results = await driver.findElements(By.css('.movie'));
            await validateTopMovies(keyword, results);
          }
        } finally {
          await driver.quit();
        }
    })
  );

  async function validateTopMovies(keyword, result) {
    // console.log(`------- Q1b: Testing Keyword = ${keyword} -------`);
    const top10 = JSON.parse(TOP_10[keyword]);
    for (const i in result) {
      const title = await result[i].findElement(By.className('title')).getText();
      const rating = await result[i].findElement(By.className('rating')).getText();
      const votes = await result[i].findElement(By.className('votes')).getText();
      // console.log(`Test: ${title} == ${top10[i]['title']}`);
      assert.equal(title, top10[i]['title']);
      assert.equal(rating, top10[i]['rating']);
      assert.equal(votes, top10[i]['num_ratings']);
    }
  }

});

/* ---------- Q2 (Recommendation Page) Tests ---------- */

describe('Recommendation page', () => {

  it('should return the correct recommendations for a given user-inputted movie', (async () => {
      let driver = await new webdriver.Builder()
          .withCapabilities(webdriver.Capabilities.chrome())
          .build();
      try {
          for (const title of Object.keys(RECOMMEND)) {
            await driver.get('http://localhost:3000/recommendations');
            const inputBox = await driver.findElement(By.id('movieName'));
            // Type in the movie title
            await inputBox.sendKeys(title);
            const submitButton = await driver.findElement(By.id('submitMovieBtn'));
            // Click Submit
            await submitButton.click();
            // Wait until the query results show up (will timeout after 60 seconds)
            await driver.wait(until.elementLocated(By.css('.movieResults')), 60000);
            const results = await driver.findElements(By.css('.movieResults'));
            await validateRecommendedMovies(title, results);
          }
        } finally {
          await driver.quit();
        }
    })
  );

  async function validateRecommendedMovies(title, results) {
    // console.log(`------- Q2: Testing Title = ${title} -------`);
    const expectedIds = RECOMMEND[title];
    for (const i in results) {
      const observedId = await results[i].findElement(By.css('.id')).getText();
      // console.log(`Test: ${observedId} == ${expectedIds[i]}`);
      assert.equal(parseInt(observedId), expectedIds[i]);
    }
  }

});

/* ---------- Q3 (Best of Decades Page) Tests ---------- */
describe('Best of Decade and Genre page', () => {

  it('should return the correct dropdowns for decades and genres, and the correct movies after submit', (async () => {
      let driver = await new webdriver.Builder()
          .withCapabilities(webdriver.Capabilities.chrome())
          .build();
      try {
          for (const decadegenre of Object.keys(BEST_DECADEGENRES)) {
            const selectedDecade = decadegenre.substring(0,4);
            const selectedGenre = decadegenre.substring(5);
            await driver.get('http://localhost:3000/bestmovies');
            await driver.sleep(2000); // Wait for decades to load.
            const dropdown = await driver.findElement(By.id('decadesDropdown'));
            await dropdown.click();
            await driver.sleep(2000); // Wait for options to populate
            const dropdown1_results = await driver.findElements(By.className('decadesOption'));
            await dropdown.sendKeys(selectedDecade);
            const dropdown2 = await driver.findElement(By.id('genresDropdown'));
            await dropdown2.click();
            await driver.sleep(2000); // Wait for options to populate
            const dropdown2_results = await driver.findElements(By.className('genresOption'));
            await dropdown2.sendKeys(selectedGenre);
            const submitButton = await driver.findElement(By.id('submitBtn'));
            await submitButton.click();
            await driver.wait(until.elementLocated(By.className('movieResults')), 60000);
            const results = await driver.findElements(By.className('movieResults'));
            await validateDecadeResults(decadegenre, results, dropdown1_results, dropdown2_results);
          }
        } finally {
          await driver.quit();
        }
    })
  );

  async function validateDecadeResults(decadegenre, results, dropdown1_results, dropdown2_results) {
    // console.log(`------- Q3: Testing Decade = ${decade} -------`);
    const expectedResults = JSON.parse(BEST_DECADEGENRES[decadegenre]);
    var decadesOptions = [1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 
      1950, 1960, 1970, 1980, 1990, 2000, 2010]
    for (const i in dropdown1_results) {
      const observedOption = await dropdown1_results[i].getText();
      assert.equal(observedOption, decadesOptions[i])
    }
    var genresOptions = ["Action","Adult","Adventure","Animation","Biography","Comedy","Crime",
    "Documentary","Drama","Family","Fantasy","Film-Noir","Game-Show","History","Horror","Music",
    "Musical","Mystery","News","Reality-TV","Romance","Sci-Fi","Short","Sport","Talk-Show",
    "Thriller","War","Western"];
    for (const i in dropdown2_results) {
      const observedOption = await dropdown2_results[i].getText();
      assert.equal(observedOption, genresOptions[i])
    }
    for (const i in results) {
      const observedId = await results[i].findElement(By.className('id')).getText();
      const observedTitle = await results[i].findElement(By.className('title')).getText();
      const observedRating = await results[i].findElement(By.className('rating')).getText();
      // console.log(`Test: ${observedTitle} == ${expectedResults[i]['title']}`);
      assert.equal(observedId, expectedResults[i]['movie_id']);
      assert.equal(observedTitle, expectedResults[i]['title']);
      assert.equal(observedRating, expectedResults[i]['rating']);
    }
    
  }

});

// Resources:
// https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
// https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Your_own_automation_environment
// https://seleniumhq.github.io/selenium/docs/api/javascript/index.html
// https://www.npmjs.com/package/selenium-webdriver
// https://mochajs.org/#using-async-await
