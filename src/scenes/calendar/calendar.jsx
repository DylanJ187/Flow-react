import { useState } from "react";
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

  // These states will manage the local events, consider syncing these with a database.
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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
    </Box>
  );
};

export default Calendar;
