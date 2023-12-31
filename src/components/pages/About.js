import React from 'react';
import Header from '../Header';
import './About.css';
import Footer from '../Footer'

function About() {
  return (
    <div className='bk-black'>
      <Header />
      <div className="about-content">
        <h2>About Our Music App</h2>
        <p>
          Welcome to our music app! This app allows you to explore new releases, view album details,
          and listen to previews of tracks. It's a great way to discover new music and enjoy your favorite artists.
        </p>
        <p>
          Our mission is to provide you with a seamless and enjoyable music experience. Feel free to explore
          the various features and discover the world of music with us.
        </p><hr/>

        <h3>Technology Stack</h3>
        <p>
          Our app is built using modern web technologies to ensure a smooth and responsive user experience.
          Some key technologies include React for the frontend, Spotify API for music data, and React Router for navigation.
        </p>

        <h3>Meet the Team</h3>
        <p>
          Our dedicated team of developers is passionate about music and technology.
          We strive to deliver the best possible experience for music lovers around the world.
        </p>
        <ul>
          <li>Wisdom Onwuchekwa - Full Stack Developer</li>
        </ul>

        <h3>Contact Us</h3>
        <p>
          Have questions, suggestions, or just want to say hello? Feel free to reach out to me at
          <p> wisdompandovic@gmail.com</p>
        </p>
      </div>

      <Footer/>
    </div>
  );
}

export default About;