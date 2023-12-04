import IgboRapMusic from './IgboRapMusic';
 import TopAfrobeat from './TopAfrobeat';
 import SpotifyTopAfrobeats from './SpotifyTopAfrobeats';
 import ChristmasSongs from './ChristmasSongs';
 import NewReleases from './NewReleases';
 import PopularArtist from './PopularArtist';
 import Header from '../Header';
 import Footer from '../Footer';

function MusicPlayerHomePage() {
  return (
    <div className='bk-black'>
      <Header/>
      <PopularArtist/>
      <NewReleases/>
      <TopAfrobeat/>
      <ChristmasSongs/>
      <SpotifyTopAfrobeats/>
      <IgboRapMusic/>
      <Footer/>
    </div>
  );
}
export default MusicPlayerHomePage;