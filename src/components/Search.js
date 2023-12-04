import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import Header from './Header';
import Footer from './Footer';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trackUrl, setTrackUrl] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
        body: 'grant_type=client_credentials',
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        console.error(`Failed to obtain access token: ${tokenData.error}`);
        return;
      }

      const accessToken = tokenData.access_token;

      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track,album`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const searchData = await searchResponse.json();

      if (searchResponse.ok) {
        setSearchResults(searchData.tracks.items.concat(searchData.albums.items));
      } else {
        console.error(`Failed to fetch search results: ${searchData.error.message}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
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
            alert('Selected track has no preview. Please try another track.');
            return;
          }
  
          // Set the track URL to the selected track
          setTrackUrl(selectedTrackUrl);
          return;
        } else {
          console.error('Invalid selected track index:', selectedTrackIndex);
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
    <div className="bk-black">
      <Header />
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for songs or albums"
            value={query}
            onChange={handleInputChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>
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


      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results:</h2>
          <div className="result-grid">
            {searchResults.map((result, index) => (
              <div key={result.id} className="result-card"
              onClick={() => handleResultClick(result, index)}>
              
                {result.images && result.images.length > 0 && (
                  <img src={result.images[0].url} alt={result.name} />
                )}
                <p>{result.name}</p>
                <p>{result.type === 'track' ? 'Song' : 'Album'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Search;
