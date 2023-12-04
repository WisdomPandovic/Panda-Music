import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './TrackDetails.css';

function TrackDetails() {
  const location = useLocation();
  const { state: { album } } = location;
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
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

        const response = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
        });

        if (response.ok) {
          const tracksData = await response.json();
          setTracks(tracksData.items);
        } else {
          console.error(`Failed to fetch tracks: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [album]);

  const handleTrackClick = (track) => {
    setCurrentTrack(track);
    console.log('Clicked track details:', track);
  };

  return (
    <div className='bk-black'>
      <Header />
      <div className='grid-2'>
          <div className="album-details">
          <div className="album-info">
          
          <div className="album-meta">
           
            <div><p> {album.artists.map(artist => artist.name).join(', ')}: {album.name}</p></div>
            <h4><strong>Release Date:</strong> {album.release_date}</h4>
          </div>
        </div>
        <div className="album-cover">
            {album.images && album.images.length > 0 && (
              <img src={album.images[0].url} alt="Album Cover" />
            )}
        </div>
        <h2>Album Tracklist</h2>
      
        {loading ? (
          <p>Loading tracks...</p>
        ) : (
          <ul className="track-list">
            {tracks.map((track, index) => (
              <li key={track.id} onClick={() => handleTrackClick(track)}>
                <span className="track-number">{index + 1}</span> {track.name}
              </li>
            ))}
          </ul>
        )}

        {currentTrack && currentTrack.preview_url !== null ? (
          <div className="now-playing">
            <h3>Now Playing: {currentTrack.name}</h3>
            {/* <img src={album.images[0].url} alt="Album Cover" /> */}
            <ReactPlayer url={currentTrack.preview_url} controls playing />
          </div>
        ) : (
          <p className="no-preview">No preview available for the selected track.</p>
        )}
          </div>

          <div>
            <p></p>
          </div>
      </div>
      <Footer />
    </div>
  );
}
export default TrackDetails;