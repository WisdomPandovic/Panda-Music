import React, { useState, useEffect } from 'react';
import './MusicPlayerHomePage.css';
import ReactPlayer from 'react-player';

function SpotifyTopAfrobeats() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackUrl, setTrackUrl] = useState('');

  useEffect(() => {
    const fetchTopAfrobeatsTracks = async () => {
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

        // Search for an Afrobeats playlist
        const searchResponse = await fetch(
          'https://api.spotify.com/v1/search?q=Afrobeats&type=playlist',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!searchResponse.ok) {
          throw new Error(`Error searching for Afrobeats playlist: ${searchResponse.status} - ${searchResponse.statusText}`);
        }

        const searchData = await searchResponse.json();

        // Assume the first playlist is related to Afrobeats
        if (searchData.playlists.items.length === 0) {
          throw new Error('No Afrobeats playlist found.');
        }

        const playlistId = searchData.playlists.items[0].id;

        const playlistResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!playlistResponse.ok) {
          throw new Error(`Error fetching tracks from Afrobeats playlist: ${playlistResponse.status} - ${playlistResponse.statusText}`);
        }

        const playlistData = await playlistResponse.json();
        const tracksData = playlistData.items;

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
      // Extract track information from the result
      const trackInfo = result.track;
      
      // Check if the track has a preview URL
      if (trackInfo.preview_url) {
        // Set the track URL to the selected track
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
      <h2>Afrobeat Tracks</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <div className="tracks-container">
          <ul className="tracks-list">
            {tracks.length > 0 && (
              tracks.map(track => (
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