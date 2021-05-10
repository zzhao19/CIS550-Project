const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Recommendation --------------- */
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
        LIMIT 10
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
    SELECT *
    FROM Characters
    WHERE characterID IN
        (
        SELECT characterID
        FROM Chatocomics
        GROUP BY characterID
        HAVING COUNT(*)>1
        )
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
        LIMIT 10
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


/* -------------------------------------------------- */
/* ----------------------- Power -------------------- */
/* -------------------------------------------------- */

const getAlignment = (req, res) => {

  const query = `

    with t as (select distinct Alignment 
               from Charinfo 
               order by Alignment desc
               limit 4)

    select Alignment as alignment
    from t 
    order by Alignment
    limit 3;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};

const getAlignAvg = (req, res) => {

  const alignInput = req.params.align;

  const query = `
    with t as (select c.*, ci.alignment
      from Chastats c
      join Charinfo ci
      on c.Name = ci.Character)
      
      t2 as (select Alignment, Category, round(avg(Score),2) Average
      from t 
      where Category<>'Total' and Alignment <> '' 
      group by Alignment, Category)

      select Category, Average
      from t2 
      where Alignment = '${alignInput}'
      order by Category;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};


const getTop30Sups = (req, res) => {
  const alignInput = req.params.align;

  const query = `
  with t as (select c.Character cha, Alignment, count(*) cnt 
            from Charinfo  c
            where Alignment <> '' and OtherInfo = ''
            group by cha, Alignment 
            order by cnt desc),
      
      t2 as (select cha, Alignment, cnt, 
                    row_number() over(partition by cha order by cnt desc, Alignment) rnk
            from t),
      
      t3 as (select characterID, count(distinct comicID) cnt
            from Chatocomics
            group by characterID),
      
      t4 as (select t3.cnt, c.Name
            from t3
            join Characters c
            using(characterID)),
      
      t5 as (select * 
            from t2 
            where rnk = 1),
      
      t6 as (select t4.*, t5.Alignment
            from t4
            join t5
            on t4.Name = t5.cha)

  select Name as name 
  from t6
  where Alignment = '${alignInput}'
  order by cnt desc
  limit 30;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};


const getTopSupsPower = (req, res) => {

  const supInput = req.params.char;


  const query = `
    select power
    from Power p 
    where p.name = '${supInput}';
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};


const getScores = (req, res) => {

  const supInput = req.params.char;

  const query = `
    select c.Category, Score
    from Chastats c
    where c.Name = '${supInput}' and c.Category <> 'Total'
    order by Category;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};


/* -------------------------------------------------- */
/* ----------------------- Movie -------------------- */
/* -------------------------------------------------- */
const getMovies = (req, res) => {

  console.log('we are here')

  const query = `
    SELECT DISTINCT movie FROM CastIn;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};

const getSimilarComics = (req, res) => {

  const title = req.params.movie;

  const query = `
    WITH temp AS (
    SELECT c.characterID, cc.comicID
    FROM CastIn c
    JOIN Chatocomics cc on c.characterID = cc.characterID
    WHERE c.Movie = '${title}'
    )

    SELECT cc.Title, cc.issueYear, cc.issueNumber, cc.description
    FROM CastIn c
    JOIN temp t ON c.characterID = t.characterID
    JOIN Comics cc on t.comicID = cc.comicID
    WHERE c.Movie LIKE '%${title}%'
    GROUP BY cc.comicID
    ORDER BY COUNT(*) DESC
    LIMIT 10;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};

  const getAlternate = (req, res) => {

      const title = req.params.movie;

      const query = `
        (WITH t1 as (SELECT DISTINCT cc.comicID as comicID
        FROM CastIn c
        JOIN Chatocomics cc on c.characterID = cc.characterID
        WHERE c.Movie = '${title}'),

        t2 AS(SELECT DISTINCT cc.characterID, cc.comicID, Characters.name
        FROM Chatocomics cc
        JOIN Characters on Characters.characterID = cc.characterID
        WHERE cc.comicID IN (SELECT comicID FROM t1 )),

        t3 AS(SELECT cd.Alignment, t2.characterID, t2.comicID, t2.name
            FROM Chadetail cd JOIN t2 on t2.name= cd.Name
            WHERE cd.Alignment <> 'Neutral')
        SELECT DISTINCT name, alignment as alignment FROM t3
        WHERE alignment = 'good'
        ORDER BY RAND()
        LIMIT 3)
        UNION
        (SELECT DISTINCT name, alignment as alignment FROM t3
        WHERE alignment = 'bad'
        ORDER BY RAND()
        LIMIT 3);`
      ;

      connection.query(query, function(err, rows, fields){
        if (err) console.log(err);
        else {
          console.log(rows);
          res.json(rows);
        }
      })
};



/* -------------------------------------------------- */
/* ----------------------- Search -------------------- */
/* -------------------------------------------------- */
//appearance queries
const getEyeColor = (req, res) => {
  const query = `
    SELECT DISTINCT ci.EyeColor
    FROM Charinfo ci
    WHERE ci.EyeColor != ""
    ORDER BY EyeColor ASC;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);

    else
    console.log(rows);
    res.json(rows);
  });
};

