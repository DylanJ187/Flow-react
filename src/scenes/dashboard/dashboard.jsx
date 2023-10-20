import AnalogClock from "../../components/analogclock.jsx";
import { useState } from "react";
import TodoList from "./todolist";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";
import listPlugin from "@fullcalendar/list";
import { Search, Note, AddNote, NotesList } from "./stickynotes.jsx";
import { nanoid } from "nanoid";
import { Box, Paper, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  const [notes, setNotes] = useState([
    // Initial state or fetch from a database, local storage etc.
  ]);
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

  return (
    <Box className="Container" m="0vh 0px 0px 0px">
      {/*Top section */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
        sx={{
          height: "30vh",
          backgroundColor: `${colors.polariser[600]}`,
        }}
      >
        <Box
          position="absolute"
          top="17%"
          align="center"
          transform="translateY(-50%)"
        ></Box>
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
            height: "66vh",
          }}
        >
          {/*title and search bar */}
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              height: "100%",
              backgroundColor: `${colors.polariser[600]}`,
            }}
          >
            <Box sx={{ height: "75px", mb: "10px" }}>
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
            </Box>

            {/* Notes List Component of stickynotes */}
            <Box
              sx={{
                height: "78%",
                overflow: "auto",
                "& .css-1v8x7dw": {
                  overflow: "auto",
                },
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
        <Box flex={1} minWidth={200}>
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              height: "66vh",
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
        <Box flex={1} minWidth={200}>
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              overflow: "auto",
              height: "66vh",
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
                    /* uhhh i changed the default highlight color of the day*/
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
                    initialView="timeGridDay" /* right now this is set to a default value however we should store the last view and make this dynamic between one of [dayGridMonth,timeGridWeek,timeGridDay,listMonth] */
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    eventsSet={(events) => setCurrentEvents(events)}
                    initialEvents={[
                      /*
 
            Here you'd typically fetch user events from your MySQL database via your API
            during component mounting (useEffect hook). For now, we have sample events but this should be something like initialEvents={initialEvents} where we import that object array from the data base.

            e.g:              */

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
