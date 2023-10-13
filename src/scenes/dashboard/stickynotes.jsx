import React, { useState } from "react";
import Box from "@mui/material/Box";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

// Search Component
export const Search = ({ handleSearchNote }) => {
  return (
    <div
      className="search"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgb(233, 233, 233)",
        borderRadius: "10px",
        padding: "5px",
        marginBottom: "1.5em",
      }}
    >
      <SearchOutlinedIcon className="search-icons" size="1.3em" />
      <input
        onChange={(event) => handleSearchNote(event.target.value)}
        type="text"
        placeholder="type to search..."
        style={{
          border: "none",
          backgroundColor: "rgb(233, 233, 233)",
          width: "100%",
        }}
      />
    </div>
  );
};

// Note Component
export const Note = ({ id, text, date, handleDeleteNote }) => {
  return (
    <div
      className="note"
      style={{
        backgroundColor: "#fef68a",
        borderRadius: "10px",
        padding: "1rem",
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        whiteSpace: "pre-wrap",
      }}
    >
      <span>{text}</span>
      <div
        className="note-footer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <small>{date}</small>
        <DeleteIcon
          onClick={() => handleDeleteNote(id)}
          className="delete-icon"
          size="1.3em"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

// AddNote Component
export const AddNote = ({ handleAddNote }) => {
  const [noteText, setNoteText] = useState("");
  const characterLimit = 200;

  const handleChange = (event) => {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value);
    }
  };

  const handleSaveClick = () => {
    if (noteText.trim().length > 0) {
      handleAddNote(noteText);
      setNoteText("");
    }
  };

  return (
    <div
      className="note new"
      style={{
        backgroundColor: "#67d7cc",
        borderRadius: "10px",
        padding: "1rem",
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        whiteSpace: "pre-wrap",
      }}
    >
      <textarea
        rows="8"
        cols="10"
        placeholder="Type to add a note..."
        value={noteText}
        onChange={handleChange}
        style={{
          border: "none",
          outline: "none",
          resize: "none",
          backgroundColor: "#67d7cc",
        }}
      ></textarea>
      <div
        className="note-footer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <small>{characterLimit - noteText.length} Remaining</small>
        <button
          className="save"
          onClick={handleSaveClick}
          style={{
            backgroundColor: "#e1e1e1",
            border: "none",
            borderRadius: "15px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

//NotesList Component with moving AddNote
export const NotesList = ({ notes, handleAddNote, handleDeleteNote }) => {
  return (
    <Box
      className="notes-list"
      sx={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        overflow: "auto",
      }}
    >
      {notes.map((note) => (
        <Note
          key={note.id} //key prop key prop added stop fucking warning me react please
          id={note.id}
          text={note.text}
          date={note.date}
          handleDeleteNote={handleDeleteNote}
        />
      ))}
      <AddNote handleAddNote={handleAddNote} />
    </Box>
  );
};

// NotesList Component stationary AddNote
{
  /*export const NotesList = ({ notes, handleAddNote, handleDeleteNote }) => {
  return (
    <Box
      className="notes-list"
      style={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      }}
    >
      <AddNote handleAddNote={handleAddNote} />
      {notes.map((note) => (
        <Note
          id={note.id}
          text={note.text}
          date={note.date}
          handleDeleteNote={handleDeleteNote}
        />
      ))}
    </Box>
  );
};*/
}
