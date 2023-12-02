import { ColorModeContext, useMode } from "./theme";
import React, { createContext, useState } from "react";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Form from "./components/form";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/dashboard";
import Calendar from "./scenes/calendar/calendar.jsx";
import Tasklist from "./scenes/tasklist/tasklist";
import Notes from "./scenes/notes/notes.jsx";
import Settings from "./scenes/settings/settings";
import lightBackgroundURL from "./background-images/light-background-default.jpg";
import darkBackgroundURL from "./background-images/dark-background-default.jpg";
import { useLocation } from "react-router-dom";
import SaveProvider from "./scenes/global/saveprovider";

export const SubjectContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [clockMode, setClockMode] = useState("digital");
  const [is24HourFormat, setIs24HourFormat] = useState(true); // Define these variables

  const toggleTimeFormat = () => {
    setIs24HourFormat((prevFormat) => !prevFormat);
  };

  console.log(theme, colorMode);

  const backgroundImageURL =
    theme.palette.mode === "dark" ? darkBackgroundURL : lightBackgroundURL;

  // Get the current location
  const location = useLocation();

  const [subjectArray, setSubjectArray] = useState([]);

  return (
    <SaveProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <SubjectContext.Provider value={{ subjectArray, setSubjectArray }}>
            <CssBaseline />
            <div className="app">
              {/* Render Sidebar only if the route is not /signin */}
              {location.pathname !== "/signin" && <Sidebar />}
              <Box
                sx={{
                  backgroundImage: `url(${backgroundImageURL})`,
                  backgroundPosition: `center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `cover`,
                  height: "100%",
                  width: "100%",
                }}
              >
                <main className="content">
                  <Routes>
                    <Route path="/signin" element={<Form />} />
                    <Route
                      path="/"
                      element={
                        <Dashboard
                          clockMode={clockMode}
                          setClockMode={setClockMode}
                        />
                      }
                    />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/tasklist" element={<Tasklist />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route
                      path="/"
                      element={
                        <Dashboard
                          clockMode={clockMode}
                          setClockMode={setClockMode}
                          is24HourFormat={is24HourFormat}
                          setIs24HourFormat={setIs24HourFormat}
                        />
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <Settings
                          clockMode={clockMode}
                          setClockMode={setClockMode}
                          is24HourFormat={is24HourFormat}
                          setIs24HourFormat={setIs24HourFormat} // Pass the setIs24HourFormat prop
                          onToggleTimeFormat={toggleTimeFormat}
                        />
                      }
                    />
                  </Routes>
                </main>
              </Box>
            </div>
          </SubjectContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SaveProvider>
  );
}

export default App;
