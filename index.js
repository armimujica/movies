
//MY FIRST FULL STACK MOVIES APP (((CYBERVISION)))
const express = require('express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT || 8000;
const { Pool } = require('pg');
const cors = require('cors');
const pool = new Pool({ connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING });

// app.use (cors())
app.use(express.json());

app.get("/api/movies", (req, res) => {
    pool
        .query('SELECT * FROM movies;')
        .then(data => {
            console.log(data);
            res.json(data.rows);
        })
        .catch(e => res.status(500).json({ message: e.message }));
});

app.get("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    const safeValues = [id];
    pool
        .query('SELECT * FROM movies WHERE id=$1;', safeValues)
        .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
                res.status(404).json({ message: "Movie  with id ${id} not found" });
            } else {
                console.log(rows);
                res.json(rows[0]);
            }
        })
        .catch(e => res.status(500).json({ message: e.message }));

});
app.post('/api/movies', (req, res) => {
    const { title, director, year, rating, poster } = req.body;
    const safeValues = [title, director, year, rating, poster];
    pool
        .query('INSERT INTO movies (title,director,year,rating,poster) VALUES ($1,$2,$3,$4,$5) RETURNING *;', safeValues)
        .then(({ rows }) => {
            console.log(rows);
            res.status(201).json(rows[0]);
        })
        .catch(e => res.status(500).json({ message: e.message }));


});
app.put('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const { title, director, year, rating, poster } = req.body;
    const safeValues = [title, director, year, rating, poster, id];
    pool
        .query('UPDATE movies SET title= $1,director =$2,year = $3,rating=$4, poster=$5 WHERE id=$6 RETURNING *;', safeValues)
        .then(({ rows }) => {
            console.log(rows);
            res.status(202).json(rows[0]);
        })
        .catch(e => res.status(500).json({ message: e.message }));

});
app.delete("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    const safeValues = [id];
    pool
        .query('DELETE FROM movies WHERE id=$1 RETURNING *;', safeValues)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows[0]);
        })
        .catch(e => res.status(500).json({ message: e.message }));

});
















app.listen(PORT, () => console.log(`SERVER IS UP ON ${PORT}`));

//     app.use(express.json());

// app.listen(port, () => {
//     console.log(`Server is running on port ${3000}`);
// });





// app.get('/movies', async (req, res) => {
//     try {
//         const { rows } = await pool.query('SELECT * FROM movies');
//         res.json(rows);
//     } catch (err) {
//         console.error('Error executing query:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
// app.post('/movies', async (req, res) => {
//     try {
//         const { title, director, year, rating, poster } = req.body;
//         if (!title || !director || !year || !rating || !poster) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         const query = 'INSERT INTO movies (title, director, year, rating, poster) VALUES ($1, $2, $3, $4, $5) RETURNING *';
//         const values = [title, director, year, rating, poster];

//         const { rows } = await pool.query(query, values);
//         res.json(rows[0]);
//     } catch (err) {
//         console.error('Error inserting into database:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
// app.put('/movies/:id', async (req, res) => {
//     const movieId = req.params.id;
//     const { title, director, year, rating, poster } = req.body;

//     try {
//         const movie = await pool.query('SELECT * FROM movies WHERE id = $1', [movieId]);
//         if (movie.rowCount === 0) {
//             return res.status(404).json({ error: 'Movie not found' });
//         }

//         const query = 'UPDATE movies SET title = $1, director = $2, year = $3, rating = $4, poster = $5 WHERE id = $6';
//         const values = [title, director, year, rating, poster, movieId];

//         await pool.query(query, values);
//         res.json({ message: 'Movie updated successfully' });
//     } catch (err) {
//         console.error('Error updating database:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
// app.delete('/movies/:id', async (req, res) => {
//     const movieId = req.params.id;

//     try {
//         const movie = await pool.query('SELECT * FROM movies WHERE id = $1', [movieId]);
//         if (movie.rowCount === 0) {
//             return res.status(404).json({ error: 'Movie not found' });
//         }

//         await pool.query('DELETE FROM movies WHERE id = $1', [movieId]);
//         res.json({ message: 'Movie deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting from database:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
