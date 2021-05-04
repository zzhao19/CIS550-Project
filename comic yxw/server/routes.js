const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getTitle = (req, res) => {
  const query = `
    SELECT DISTINCT title
    FROM Comics
    WHERE comicID IN
        (
        SELECT comicID
        FROM Chatocomics
        GROUP BY comicID
        HAVING COUNT(*)>3
        )
    ORDER BY title;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const recComics = (req, res) => {
  const comicTitle = req.params.title;

  const query =`
     WITH temp1 AS
        (
        SELECT comicID
        FROM Comics
        WHERE title = '${comicTitle}'
        ),

    temp2 AS
        (
        SELECT DISTINCT characterID
        FROM Chatocomics
        WHERE comicID IN (SELECT comicID FROM temp1)
        ),

    temp3 AS
        (
        SELECT comicID, COUNT(*) AS NumCha
        FROM Chatocomics c JOIN temp2 t2 ON c.characterID = t2.characterID
        WHERE comicID NOT IN (SELECT comicID FROM temp1)
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

    SELECT title, issueYear, issueNumber, NumCha, CommonCharacters
    FROM temp5 t5 JOIN Comics c ON t5.comicID = c.comicID
    ORDER BY NumCha DESC, issueYear DESC;
    `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


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
  const chaName = req.params.name;

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
        SELECT t5.name, c.Alignment,
        p.Power AS Superpower, t5.numBooks, t5.topMatchBook
        FROM temp5 t5 LEFT JOIN Chadetail c ON t5.name = c.Name
        LEFT JOIN Power p ON c.Name = p.Name
        ),

    temp7 AS
        (
        SELECT t6.*, GROUP_CONCAT(Superpower) AS Superpowers
        FROM temp6 t6
        GROUP BY name
        )

    SELECT name AS Name, numBooks, topMatchBook, Alignment, Superpowers
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
    getTitle: getTitle,
    recComics: recComics,
    getCharacter: getCharacter,
    recCharacters: recCharacters
};