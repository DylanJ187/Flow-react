import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { SubjectContext } from "../../App";
import { subjectMap } from "../../components/subjectMap";
import { groupSubjects } from "../../components/groupSubjects";
import { tokens } from "../../theme";

const Settings = () => {
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
      </Box>
    </Box>
  );
};

export default Settings;
