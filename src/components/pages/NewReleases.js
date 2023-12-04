import React, { useState, useEffect } from 'react';
import './MusicPlayerHomePage.css';
import { useNavigate } from 'react-router-dom';

function NewReleases() {
  const [tracks, setTracks] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
      const basicAuth = btoa(`${clientId}:${clientSecret}`);

      try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
          },
          body: 'grant_type=client_credentials',
        });

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok) {
          const accessToken = tokenData.access_token;
          setAccessToken(accessToken);

          const tracksResponse = await fetch('https://api.spotify.com/v1/browse/new-releases', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          const tracksData = await tracksResponse.json();

          if (tracksResponse.ok) {
            console.log('Tracks data:', tracksData);
            setTracks(tracksData.albums.items);
          } else {
            setError(`Failed to fetch tracks: ${tracksData.error.message}`);
          }
        } else {
          setError(`Failed to obtain access token: ${tokenData.error}`);
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTrackClick = async (track) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/albums/${track.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const albumDetails = await response.json();

      if (response.ok) {
        console.log('Album Details:', albumDetails);

        navigate(`/track/${track.id}`, { state: { album: albumDetails } });
      } else {
        console.error(`Failed to fetch album details: ${JSON.stringify(albumDetails)}`);
      }
    } catch (error) {
      console.error('Error fetching album details:', error.message);
    }
  };

  return (
    <div className='music-box'>
      <h2>New Releases</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div className="tracks-container">
          <ul className="tracks-list">
            {tracks.map(track => (
              <li key={track.id} className="track-item track" onClick={() => handleTrackClick(track)}>
                {track.images && track.images.length > 0 && (
                  <img src={track.images[0].url} alt={track.name} />
                )}
                <strong>{track.name}<br /></strong>
                <strong>Artist:</strong> {track.artists.map(artist => artist.name).join(', ')}<br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default NewReleases;