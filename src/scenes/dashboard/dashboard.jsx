import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import AnalogClock from "../../components/analogclock";
import DigitalClock from "../../components/digitalClock";
import TodoList from "./todolist";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Search, NotesList } from "./stickynotes.jsx";
import { nanoid } from "nanoid";
import { tokens } from "../../theme";

const Dashboard = ({
  clockMode,
  setClockMode,
  is24HourFormat,
  setIs24HourFormat,
  ontoggleTimeFormat,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const toggleTimeFormat = () => {
    setIs24HourFormat(!is24HourFormat);
  };

  const [currentEvents, setCurrentEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");

  const addNote = (text) => {
    const date = new Date();
    const newNote = {
      id: nanoid(),
      text: text,
      date: date.toLocaleDateString(),
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const toggleClockMode = () => {
    setClockMode((prevMode) => (prevMode === "digital" ? "analog" : "digital"));
  };

  return (
    <Box className="Container" m="0vh 0px 0px 0px">
      {/*Top section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        position="relative"
        sx={{
          height: "30vh",
          backgroundColor: `${colors.polariser[600]}`,
        }}
      >
        {/* Clock */}
        <Box position="absolute" align="center" width="100%">
          {clockMode === "digital" ? (
            <DigitalClock
              is24HourFormat={is24HourFormat}
              toggleTimeFormat={ontoggleTimeFormat}
            />
          ) : (
            <AnalogClock color={colors.grey[100]} />
          )}
        </Box>
      </Box>
      {/*bottom section */}
      <Box
        mt={4}
        display="flex"
        justifyContent="space-between"
        gap={3}
        flexWrap="wrap"
        m="2.5vh 25px 20px 25px"
      >
        {/* StickyNote Area */}
        <Box
          flex={1}
          minWidth={200}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            height: "100%",
          }}
        >
          {/*title and search bar */}
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              backgroundColor: `${colors.polariser[600]}`,
              overflow: "auto",
              height: "100%",
            }}
          >
            <Typography
              variant="h4"
              m="10px"
              align="center"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ userSelect: "none" }}
            >
              Sticky Notes
            </Typography>
            <Box my={2}>
              <Search handleSearchNote={setSearchText} />
            </Box>

            {/* Notes List Component of stickynotes */}
            <Box
              sx={{
                padding: "16px",
                position: "sticky",
                top: "116px",
                zIndex: 1,
              }}
            >
              <NotesList
                notes={notes.filter((note) =>
                  note.text.toLowerCase().includes(searchText)
                )}
                handleAddNote={addNote}
                handleDeleteNote={deleteNote}
              />
            </Box>
          </Paper>
        </Box>

        {/* Todo List Area */}
        <Box
          flex={1}
          minWidth={200}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "100%",
            padding: "16px",
            overflow: "auto",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              backgroundColor: `${colors.polariser[600]}`,
            }}
          >
            <Typography
              variant="h4"
              m="1.6vh"
              align="center"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ userSelect: "none", overflow: "auto" }}
            >
              Todo List
            </Typography>
            <TodoList />
          </Paper>
        </Box>

        {/* Calendar Area */}
        <Box
          flex={1}
          minWidth={200}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "100%",
            padding: "16px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              overflow: "auto",
              backgroundColor: `${colors.polariser[600]}`,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              {/* CALENDAR */}
              <Box
                flex="1 1 100%"
                ml="15px"
                sx={{
                  "& .fc-view-harness": {
                    background: `${colors.polariser[100]} !important`,
                  },
                  "& .fc-day-today": {
                    background: `rgba(0,0,0,0) !important`,
                  },
                  "& .fc-popover": {
                    background: `${colors.primary[400]} !important`,
                  },
                  "& .fc-list-day": {
                    background: `${colors.sunglasses[400]} !important`,
                  },
                  "& .fc-header-toolbar": {
                    display: "none",
                  },
                }}
              >
                <Link
                  to="/calendar"
                  style={{
                    textDecoration: "none",
                    color: `${colors.blackWhite[100]}`,
                  }}
                >
                  <FullCalendar
                    height="60vh"
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      listPlugin,
                    ]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "timeGridDay",
                    }}
                    initialView="timeGridDay"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    eventsSet={(events) => setCurrentEvents(events)}
                    initialEvents={[
                      {
                        id: "12315",
                        title: "Event 1",
                        date: "2023-09-14",
                      },
                      {
                        id: "5123",
                        title: "Event 2",
                        date: "2023-09-28",
                      },
                    ]}
                  />
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
