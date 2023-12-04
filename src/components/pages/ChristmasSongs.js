import React, { useState, useEffect } from 'react';
import './MusicPlayerHomePage.css';
import { useNavigate } from 'react-router-dom';

function ChristmasSongs() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const fetchChristmasSongs = async () => {
      try {
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
        const basicAuth = btoa(`${clientId}:${clientSecret}`);

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
          'https://api.spotify.com/v1/playlists/37i9dQZF1DWUoqEG4WY6ce/tracks',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching tracks: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        const tracksData = responseData.items;

        setTracks(tracksData);
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChristmasSongs();
  }, []);

  const handleTrackClick = async (track) => {
    try {
      if (!accessToken) {
        console.error('Access token is empty. Fetching a new token.');
        return;
      }

      const response = await fetch(`https://api.spotify.com/v1/albums/${track.album.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const albumDetails = await response.json();

      if (response.ok) {
        console.log('Response from album details:', response);
        console.log('Album Details:', albumDetails);

        navigate(`/track/${track.album.id}`, { state: { album: albumDetails } });
      } else {
        console.error(`Failed to fetch album details: ${JSON.stringify(albumDetails)}`);
      }
    } catch (error) {
      console.error('Error fetching album details:', error.message);
    }
  };
  

  return (
    <div className='music-box'>
      <h2>Christmas Songs</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="tracks-container">
        {tracks.length > 0 && (
          <ul className="tracks-list">
            {tracks.map(track => (
              <li key={track.track.id} className="track-item track" onClick={() => handleTrackClick(track)}>
                <img src={track.track.album.images[0].url} alt={track.track.name} />
                <strong>{track.track.name}<br /></strong>
                <strong>Artist(s):</strong> {track.track.artists.map(artist => artist.name).join(', ')}<br />
                <strong>Album:</strong> {track.track.album.name}<br />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChristmasSongs;
