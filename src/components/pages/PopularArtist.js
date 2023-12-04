import React, { useState, useEffect } from 'react';
import './MusicPlayerHomePage.css';
import { Link } from 'react-router-dom';

function PopularArtist() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularArtists = async () => {
      try {
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
          body: 'grant_type=client_credentials',
        });

        if (!tokenResponse.ok) {
          throw new Error(`Error obtaining access token: ${tokenResponse.status} - ${tokenResponse.statusText}`);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const response = await fetch(
          'https://api.spotify.com/v1/search?q=pop&type=artist',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching artists: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        const artistsData = responseData.artists.items;

        setArtists(artistsData);
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArtists();
  }, []);

  return (
    <div className='music-box'>
      <h2>Popular Artists</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="tracks-container">
        {artists.length > 0 && (
          <ul className="tracks-list">
            {artists.map(artist => (
              <li key={artist.id} className="track-item track">
                <Link to={`/artist/${artist.id}`}>
                  <img src={artist.images[0]?.url} alt={artist.name} />
                </Link>
                <strong>{artist.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default PopularArtist;