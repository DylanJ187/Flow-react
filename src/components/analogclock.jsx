import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

const AnalogClock = ({ color = "black" }) => {
  const [date, setDate] = useState(DateTime.now());

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(DateTime.now());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const secondsRatio = date.second / 60;
  const minutesRatio = (secondsRatio + date.minute) / 60;
  const hoursRatio = (minutesRatio + date.hour) / 12;

  const hourMarks = Array.from({ length: 12 }).map((_, index) => (
    <line
      key={index}
      x1="100"
      y1="10"
      x2="100"
      y2="20"
      stroke={color}
      strokeWidth="2"
      transform={`rotate(${30 * index} 100 100)`}
    />
  ));

  return (
    <svg width="200" height="200">
      {hourMarks}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="50"
        stroke={color}
        strokeWidth="4"
        transform={`rotate(${360 * hoursRatio} 100 100)`}
      />
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="35"
        stroke={color}
        strokeWidth="3"
        transform={`rotate(${360 * minutesRatio} 100 100)`}
      />
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="40"
        stroke={color}
        strokeWidth="2"
        transform={`rotate(${360 * secondsRatio} 100 100)`}
      />

      {/* Display Date and Month */}
      <text x="100" y="145" textAnchor="middle" fill={color} fontSize="1.3em">
        {date.toFormat("dd LLL")}
      </text>
    </svg>
  );
};

export default AnalogClock;
