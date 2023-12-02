import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import DigitalClock from "../../components/digitalClock";
import AnalogClock from "../../components/analogclock";
import { SubjectContext } from "../../App";
import { subjectMap } from "../../components/subjectMap";
import { groupSubjects } from "../../components/groupSubjects";
import { tokens } from "../../theme";

const Settings = ({
  clockMode,
  setClockMode,
  is24HourFormat,
  setIs24HourFormat,
  onToggleTimeFormat,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [groupOne, setGroupOne] = useState("");
  const [groupTwo, setGroupTwo] = useState("");
  const [groupThree, setGroupThree] = useState("");
  const [groupFour, setGroupFour] = useState("");
  const [groupFive, setGroupFive] = useState("");
  const [groupSix, setGroupSix] = useState("");

  const { setSubjectArray } = useContext(SubjectContext);

  const handleGroupChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const toggleClockMode = () => {
    setClockMode((prevMode) => (prevMode === "digital" ? "analog" : "digital"));
  };

  const toggleTimeFormat = () => {
    setIs24HourFormat((prevFormat) => !prevFormat);
  };

  useEffect(() => {
    const newSubjectArray = [
      subjectMap[groupOne],
      subjectMap[groupTwo],
      subjectMap[groupThree],
      subjectMap[groupFour],
      subjectMap[groupFive],
      subjectMap[groupSix],
    ];
    setSubjectArray(newSubjectArray);
  }, [groupOne, groupTwo, groupThree, groupFour, groupFive, groupSix]);

  return (
    <Box className="Container" m="10vh 20px 20px 20px">
      <Box
        display="flex"
        sx={{
          width: "35vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <Typography
          variant="h1"
          color={colors.grey[100]}
          fontWeight="bold"
          mb="5vh"
          sx={{ userSelect: "none" }}
        >
          Settings
        </Typography>

        {/*------------SUBJECT SURVEY--------------*/}
        <Box width="30vw">
          <Typography
            variant="h4"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ userSelect: "none" }}
          >
            Subjects:
          </Typography>
          {Object.entries(groupSubjects).map(([groupKey, subjects], index) => (
            <FormControl fullWidth key={groupKey}>
              <InputLabel sx={{ paddingTop: "10px" }} id="group-select-label">
                Group {index + 1}
              </InputLabel>
              <Select
                label={`Group ${index + 1}`}
                labelId={`${groupKey}-label`}
                id={groupKey}
                value={
                  {
                    groupOne,
                    groupTwo,
                    groupThree,
                    groupFour,
                    groupFive,
                    groupSix,
                  }[groupKey]
                }
                onChange={handleGroupChange(
                  {
                    groupOne: setGroupOne,
                    groupTwo: setGroupTwo,
                    groupThree: setGroupThree,
                    groupFour: setGroupFour,
                    groupFive: setGroupFive,
                    groupSix: setGroupSix,
                  }[groupKey]
                )}
                sx={{ m: "10px 0" }}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subjectMap[subject]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>

        {/*------------TIME FORMAT TOGGLE--------------*/}
        <Box mt={4}>
          <Typography
            variant="h4"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ userSelect: "none", marginBottom: "10px" }}
          >
            Time Format:
          </Typography>
          <Button variant="contained" onClick={onToggleTimeFormat}>
            Toggle to {is24HourFormat ? "12-hour" : "24-hour"}
          </Button>
        </Box>

        {/*------------CLOCK MODE TOGGLE--------------*/}
        <Box mt={4}>
          <Typography
            variant="h4"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ userSelect: "none", marginBottom: "10px" }}
          >
            Clock Mode:
          </Typography>
          <Button
            variant="contained"
            onClick={() =>
              setClockMode((prevMode) =>
                prevMode === "digital" ? "analog" : "digital"
              )
            }
          >
            Switch to {clockMode === "digital" ? "Analog" : "Digital"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
