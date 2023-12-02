import React, { useState, useEffect } from "react";

const DigitalClock = ({ is24HourFormat }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const day = time.getDate();
  const month = time.toLocaleString("default", { month: "long" });

  let formattedHours = !is24HourFormat
    ? hours % 12 || 12
    : hours < 10
    ? `0${hours}`
    : hours;

  let period = !is24HourFormat ? (hours >= 12 ? "PM" : "AM") : "";

  if (!is24HourFormat) {
    formattedHours = hours % 12 || 12;
    period = hours >= 12 ? "PM" : "AM";
  }

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const clockStyle = {
    fontSize: "3em",
    padding: "10px",
    border: "2px solid #333",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    maxWidth: "220px", // Adjusted the width for better fit
    margin: "0 auto", // Center horizontally
    marginTop: "-25px", // Move the clock up by adjusting this value
  };

  const timeContainerStyle = {
    display: "flex",
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
  };

  const timeStyle = {
    fontWeight: "bold",
    letterSpacing: "2px",
    fontSize: "0.9em", // Adjusted the font size for better fit
  };

  const amPmVisibility = is24HourFormat ? "hidden" : "visible";

  <div style={timeContainerStyle}>
    <div style={timeStyle}>
      {formattedHours}:{formattedMinutes}:{formattedSeconds}
    </div>
    {!is24HourFormat && (
      <span
        style={{
          fontWeight: "bold",
          fontSize: "0.7em",
          marginLeft: "5px",
          visibility: amPmVisibility,
        }}
      >
        {period}
      </span>
    )}
  </div>;

  const dateMonthContainerStyle = {
    display: "flex",
    marginTop: "5px",
    position: "absolute",
    bottom: "-40px",
  };

  const dateStyle = {
    fontSize: "0.5em",
    marginRight: "5px",
  };

  const monthStyle = {
    fontSize: "0.5em",
  };

  return (
    <div style={clockStyle}>
      <div style={timeContainerStyle}>
        <div style={timeStyle}>
          {formattedHours}:{formattedMinutes}:{formattedSeconds}
        </div>
        {!is24HourFormat && (
          <span
            style={{
              fontWeight: "bold",
              fontSize: "0.7em",
              marginLeft: "5px",
              visibility: amPmVisibility,
            }}
          >
            {period}
          </span>
        )}
      </div>
      <div style={dateMonthContainerStyle}>
        <div style={dateStyle}>{day}</div>
        <div style={monthStyle}>{month}</div>
      </div>
    </div>
  );
};

export default DigitalClock;
