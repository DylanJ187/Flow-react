import { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { randomId } from "@mui/x-data-grid-generator";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import SaveContext from "../global/savecontext";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { shouldSave, setShouldSave } = useContext(SaveContext);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  // current events gives all the events needed gonna have to set it to initial events i guess
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [startRecur, setStartRecur] = useState("");
  const [endRecur, setEndRecur] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [dayError, setDayError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  useEffect(() => {
    if (shouldSave) {
      handleSave();
      setShouldSave(false); // reset after handling save
    }
  }, [shouldSave]);

  const handleSave = () => {
    const formattedEvents = currentEvents.map(transformEvent);

    // Convert objects to string for deep comparison.
    if (JSON.stringify(formattedEvents) !== JSON.stringify(initialEvents)) {
      setInitialEvents(formattedEvents);

      // This is where you'd integrate your save to the backend
      // For example, an API call to save the updated events
      // Mock API call
      fetch("https://your-api-endpoint.com/saveEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedEvents),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const transformEvent = (event) => {
    return {
      id: event.id,
      title: event.title,
      date: event.dateStr,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      startRecur: event.startRecur,
      endRecur: event.endRecur,
      daysOfWeek: event.daysOfWeek,
    };
  };

  useEffect(() => {
    if (shouldSave) {
      const formattedEvents = currentEvents.map(transformEvent);

      // Convert objects to string for deep comparison.
      if (JSON.stringify(formattedEvents) !== JSON.stringify(initialEvents)) {
        setInitialEvents(formattedEvents);

        // This is where you'd integrate your save to the backend
        // For example, an API call to save the updated events
      }

      setShouldSave(false); // Reset the trigger after handling the save
    }
  }, [shouldSave, currentEvents, initialEvents]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleDateClick = (selected) => {
    setSelectedInfo(selected);
    setStartRecur(selected.dateStr); // Set the start recurrence date to the selected date
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setIsRecurring(false);
    setDaysOfWeek([]);
    setEndRecur("");
  };

  const handleConfirm = () => {
    const calendarApi = selectedInfo.view.calendar;
    calendarApi.unselect();

    let hasError = false;

    // Validate title
    if (!title) {
      setTitleError("Title is required");
      hasError = true;
    } else {
      setTitleError("");
    }

    // Only validate daysOfWeek and endRecur if isRecurring is true
    if (isRecurring) {
      // Validate at least one day selected for recurring event
      if (daysOfWeek.length === 0) {
        setDayError("At least one day must be selected for recurring event");
        hasError = true;
      } else {
        setDayError("");
      }

      // Validate end date
      if (!endRecur) {
        setEndDateError("End date is required");
        hasError = true;
      } else {
        setEndDateError("");
      }
    }

    if (hasError) {
      // If there are errors, do not proceed with event creation
      return;
    }

    const eventObj = {
      id: randomId(),
      title,
      start: selectedInfo.startStr,
      end: selectedInfo.endStr,
      allDay: selectedInfo.allDay,
    };

    if (isRecurring) {
      eventObj.daysOfWeek = daysOfWeek;
      eventObj.startRecur = eventObj.start;

      if (eventObj.allDay) {
        const endRecurDate = new Date(endRecur);
        endRecurDate.setDate(endRecurDate.getDate() + 1); // Add one day
        eventObj.endRecur = endRecurDate.toISOString().split("T")[0];
      } else {
        const startRecurDate = new Date(eventObj.startRecur);
        startRecurDate.setDate(startRecurDate.getDate() + 28);
        eventObj.endRecur = startRecurDate.toISOString().split("T")[0];
      }
    }

    calendarApi.addEvent(eventObj);

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

  const toggleDayOfWeek = (day) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek((prev) => prev.filter((d) => d !== day));
    } else {
      setDaysOfWeek((prev) => [...prev, day]);
    }
  };

  const DayButton = ({ dayIndex, label }) => {
    const isSelected = daysOfWeek.includes(dayIndex);

    return (
      <button
        onClick={() => toggleDayOfWeek(dayIndex)}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          margin: "0 5px",
          padding: "0",
          minWidth: "auto",
          textTransform: "none",
          backgroundColor: isSelected
            ? `${colors.sunglasses[200]}`
            : "rgba(0,0,0,0)",
          border: "none",
          color: `${colors.blackWhite[100]}`,
          cursor: "pointer",
          outline: "none", // Note: Removing outline will make it less accessible, consider adding a focus style instead
          transition: "background-color 0.3s ease", // Smooth transition for color change
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <Box className="Container" m="10vh 20px 20px 20px" width="90vw">
      <Typography
        variant="h1"
        color={colors.grey[100]}
        fontWeight="bold"
        mb="5vh"
        sx={{ userSelect: "none" }}
      >
        Calendar
      </Typography>
      {/* ADD DIALOG */}
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
            error={!!titleError}
            helperText={titleError}
          />

          {/* recurring events */}
          <Box mt={2}>
            <label>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              Repeat Weekly?
            </label>
          </Box>
          {isRecurring && (
            <>
              <Box mt={2} display="flex" justifyContent="center">
                {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
                  <DayButton key={label} dayIndex={index} label={label} />
                ))}
              </Box>
              <label>End Date:</label>
              <TextField
                type="date"
                fullWidth
                value={endRecur}
                onChange={(e) => setEndRecur(e.target.value)}
                autoComplete="off"
                error={!!endDateError}
                helperText={endDateError}
              />
              <p style={{ color: `${colors.redAccent[200]}` }}>{dayError}</p>{" "}
            </>
          )}
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
      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the event '{eventToDelete?.title}'?
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
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.polariser[300]}
          p="15px"
          borderRadius="4px"
          sx={{
            "& .css-b1ubvp-MuiListItem-root": {
              background: `${colors.polariser[600]} !important`,
            },
          }}
          overflow="auto"
          height="75vh"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.primary[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

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
            "& .fc-daygrid-more-link": {
              with: "100% !important",
            },
          }}
        >
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth" /* right now this is set to a default value however we should store the last view and make this dynamic between one of [dayGridMonth,timeGridWeek,timeGridDay,listMonth] */
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={initialEvents}
          />
        </Box>
      </Box>
      {/*
      THIS BUTTON SHOWS initalEvents ARRAY BUT U GOTTA MAKE SURE IT SAVES FIRST SO LIKE CHANGE TABS THEN COME BACK AND IT SHOULD UPDATE BASED ON THE SAVE CONTEXT
      
      <button
        onClick={() => {
          console.log("Formatted Current Events:", initialEvents);
        }}
      >
        Log Initial Events
      </button> */}
    </Box>
  );
};

export default Calendar;
