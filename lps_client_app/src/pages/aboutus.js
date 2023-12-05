// pages/AboutUs.js
import React from 'react';
import '../page_styles/aboutus.css'

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <h2>Our Mission</h2>
      <p>
        At Texas Lottery App, our mission is to provide a seamless and enjoyable experience for individuals passionate about playing the lottery. We strive to offer convenience, reliability, and transparency in accessing lottery information, results, and tools to enhance your lottery gaming experience.
      </p>
      <h2>What We Offer</h2>
      <p>
        <b>Real-Time Results:</b> Stay up-to-date with the latest lottery draw results, including Powerball, Mega Millions, Lotto Texas, and other exciting games.
        <br></br><b>Ticket Scanning:</b> Easily scan and check your lottery tickets to see if you're a winner right from the website.
        <br></br><b>Helpful Resources:</b> Access tips, strategies, and helpful resources to maximize your chances of winning.
      </p>
      <h2>Our Commitment</h2>
      <p>
        <b>User-Friendly Interface:</b> We prioritize user experience, ensuring our app is intuitive, easy to navigate, and accessible to everyone.
        <br></br><b>Reliability and Accuracy:</b> We are dedicated to providing accurate and timely information, ensuring transparency and trustworthiness in every aspect.
        <br></br><b>Community Engagement:</b> Unlike traditional lottery systems, we operate on open-source principles. Our entire platform is built upon transparency and accessibility. The source code powering our lottery system is openly available for inspection, ensuring fairness and trustworthiness at every stage of the process.
      </p>
        <p>
        <a href="https://github.com/joshduplaa/SWE_Lottery_Project">Click here to visit the github repo</a>
        </p>
        <p>
        Thank you for choosing Texas Lottery App!
        </p>
    </div>
  );
};

export default AboutUs;