const getHairColor = (req, res) => {
  const query = `
    SELECT DISTINCT ci.HairColor
    FROM Charinfo ci
    WHERE ci.HairColor != ""
    ORDER BY HairColor ASC;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getAlignmentAppearance = (req, res) => {
  const query = `
    SELECT DISTINCT ci.Alignment
    FROM Charinfo ci
    WHERE ci.Alignment != ""
    ORDER BY Alignment ASC;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getGender = (req, res) => {
  const query = `
    SELECT DISTINCT ci.Gender
    FROM Charinfo ci
    WHERE ci.Gender != ""
    ORDER BY Gender ASC;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getUniverse = (req, res) => {
  const query = `
    SELECT DISTINCT ci.Universe
    FROM Charinfo ci
    WHERE ci.Universe != ""
    ORDER BY Universe ASC;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const top10Series = (req, res) => {
    console.log('GET RECSDT');
    var charName = req.params.charName;
    console.log(charName);
    var query = `
    WITH temp1 AS (
      SELECT characterID
      FROM Characters
      WHERE name = '${charName}'
    ),
    temp2 AS (
      SELECT c.comicID
      FROM Chatocomics c
      JOIN temp1 t1 ON c.characterID = t1.characterID)
    SELECT c.title, COUNT(*) AS num
    FROM Comics c JOIN temp2 t2
    ON c.comicID = t2.comicID
    GROUP BY c.title
    ORDER BY num DESC
    LIMIT 10;`;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log('FINISHED QUERYING');
      console.log(rows);
      res.json(rows);
    }
  });
};

const appearance = (req, res) => {
  var eyeColor = req.params.eyeColor;
  var gender = req.params.gender;
  var alignment = req.params.alignment;
  var hairColor = req.params.hairColor;
  var universe = req.params.universe;

  var query = `
    SELECT DISTINCT ci.Character
    FROM Charinfo ci
    WHERE EyeColor = '${eyeColor}'
    AND Gender = '${gender}'
    AND HairColor = '${hairColor}'
    AND Alignment = '${alignment}'
    AND Universe = '${universe}'
    ORDER BY Appearances DESC
    LIMIT 20;`;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log('FINISHED QUERYING');
      console.log(rows);
      res.json(rows);
    }
  });
};


const charsFromTitle = (req, res) => {
  var title = req.params.titleName;
  console.log('in the thing')

  var query = `
      WITH temp1 AS (
            SELECT DISTINCT comicID
            FROM Comics
            WHERE title = '${title}'
            ),
            temp2 AS (
            SELECT DISTINCT ct.characterID, c.name
            FROM Chatocomics ct
            JOIN temp1 t1 ON t1.comicID = ct.comicID
            JOIN Characters c ON c.characterID = ct.characterID
            )
            SELECT DISTINCT ci.Character, ci.Alignment, ci.Gender, ci.Status, ci.Appearances
            FROM Charinfo ci, temp2 t2
            WHERE t2.name LIKE CONCAT('%', ci.Character, '%')
            ORDER BY ci.Appearances DESC;`;

    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
          console.log('FINISHED QUERYING');
          console.log(rows);
          res.json(rows);
        }
      });
};

module.exports = {
    getTitle: getTitle,
    recComics: recComics,
    getCharacter: getCharacter,
    recCharacters: recCharacters,
    getAlignment: getAlignment,
    getAlignAvg: getAlignAvg,
    getTop30Sups: getTop30Sups,
    getTopSupsPower: getTopSupsPower,
    getScores: getScores,
    getSimilarComics: getSimilarComics,
    getMovies: getMovies,
    getAlternate: getAlternate,
    top10Series: top10Series,
    appearance: appearance,
    getEyeColor : getEyeColor,
    getHairColor : getHairColor,
    getAlignmentAppearance : getAlignmentAppearance,
    getUniverse : getUniverse,
    getGender : getGender,
    charsFromTitle : charsFromTitle
};