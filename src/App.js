import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/dashboard";
import Calendar from "./scenes/calendar/calendar.jsx";
import Tasklist from "./scenes/tasklist/tasklist";
import Notes from "./scenes/notes/notes.jsx";
import Settings from "./scenes/settings/settings.jsx";
import Profile from "./scenes/profile/profile";
import lightBackgroundURL from "./background-images/light-background-default.jpg";
import darkBackgroundURL from "./background-images/dark-background-default.jpg";

function App() {
  const [theme, colorMode] = useMode();

  const backgroundImageURL =
    theme.palette.mode === "dark" ? darkBackgroundURL : lightBackgroundURL;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
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
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/tasklist" element={<Tasklist />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </Box>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
