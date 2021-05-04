const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Recommendation 1) ---- */
app.get('/title', routes.getTitle);
app.get('/name', routes.getCharacter);

/* ---- (Recommendation 2) ---- */
app.get('/bestcomics/:title', routes.recComics);
app.get('/bestcharacters/:name', routes.recCharacters);

/* ---- (Power) ---- */
app.get('/power', routes.getAlignment);
app.get('/power/:align', routes.getTop30Sups);
app.get('/power/:align/:char', routes.getTopSupsPower);
app.get('/power/:align/:char/:char', routes.getScores);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});