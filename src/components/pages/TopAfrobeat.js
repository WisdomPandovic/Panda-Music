import React, { useState, useEffect } from 'react';
import './MusicPlayerHomePage.css';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

function SpotifyTopAfrobeats() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');
  const [trackUrl, setTrackUrl] = useState('');

  useEffect(() => {
    const fetchTopAfrobeatsTracks = async () => {
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
          'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching top Afrobeats tracks: ${response.status} - ${response.statusText}`);
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

    fetchTopAfrobeatsTracks();
  }, []);

  const handleResultClick = (result) => {
    try {
      const trackInfo = result.track;
      
      if (trackInfo.preview_url) {
        setTrackUrl(trackInfo.preview_url);
      } else {
        console.error('Selected track has no preview URL:', result);
        alert('Selected track has no preview. Please try another track.');
      }
    } catch (error) {
      console.error('Error handling result click:', error);
      alert('Error handling result click. Please try again.');
    }
  };

  return (
    <div className='music-box'>
      <h2>Hottest Tracks Right Now</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <div className="tracks-container">
          <ul className="tracks-list">
            {tracks.length > 0 && (
              tracks.map((track, index) => (
                <li key={track.track.id} className="track-item track" onClick={() => handleResultClick(track)}>
                  <img src={track.track.album.images[0].url} alt={track.track.name} />
                  <strong>{track.track.name}<br /></strong>
                  <strong>Artist(s):</strong> {track.track.artists.map(artist => artist.name).join(', ')}<br />
                  <strong>Album:</strong> {track.track.album.name}<br />
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <div className='player-container'>
        <div className='player-wrapper'>
      {trackUrl && (
  <ReactPlayer 
    url={trackUrl} 
    controls
    playing className="player"
    onPlay={() => console.log('onPlay')}
    onPause={() => console.log('onPause')}
    onEnded={() => console.log('onEnded')}
    onError={(error) => {
      console.error('onError', error);
      alert(`Error playing the track. See console for details.`);
    }} 
  />
)}
</div>
      </div>
    </div>
  );
}
export default SpotifyTopAfrobeats;