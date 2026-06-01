import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch movies list from backend
  useEffect(() => {
    setLoading(true);
    fetch('/api/movies')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movies');
        return res.json();
      })
      .then((payload) => {
        setMovies(payload.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch single movie detail by id
  const viewMovieDetail = (id) => {
    setLoading(true);
    fetch(`/api/movies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movie details');
        return res.json();
      })
      .then((payload) => {
        setSelectedMovie(payload.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Localize the release date
  const getLocalizedDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    const fullYear = parseInt(year, 10) < 50 ? 2000 + parseInt(year, 10) : 1900 + parseInt(year, 10);
    const date = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
    return date.toLocaleDateString();
  };

  // Filter movies based on search term
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Movie Library</h1>
        {!selectedMovie && (
          <input
            type="text"
            placeholder="Search movies by title..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </header>

      <main className="content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : selectedMovie ? (
          <div className="detail-view">
            <button className="back-btn" onClick={() => setSelectedMovie(null)}>
              &larr; Back to Movies List
            </button>
            <h2>{selectedMovie.title}</h2>
            {selectedMovie.tagline && <p className="tagline">"{selectedMovie.tagline}"</p>}
            
            <div className="fields-grid">
              <div className="field-label">Original Title</div>
              <div className="field-value">{selectedMovie.original_title}</div>

              <div className="field-label">Release Date</div>
              <div className="field-value">{getLocalizedDate(selectedMovie.release_date)}</div>

              <div className="field-label">Runtime</div>
              <div className="field-value">{selectedMovie.runtime} minutes</div>

              <div className="field-label">Status</div>
              <div className="field-value">
                <span className={`status-badge status-${(selectedMovie.status || '').toLowerCase()}`}>
                  {selectedMovie.status}
                </span>
              </div>

              <div className="field-label">Vote Average</div>
              <div className="field-value">
                <span className="rating-badge">★ {selectedMovie.vote_average} / 10</span>
              </div>

              <div className="field-label">Vote Count</div>
              <div className="field-value">{selectedMovie.vote_count}</div>

              <div className="field-label align-top">Overview</div>
              <div className="field-value overview-text">{selectedMovie.overview}</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="movies-grid">
              {filteredMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card" 
                  onClick={() => viewMovieDetail(movie.id)}
                >
                  <div className="card-content">
                    <h3>{movie.title}</h3>
                    <p className="tagline">{movie.tagline || 'No tagline'}</p>
                  </div>
                  <div className="card-footer">
                    <p className="rating">★ {movie.vote_average} / 10</p>
                  </div>
                </div>
              ))}
            </div>
            {filteredMovies.length === 0 && (
              <p className="no-movies">No movies found matching "{searchTerm}"</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
