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

function App() {
  const [theme, colorMode] = useMode();
  const lightBackgroundURL =
    "https://r4.wallpaperflare.com/wallpaper/712/514/493/minimalist-low-poly-fantasy-landscape-low-poly-art-wallpaper-68f66da850601c0840ac816e7812d4aa.jpg";
  const darkBackgroundURL =
    "https://1.bp.blogspot.com/-of6YX1vqn-c/X_GoKh_4dfI/AAAAAAAABoo/yEHpFMp9rSgOQ7doBp6hhIjpXiNFJjTFQCPcBGAYYCw/s16000/83255234.jpg";

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

{
  /*
  
possible dark mode images:

https://1.bp.blogspot.com/-of6YX1vqn-c/X_GoKh_4dfI/AAAAAAAABoo/yEHpFMp9rSgOQ7doBp6hhIjpXiNFJjTFQCPcBGAYYCw/s16000/83255234.jpg

possible light mode images:

https://r4.wallpaperflare.com/wallpaper/712/514/493/minimalist-low-poly-fantasy-landscape-low-poly-art-wallpaper-68f66da850601c0840ac816e7812d4aa.jpg

*/
}
