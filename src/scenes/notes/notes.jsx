import React from "react";
import { Box, useTheme } from "@mui/material";
import { useState } from "react";
import Editor from "./editor";
import { tokens } from "../../theme";
// Initial Data
const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "Sample Header",
        level: 1,
      },
    },
  ],
};

const Notes = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    /*------------CONTAINER------------*/

    <Box
      className="notes-container"
      style={{
        display: "flex",
        height: "100vh",
        margin: "20px",
      }}
    >
      {/*------------SIDEBAR------------*/}
      <Box
        className="notes-sidebar"
        style={{
          width: "15%",
          borderRight: "1px solid #ccc",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {" "}
      </Box>

      {/*------------TEXTAREA------------*/}
      <Box
        className="notes-text-area"
        style={{
          width: "85%",
          padding: "20px",
        }}
      >
        <Box
          className="editor"
          sx={{
            backgroundColor: `${colors.notesBack[100]}`,
            height: "90vh",
            overflow: "auto",

            borderRadius: "0.5rem",
            "& .ce-toolbar__plus": {
              //theming the buttons
              color: `${colors.blackWhite[100]} !important`,
              "&:hover": {
                backgroundColor: `${colors.primary[400]} !important`,
              },
            },
            "& .ce-toolbar__settings-btn": {
              color: `${colors.blackWhite[100]} !important`,
              "&:hover": {
                backgroundColor: `${colors.primary[400]} !important`,
              },
            },
            "& .tc-toolbox--showed": {
              color: `${colors.blackWhite[200]} !important`,
            },
            "& .tc-add-row": {
              "&::before": {
                color: "rgba(0,0,0,0) !important",
                backgroundColor: "rgba(0,0,0,0) !important",
              },
              "&:hover": {
                backgroundColor: `${colors.sunglasses[400]} !important`,
                borderRadius: "5px !important",
              },
            },
            "& .tc-add-column": {
              backgroundColor: "rgba(0,0,0,0) !important",
              "&:hover": {
                backgroundColor: `${colors.sunglasses[400]} !important`,
                borderRadius: "5px !important",
              },
            },
            "& .tc-table": {
              backgroundColor: "rgba(0,0,0,0) !important",
            },
            "& .tc-toolbox--row": {
              backgroundColor: "rgba(0,0,0,0) !important",
            },
            "& .tc-cell--selected": {
              backgroundColor: "rgba(0,0,200,0.1) !important",
              borderRadius: "5px !important",
            },
            "& .tc-row--selected": {
              backgroundColor: "rgba(0,0,200,0.1) !important",
              borderRadius: "5px !important",
            },
            "& .tc-row--selected::after": {
              backgroundColor: "rgba(0,0,0,0) !important",
            },
            "& .tc-wrap": {
              border: "5px !important",
              borderColor: `${colors.blackWhite[100]} !important`,
            },
            "& .tc-popover__item-icon": {
              color: "#000 !important",
            },
            "& .tc-popover__item": {
              color: "#000 !important",
            },
            "& .tc-popover__item-label": {
              color: "#000 !important",
            },
            "& .ce-inline-toolbar__dropdown-content": {
              color: "#000 !important",
            },
            "& .ce-inline-toolbar__dropdown-arrow": {
              color: "#000 !important",
            },
            "& .ce-inline-toolbar__buttons": {
              color: "#000 !important",
            },
            "& a": {
              color: `${colors.blueAccent[300]}`,
            },
          }}
        >
          <Editor
            data={data}
            onChange={setData}
            editorblock="editorjs-container"
          />
          <button
            className="savebtn"
            onClick={() => {
              alert(JSON.stringify(data));
              console.log(data);
            }}
          >
            see data
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Notes;
