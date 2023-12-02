import React, { useEffect, useState } from "react";

const style = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    width: "3 * 140px + 80px",
  },
  unitContainer: {
    display: "block",
    position: "relative",
    width: "140px",
    height: "120px",
    perspectiveOrigin: "50% 50%",
    perspective: "300px",
    backgroundColor: "white",
    borderRadius: "3px",
    boxShadow: "0px 10px 10px -10px grey",
  },
  card: {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    width: "100%",
    height: "50%",
    overflow: "hidden",
    border: "1px solid whitesmoke",
  },
  span: {
    fontSize: "5em",
    fontFamily: "'Droid Sans Mono', monospace",
    fontWeight: "lighter",
    color: "lighten(black, 20%)",
  },
  upperCard: {
    alignItems: "flex-start", // Display upper half of the digit in the upper card
    borderBottom: "0.5px solid whitesmoke",
    borderTopLeftRadius: "3px",
    borderTopRightRadius: "3px",
  },
  lowerCard: {
    alignItems: "flex-end", // Display lower half of the digit in the lower card
    borderTop: "0.5px solid whitesmoke",
    borderBottomLeftRadius: "3px",
    borderBottomRightRadius: "3px",
  },
  flipCard: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    left: "0",
    width: "100%",
    height: "50%",
    overflow: "hidden",
    backfaceVisibility: "hidden",
    fontFamily: "'Droid Sans Mono', monospace",
    fontSize: "5em",
    fontWeight: "lighter",
    color: "lighten(black, 20%)",
  },
  unfold: {
    top: "50%",
    alignItems: "flex-start",
    transformOrigin: "50% 0%",
    transform: "rotateX(180deg)",
    backgroundColor: "white",
    borderBottomLeftRadius: "3px",
    borderBottomRightRadius: "3px",
    border: "0.5px solid whitesmoke",
    borderTop: "0.5px solid whitesmoke",
  },
  fold: {
    top: "0%",
    alignItems: "flex-end",
    transformOrigin: "50% 100%",
    transform: "rotateX(0deg)",
    backgroundColor: "white",
    borderTopLeftRadius: "3px",
    borderTopRightRadius: "3px",
    border: "0.5px solid whitesmoke",
    borderBottom: "0.5px solid whitesmoke",
  },
};

const AnimatedCard = ({ animation, digit }) => {
  return (
    <div
      style={{
        ...style.flipCard,
        ...(animation === "unfold" ? style.unfold : style.fold),
      }}
    >
      <span>{digit}</span>
    </div>
  );
};

const StaticCard = ({ position, digit }) => {
  // Ensure digit is a string
  const digitStr = String(digit);

  // Split the string into upper and lower halves
  const upperHalf = digitStr.slice(0, 1);
  const lowerHalf = digitStr.slice(1);

  return (
    <div
      style={{
        ...style.card,
        ...(position === "upperCard" ? style.upperCard : style.lowerCard),
      }}
    >
      {position === "upperCard" ? (
        <span>{upperHalf}</span> // Display the upper half of the digit in the upper card
      ) : (
        <span>{lowerHalf}</span> // Display the lower half of the digit in the lower card
      )}
    </div>
  );
};

const FlipUnitContainer = ({ digit, shuffle, unit }) => {
  let currentDigit = digit;
  let previousDigit = digit - 1;

  if (unit !== "hours") {
    previousDigit = previousDigit === -1 ? 59 : previousDigit;
  } else {
    previousDigit = previousDigit === -1 ? 23 : previousDigit;
  }

  if (currentDigit < 10) {
    currentDigit = `0${currentDigit}`;
  }
  if (previousDigit < 10) {
    previousDigit = `0${previousDigit}`;
  }

  const digit1 = shuffle ? previousDigit : currentDigit;
  const digit2 = !shuffle ? previousDigit : currentDigit;

  const animation1 = shuffle ? "fold" : "unfold";
  const animation2 = !shuffle ? "fold" : "unfold";

  return (
    <div style={style.unitContainer}>
      <StaticCard position="upperCard" digit={digit1} />{" "}
      {/* Display upper half of the digit */}
      <StaticCard position="lowerCard" digit={digit2} />{" "}
      {/* Display lower half of the digit */}
      <AnimatedCard digit={digit1} animation={animation1} />
      <AnimatedCard digit={digit2} animation={animation2} />
    </div>
  );
};

const FlipClock = () => {
  const [hours, setHours] = useState(0);
  const [hoursShuffle, setHoursShuffle] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [minutesShuffle, setMinutesShuffle] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [secondsShuffle, setSecondsShuffle] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const time = new Date();
      const newHours = time.getHours();
      const newMinutes = time.getMinutes();
      const newSeconds = time.getSeconds();

      if (newHours !== hours) {
        setHours(newHours);
        setHoursShuffle(!hoursShuffle);
      }

      if (newMinutes !== minutes) {
        setMinutes(newMinutes);
        setMinutesShuffle(!minutesShuffle);
      }

      if (newSeconds !== seconds) {
        setSeconds(newSeconds);
        setSecondsShuffle(!secondsShuffle);
      }
    };

    const intervalID = setInterval(updateTime, 50);

    return () => clearInterval(intervalID);
  }, [hours, minutes, seconds, hoursShuffle, minutesShuffle, secondsShuffle]);

  return (
    <div style={style.container}>
      <FlipUnitContainer unit="hours" digit={hours} shuffle={hoursShuffle} />
      <FlipUnitContainer
        unit="minutes"
        digit={minutes}
        shuffle={minutesShuffle}
      />
      <FlipUnitContainer
        unit="seconds"
        digit={seconds}
        shuffle={secondsShuffle}
      />
    </div>
  );
};

export default FlipClock;
