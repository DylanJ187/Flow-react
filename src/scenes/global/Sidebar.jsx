import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Light } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={onClick || (() => setSelected(title))}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const themeIcon =
    theme.palette.mode === "dark" ? (
      <DarkModeOutlinedIcon />
    ) : (
      <LightModeOutlinedIcon />
    );
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const findBoxWidth = (boxWidth) => {
    if (([isCollapsed, setIsCollapsed] = "useState(true)")) {
      let boxWidth = "84vw";
    } else {
      let boxWidth = "60vw";
    }
    console.log(boxWidth);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .css-1phms0m": {
          margin: "0px !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} style={{ position: "relative" }}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="5px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
                <Typography variant="logo" color={colors.grey[100]} mr="50px">
                  FLOW.
                </Typography>
              </Box>
            )}
          </MenuItem>
          {/*
IMAGE AND NAME ON SIDEBAR (PRETTY USELESS FOR OUR APP, NEED MORE SPACE FOR SUB NOTES)

{!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ margin: "10px 0" }}
                >
                  Dylan Jupp
                </Typography>
              </Box>
            </Box>
          )}
   */}
          <Box paddingLeft={isCollapsed ? undefined : "2%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tasklist"
              to="/tasklist"
              icon={<TaskOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Notes"
              to="/notes"
              icon={<EditOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
          <Box style={{ position: "absolute", bottom: "0", width: "100%" }}>
            <Item
              title="Change Theme"
              /*theme.palette.mode === "dark"
                  ? "Switch to Light"
                  : "Switch to Dark"*/

              icon={
                theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )
              }
              onClick={colorMode.toggleColorMode}
            />
            <Item
              title="Settings"
              to="/settings"
              icon={<SettingsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Profile"
              to="/profile"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};
export default Sidebar;