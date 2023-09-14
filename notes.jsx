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
          width: "20%",
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
          width: "80%",
          padding: "20px",
        }}
      >
        <div
          className="editor"
          style={{
            backgroundColor: `${colors.notesBack[100]}`,
            height: "90vh",
            overflow: "auto",
            borderRadius: "0.5rem",
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
        </div>
      </Box>
    </Box>
  );
};

export default Notes;
