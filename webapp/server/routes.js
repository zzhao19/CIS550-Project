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
    select kwd_name
    from movie_keyword
    group by kwd_name
    order by count(*) desc
    limit 20;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  })
};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
  const keywordInput = req.params.keyword;
  // console.log(keywordInput);

  const query = `
    select m.title, m.rating, m.num_ratings
    from movie m
    join movie_keyword k
    on m.movie_id = k.movie_id
    where k.kwd_name = '${keywordInput}'
    order by m.rating desc, m.num_ratings desc
    limit 10;
  `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};


/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
  const titleInput = req.params.title;
  console.log(titleInput);
  const query = `
    with t as (select movie_id 
               from movie
               where title = '${titleInput}'
               order by release_year desc
               limit 1),

         t2 as (select distinct cast_id
                from cast_in
                where movie_id = (select * from t)),

         t3 as (select movie_id, count(charac) cnt
                from cast_in
                where cast_id in (select * from t2) and movie_id <> (select * from t)
                group by movie_id)
    
    select title, m.movie_id, rating, num_ratings
    from movie m
    join t3
    on m.movie_id = t3.movie_id
    order by t3.cnt desc, m.rating desc, m.num_ratings desc
    limit 10;
  `

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
  const query = `
    select distinct floor(release_year/10)*10 decade
    from movie
    order by decade;
  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- (Best Movies) ---- */
const getGenres = (req, res) => {
  const query = `
    SELECT name
    FROM genre
    WHERE name <> 'genres'
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {
  const decadeInput = req.params.decade;
  const genreInput = req.params.genre;

  const query = `
    with t as (select m.movie_id, 
                      g.genre_name, 
                      floor(m.release_year/10)*10 release_decade,
                      m.rating
                      
               from movie m
               join movie_genre g
               on m.movie_id = g.movie_id),

         t2 as (select genre_name, release_decade, avg(rating) aver_dg
                from t
                group by genre_name, release_decade),

         t3 as (select movie_id
                from t
                where genre_name = '${genreInput}' and release_decade = ${decadeInput}),

         t4 as (select *
                from t
                where movie_id in (select * from t3)),

         t5 as (select t4.*, t2.aver_dg, if(rating > aver_dg, 0, 1) larger
                from t4
                join t2
                using(genre_name, release_decade)),

         t6 as (select movie_id, sum(larger) sum_lar
                from t5
                group by movie_id)

    select movie_id, title, rating
    from movie
    where movie_id in (select movie_id
                       from t6
                       where sum_lar = 0)
    order by title
    limit 100;
  `

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });

  /* ---- (Query 9, Reccomend top 10 movies based on shared characters) ---- */
  const mov = req.params.title;
  console.log(mov);
  const query = `
    WITH temp AS (
    SELECT characterID
    FROM CastIn
    WHERE Movie = '${mov}'
    )
     
    SELECT Movie
    FROM Castin c
    JOIN temp t ON c.characterID = t.characterID 
    WHERE c.Movie <> '${mov}'
    GROUP BY Movie
    ORDER BY COUNT(*) DESC 
    LIMIT 10;

  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });


  /* ---- (Query 10, Find all Superheroes that have appeared together) ---- */
  const mov = req.params.title;
  console.log(mov);
  const query = `
      WITH temp AS (
      SELECT name
      FROM Characters c1
      JOIN Castin c2 on c1.CharacterID = c2.CharacterID
      WHERE c2.Moive =  '${mov}'
      )
      
      SELECT * 
      FROM CharInfo c
      JOIN temp t ON c.Character = t.name

  `
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });


};

module.exports = {
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};