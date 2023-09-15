import React, { useState, useEffect } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { setSubjects } from "./subjectSlice";

const Profile = () => {
  const [groupOne, setGroupOne] = useState("");
  const [groupTwo, setGroupTwo] = useState("");
  const [groupThree, setGroupThree] = useState("");
  const [groupFour, setGroupFour] = useState("");
  const [groupFive, setGroupFive] = useState("");
  const [groupSix, setGroupSix] = useState("");
  const [subjectArray, setSubjectArray] = useState([]);

  const dispatch = useDispatch();

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
    dispatch(setSubjects(newSubjectArray));
  }, [
    groupOne,
    groupTwo,
    groupThree,
    groupFour,
    groupFive,
    groupSix,
    dispatch,
  ]);

  const subjectMap = {
    "language-&-literature-sl": '"LangLit SL"',
    "literature-sl": '"Lit SL"',
    "spanish-b-sl": '"Spanish B SL"',
    "spanish-b-hl": '"Spanish B HL"',
    "french-b-sl": '"French B SL"',
    "french-b-hl": '"French B HL"',
    "history-sl": '"History SL"',
    "history-hl": '"History HL"',
    "business-management-sl": '"BM SL"',
    "business-management-hl": '"BM HL"',
    "biology-sl": '"Biology SL"',
    "biology-hl": '"Biology HL"',
    "chemistry-sl": '"Chemistry SL"',
    "chemistry-hl": '"Chemistry HL"',
    "math-ai-sl": '"Math AA SL"',
    "math-ai-hl": '"Math AA HL"',
    "math-aa-sl": '"Math AI SL"',
    "math-aa-hl": '"Math AI HL"',
    "visual-arts-sl": '"Visual Arts SL"',
    "visual-arts-hl": '"Visual Arts HL"',
    "music-sl": '"Music SL"',
    "music-hl": '"Music HL"',
  };

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
        <Header title="PROFILE" subtitle="Welcome to your profile." />
        <button
          onClick={() => {
            alert(subjectArray);
          }}
        >
          check contents of subjectArray
        </button>
        {/*---------FORM-------- */}
        <Box width="30vw">
          {/*-------GROUP 1-------*/}
          <FormControl fullWidth>
            <Typography>Subject Selection:</Typography>
            <Select
              label="Group One"
              labelId="group-one-label"
              id="group-one"
              value={groupOne}
              onChange={handleGroupChange(setGroupOne)}
              sx={{ m: "5px 0" }}
            >
              <MenuItem value={"language-&-literature-sl"}>
                Language & Literature SL
              </MenuItem>
              <MenuItem value={"language-&-literature-sl"}>
                Language & Literature SL
              </MenuItem>
              <MenuItem value={"literature-sl"}>Literature SL</MenuItem>
              <MenuItem value={"literature-sl"}>Literature SL</MenuItem>
            </Select>
          </FormControl>

          {/*-------GROUP 2-------*/}
          <FormControl fullWidth>
            <Select
              label="Group Two"
              labelId="group-two-label"
              id="group-two"
              value={groupTwo}
              onChange={handleGroupChange(setGroupTwo)}
              sx={{ m: "5px 0" }}
            >
              {" "}
              <MenuItem value={"spanish-b-sl"}>Spanish B SL</MenuItem>
              <MenuItem value={"spanish-b-hl"}>Spanish B HL</MenuItem>
              <MenuItem value={"french-b-sl"}>French B SL</MenuItem>
              <MenuItem value={"french-b-hl"}>French B HL</MenuItem>
            </Select>
          </FormControl>

          {/*-------GROUP 3-------*/}
          <FormControl fullWidth>
            <Select
              label="Group Three"
              labelId="group-three-label"
              id="group-three"
              value={groupThree}
              onChange={handleGroupChange(setGroupThree)}
              sx={{ m: "5px 0" }}
            >
              {" "}
              <MenuItem value={"history-sl"}>History SL</MenuItem>
              <MenuItem value={"history-hl"}>History HL</MenuItem>
              <MenuItem value={"business-management-sl"}>
                Business Management SL
              </MenuItem>
              <MenuItem value={"business-management-hl"}>
                Business Management HL
              </MenuItem>
            </Select>
          </FormControl>

          {/*-------GROUP 4-------*/}
          <FormControl fullWidth>
            <Select
              label="Group Four"
              labelId="group-four-label"
              id="group-four"
              value={groupFour}
              onChange={handleGroupChange(setGroupFour)}
              sx={{ m: "5px 0" }}
            >
              {" "}
              <MenuItem value={"biology-sl"}>Biology SL</MenuItem>
              <MenuItem value={"biology-hl"}>Biology HL</MenuItem>
              <MenuItem value={"chemistry-sl"}>Chemistry SL</MenuItem>
              <MenuItem value={"chemistry-hl"}>Chemistry HL</MenuItem>
            </Select>
          </FormControl>

          {/*-------GROUP 5-------*/}
          <FormControl fullWidth>
            <Select
              label="Group Five"
              labelId="group-five-label"
              id="group-five"
              value={groupFive}
              onChange={handleGroupChange(setGroupFive)}
              sx={{ m: "5px 0" }}
            >
              <MenuItem value={"math-ai-sl"}>
                Mathematics Analysis & Approaches SL
              </MenuItem>
              <MenuItem value={"math-ai-hl"}>
                Mathematics Analysis & Approaches HL
              </MenuItem>
              <MenuItem value={"math-aa-sl"}>
                Mathematics Applications & Interpretation SL
              </MenuItem>
              <MenuItem value={"math-aa-hl"}>
                Mathematics Applications & Interpretation HL
              </MenuItem>
            </Select>
          </FormControl>

          {/*-------GROUP 6-------*/}
          <FormControl fullWidth>
            <Select
              label="Group Six"
              labelId="group-six-label"
              id="group-six"
              value={groupSix}
              onChange={handleGroupChange(setGroupSix)}
              sx={{ m: "5px 0" }}
            >
              <MenuItem value={"visual-arts-sl"}>Visual Arts SL</MenuItem>
              <MenuItem value={"visual-arts-hl"}>Visual Arts HL</MenuItem>
              <MenuItem value={"music-sl"}>Music SL</MenuItem>
              <MenuItem value={"music-hl"}>Music HL</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
