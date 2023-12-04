import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ArtistPopularSongs.css';
import Header from '../Header';
import ReactPlayer from 'react-player';

function ArtistPopularSongs() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackUrl, setTrackUrl] = useState('');

  useEffect(() => {
    const fetchArtistPopularSongs = async () => {
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

        const response = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching artist's top tracks: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        const songsData = responseData.tracks;

        setSongs(songsData);
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistPopularSongs();
  }, [id]);

  const handleResultClick = (result, selectedTrackIndex) => {
    console.log('Clicked on result:', result);
  
    // Check if it's an album
    if (result.album_type === 'album') {
      // Check if the album has tracks
      if (result.tracks && result.tracks.items && result.tracks.items.length > 0) {
        // Check if the selectedTrackIndex is valid
        if (selectedTrackIndex >= 0 && selectedTrackIndex < result.tracks.items.length) {
          // Extract the URL of the selected track from the album
          const selectedTrackUrl = result.tracks.items[selectedTrackIndex].preview_url;
  
          if (!selectedTrackUrl) {
            console.error('Selected track has no preview URL:', result);
            // Provide feedback to the user about the issue
            alert('Selected track has no preview. Please try another track.');
            return;
          }
  
          // Set the track URL to the selected track
          setTrackUrl(selectedTrackUrl);
          return;
        } else {
          console.error('Invalid selected track index:', selectedTrackIndex);
          // Provide feedback to the user about the issue
          alert('Invalid selection. Please try again.');
          return;
        }
      } else {
        // If the album has no tracks, open the album in the Spotify app or web player
        if (result.uri) {
          window.open(result.uri, '_blank');
        } else {
          console.error('Album URI is undefined:', result);
          // Provide feedback to the user about the issue
          alert('Selected album URI is undefined. Please try another album.');
          return;
        }
      }
    } else if (result.type === 'track') {
      // If it's a single track result
      const trackUrl = result.preview_url;
  
      if (!trackUrl) {
        console.error('Selected track has no preview URL:', result);
        // Provide feedback to the user about the issue
        alert('Selected track has no preview. Please try another track.');
        return;
      }
  
      // Set the track URL to the selected track
      setTrackUrl(trackUrl);
      return;
    }
  
    // If it's neither an album nor a track, log an error
    console.error('Invalid result format:', result);
    // Provide feedback to the user about the issue
    alert('Invalid result format. Please try again.');
  };

  return (
    <div className=''>
        <Header/>
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
      // Update the UI to inform the user about the error
      alert(`Error playing the track. See console for details.`);
    }} 
  />
)}
</div>
      </div>
        <div className='music-box'>
      <h2>Artist's Popular Songs</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="song-container">
  {songs.length > 0 && (
    <ul className="song-list">
      {songs.map((song, index) => (
        <li key={song.id} className="track-item track song song-item" onClick={() => handleResultClick(song, index)}>
          <img src={song.album.images[0]?.url} alt={song.name} />
          <strong>{song.name}</strong>
          <p>{song.artists.map(artist => artist.name).join(', ')}</p>
        </li>
      ))}
    </ul>
  )}
</div>
      </div>
    </div>
  );
}
export default ArtistPopularSongs;