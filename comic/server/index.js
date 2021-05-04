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

/* ---- (Best Movies) ---- */
app.get('/title', routes.getTitle);
app.get('/name', routes.getCharacter);

/* ---- Q3b (Best Movies) ---- */
app.get('/bestcomics/:title', routes.recComics);
app.get('/bestcharacters/:name', routes.recCharacters);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});