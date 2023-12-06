import React, { useState, useEffect } from 'react';

const CountdownTimer = ({onCountdownFinished}) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextTuesday = new Date();

      // Set nextTuesday to the next Tuesday at 7 PM
      nextTuesday.setDate(now.getDate() + (3 - now.getDay() + 7) % 7);
      nextTuesday.setHours(2, 21, 50, 0); // 7 PM

      // If now is already past this week's Tuesday 7 PM, set for next week
      if (now > nextTuesday) {
        nextTuesday.setDate(nextTuesday.getDate() + 7);
      }

      const difference = nextTuesday - now;

      let timeLeft = {};
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const updateTimer = () => {
        const countdown = calculateTimeLeft();
        setTimeLeft(`${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`);
  
        if (countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0) {
          alert("drawing now");
          onCountdownFinished && onCountdownFinished(); // Call the callback function
        } else {
          setTimeout(updateTimer, 1000);
        }
      };

    updateTimer();
  }, [onCountdownFinished]);

  return (
    <div>
      <h2>Countdown Until next lottery drawings</h2>
      <h3>All lottery tickets have their numbers drawn at the same time</h3>
      <p>{timeLeft}</p>
    </div>
  );
};

export default CountdownTimer;