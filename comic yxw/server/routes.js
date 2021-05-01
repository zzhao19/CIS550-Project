const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- Q1a (Dashboard) ---- */
// Equivalent to: function getTop20Keywords(req, res) {}
const getTop20Keywords = (req, res) => {
  const query = `
    SELECT kwd_name
    FROM movie_keyword
    GROUP BY kwd_name
    ORDER BY COUNT(*) DESC
    LIMIT 20;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
  const keyword = req.params.keyword;

  const query =`
    SELECT title, rating, num_ratings
    FROM movie
    WHERE movie_id IN
        (
        SELECT movie_id
        FROM movie_keyword
        WHERE kwd_name = '${keyword}'
        )
    ORDER BY rating DESC, num_ratings DESC
    LIMIT 10;
    `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
  const movieName = req.params.movieName;

  const query =`
    WITH temp1 AS
        (
        SELECT *
        FROM movie
        WHERE title='${movieName}'
        ORDER BY release_year DESC
        LIMIT 1
        ),

    temp2 AS
        (
        SELECT cast_id
        FROM cast_in
        WHERE movie_id = (SELECT movie_id FROM temp1)
        ),

    temp3 AS
        (
        SELECT c.*
        FROM cast_in c
        WHERE c.cast_id IN (SELECT cast_id FROM temp2)
        ),

    temp4 AS
        (
        SELECT movie_id, COUNT(*) AS num
        FROM temp3
        WHERE movie_id != (SELECT movie_id FROM temp1)
        GROUP BY movie_id
        ORDER BY num DESC
        )

    SELECT m. title, m.movie_id, m.rating, m.num_ratings
    FROM movie m
    JOIN temp4 t ON m.movie_id = t.movie_id
    ORDER BY t.num DESC, m.rating DESC, m.num_ratings DESC
    LIMIT 10;
    `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

/* -------------- Recommend Comics ----------------*/
const getTitle = (req, res) => {
  const query = `
    SELECT DISTINCT title
    FROM Comics
    ORDER BY title ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getYear= (req, res) => {
  const query = `
    SELECT DISTINCT issueYear
    FROM Comics
    ORDER BY issueYear ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getNumber = (req, res) => {
  const query = `
    SELECT DISTINCT issueNumber
    FROM Comics
    ORDER BY issueNumber ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getVersion = (req, res) => {
  const query = `
    SELECT DISTINCT version
    FROM Comics
    ORDER BY version ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const recComics = (req, res) => {
  const comicTitle = req.params.title;
  const comicYear = req.params.year;
  const comicNumber = req.params.number;
  const comicVersion = req.params.version;

  const query =`
    WITH temp1 AS
        (
        SELECT DISTINCT comicID
        FROM Comics
        WHERE title = '${comicTitle}'
        AND issueYear = '${comicYear}'
        AND issueNumber = '${comicNumber}'
        AND version = '${comicVersion}'
        ),

    temp2 AS
        (
        SELECT characterID
        FROM Chatocomics
        WHERE comicID = (SELECT comicID FROM temp1)
        ),

    temp3 AS
        (
        SELECT comicID, COUNT(*) AS NumCha
        FROM Chatocomics c JOIN temp2 t2 ON c.characterID = t2.characterID
        WHERE comicID != (SELECT comicID FROM temp1)
        GROUP BY c.comicID
        ORDER BY COUNT(*) DESC
        LIMIT 20
        ),

    temp4 AS
        (
        SELECT t3.comicID, NumCha, name
        FROM temp3 t3 JOIN Chatocomics c ON t3.comicID = c.comicID
        JOIN Characters ch ON c.characterID = ch.characterID
        WHERE c.characterID IN (SELECT characterID FROM temp2)
        ),

    temp5 AS
        (
        SELECT comicID, NumCha, GROUP_CONCAT(name) AS CommonCharacters
        FROM temp4
        GROUP BY comicID, NumCha
        )

    SELECT title, issueYear, issueNumber, NumCha, CommonCharacters, description
    FROM temp5 t5 JOIN Comics c ON t5.comicID = c.comicID
    ORDER BY NumCha DESC, issueYear DESC;
    `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* -------------- Recommend Characters ----------------*/

const getCharacter = (req, res) => {
  const query = `
    SELECT name
    FROM Characters
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


const recCharacters = (req, res) => {
  const chaName = req.params.chaName;

  const query = `
    WITH temp1 AS
        (
        SELECT DISTINCT characterID
        FROM Characters
        WHERE name = '${chaName}'
        ),

    temp2 AS
        (
        SELECT comicID
        FROM Chatocomics
        WHERE characterID = (SELECT characterID from temp1)
        ),

    temp3 AS
        (
        SELECT c.characterID, name, COUNT(*) AS numBooks
        FROM Chatocomics c JOIN temp2 t2 ON c.comicID = t2.comicID
        JOIN Characters ch ON c.characterID = ch.characterID
        WHERE c.characterID != (SELECT characterID FROM temp1)
        GROUP BY c.characterID
        ORDER BY COUNT(*) DESC
        LIMIT 20
        ),

    temp4 AS
        (
        SELECT name, numBooks, title, COUNT(*) AS num
        FROM Chatocomics ch JOIN temp3 t3 ON ch.characterID = t3.characterID
        JOIN Comics c ON ch.comicID = c.comicID
        WHERE c.comicID IN (SELECT comicID FROM temp2)
        GROUP BY name, numBooks, title
        ORDER BY num DESC
        ),

    temp5 AS
        (
        SELECT t4.name, t4.numBooks, t4.title AS topMatchBook
        FROM temp4 t4
        LEFT OUTER JOIN temp4 t44
        ON t4.name = t44.name AND t4.numBooks = t44.numBooks AND t4.num < t44.num
        Where t44.name IS NULL
        ),

    temp6 AS
        (
        SELECT t5.name, c.Alignment, c.Gender, c.EyeColor, c.HairColor, c.Race, c.Publisher, c.Height, c.Weight,
        ch.Intelligence, ch.Strength, ch.Speed, ch.Durability, ch.Power, ch. Combat, p.Power AS Superpower, t5.numBooks, t5.topMatchBook
        FROM temp5 t5 LEFT JOIN Chadetail c ON t5.name = c.Name
        LEFT JOIN Chastats ch ON c.Name = ch.Name
        LEFT JOIN Power p ON ch.Name = p.Name
        ),

    temp7 AS
        (
        SELECT t6.*, GROUP_CONCAT(Superpower) AS Superpowers
        FROM temp6 t6
        GROUP BY name
        )

    SELECT name AS Name, numBooks, topMatchBook, Alignment, Gender, EyeColor, HairColor, Race, Publisher,
    Height, Weight, Intelligence, Strength, Speed, Durability, Power, Combat, Superpowers
    FROM temp7
    ORDER BY numBooks DESC;
    `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {console.log(rows);
        res.json(rows);}
  });
};

module.exports = {
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
    getTitle: getTitle,
	getYear: getYear,
	getNumber: getNumber,
    getVersion: getVersion,
    recComics: recComics,
    getCharacter: getCharacter,
    recCharacters: recCharacters
};