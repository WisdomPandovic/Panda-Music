import './App.css';
import MusicPlayerHomePage from './components/pages/MusicPlayerHomePage';
import TrackDetails from './components/pages/TrackDetails';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Search from './components/Search';
import ArtistPopularSongs from './components/pages/ArtistPopularSongs'; 
import About from './components/pages/About';

function App() {
return (
  <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MusicPlayerHomePage />} />
          <Route path='/track/:id' element={<TrackDetails/>} />
          <Route path="search" element={<Search/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/artist/:id" element={<ArtistPopularSongs/>} />
        </Routes>
      </BrowserRouter>
  </div>
);}

export default App;