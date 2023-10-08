import { useState, useEffect } from "react";
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
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  // current events gives all the events needed gonna have to set it to initial events i guess
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    setInitialEvents(currentEvents);
  }, [currentEvents]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

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
      <button
        onClick={() => {
          console.log(initialEvents);
        }}
      >
        Initial events
      </button>
    </Box>
  );
};

export default Calendar;

/* [
              {
                id: "12315",
                title: "Recurring Event",
                date: "2023-09-14",
                daysOfWeek: [1, 5], // 1 for monday and 5 for friday (sunday is 0 etc.)
                startRecur: "2023-09-14", //start date
                endRecur: "2023-10-14", //Note: This value is exclusive. Just like every other end-date in the API. For all-day recurring events, make the endRecur the day after you want your last recurrence.
              },
              {
                id: "54321",
                title: "All day event",
                date: "2023-09-28",
                allDay: true,
              },
            ]
            
            
            
            
            
            
            
            
            
            
            
            */
