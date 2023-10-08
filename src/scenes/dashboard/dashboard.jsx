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
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);

  const lightModeBg =
    "https://i.pinimg.com/originals/ab/5e/2f/ab5e2f3e85da65024f01aba92331c882.gif"; // light mode cover
  const darkModeBg =
    "https://i.pinimg.com/originals/a0/17/50/a01750b92bbaf25ef3e83e6716cdfffc.gif"; // dark mode cover

  const currentBg = theme.palette.mode === "light" ? lightModeBg : darkModeBg;

  const handleDateClick = (selected) => {
    setSelectedInfo(selected);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle(""); // Reset title
  };

  const handleConfirm = () => {
    const calendarApi = selectedInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selectedInfo.dateStr}-${title}`, // Consider using a UUID or a DB auto-incremented ID
        title,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        allDay: selectedInfo.allDay,
      });
      // Here you would make a POST request to your API to save the event in the MySQL database.
    }

    handleClose();
  };

  const handleEventClick = (selected) => {
    setEventToDelete(selected.event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      eventToDelete.remove();

      // Here you would make a DELETE request to your API to delete the event from the MySQL database.

      setEventToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setEventToDelete(null);
    setDeleteDialogOpen(false);
  };

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
      {/* Top section with background Image/GIF and floating AnalogClock */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
        style={{
          backgroundImage: `url('${currentBg}')`, // Use the currentBg variable here
          backgroundSize: "100%",
          backgroundPosition: "center",
          height: "300px",
        }}
      >
        <Box
          position="absolute"
          top="17%"
          align="center"
          transform="translateY(-50%)"
        >
          <AnalogClock
            color={theme.palette.mode === "light" ? "black" : "white"}
          />
        </Box>
      </Box>

      <Box
        mt={4}
        display="flex"
        justifyContent="space-between"
        gap={3}
        flexWrap="wrap"
        m="2.5vh 25px 20px 25px"
      >
        {/* StickyNote Area */}
        <Box flex={1} minWidth={200}>
          <Paper
            elevation={3}
            style={{ padding: "16px", overflow: "auto", height: "605px" }}
          >
            <Typography
              variant="h4"
              m="1.6vh"
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

            {/* Notes List Component */}
            <NotesList
              notes={notes.filter((note) =>
                note.text.toLowerCase().includes(searchText)
              )}
              handleAddNote={addNote}
              handleDeleteNote={deleteNote}
            />
          </Paper>
        </Box>

        {/* Todo List Area */}
        <Box flex={1} minWidth={200}>
          <Paper
            elevation={3}
            style={{ padding: "16px", overflow: "auto", height: "605px" }}
          >
            <Typography
              variant="h4"
              m="1.6vh"
              align="center"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ userSelect: "none" }}
            >
              Todo List
            </Typography>
            <TodoList />
          </Paper>
        </Box>

        {/* Calendar Area */}
        <Box flex={1} minWidth={200}>
          <Paper elevation={3} style={{ padding: "16px", overflow: "auto" }}>
            <Dialog
              open={open}
              onClose={handleClose}
              sx={{
                "& .css-kodhn6-MuiFormLabel-root-MuiInputLabel-root": {
                  color: `${colors.primary[100]} !important`,
                },
              }}
            >
              <DialogTitle>Add New Event</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Event Title"
                  type="text"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="off"
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  sx={{ color: `${colors.primary[100]}` }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  sx={{ color: `${colors.primary[100]}` }}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                Are you sure you want to delete the event '
                {eventToDelete?.title}'?
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleDeleteCancel}
                  sx={{ color: `${colors.primary[100]}` }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  sx={{ color: `${colors.primary[100]}` }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
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
                    background: `${colors.polariser[600]} !important`,
                    /* uhhh i changed the default highlight color of the day*/
                  },
                  "& .fc-popover": {
                    background: `${colors.primary[400]} !important`,
                  },
                  "& .fc-list-day": {
                    background: `${colors.sunglasses[400]} !important`,
                  },
                  "& .fc-timeGridDay-button": {
                    background: `${colors.blackWhite[200]} !important`,
                    border: "0px",
                    userSelect: "none",
                  },
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
                  select={handleDateClick}
                  eventClick={handleEventClick}
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
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
