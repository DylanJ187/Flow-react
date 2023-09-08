import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import "./Table.css";
import { tokens } from "../../theme";
import { Box, useTheme } from "@mui/material";
import Modal from "./modal.jsx";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useState } from "react";

const Table = ({ rows = [], deleteRow, editRow }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modalOpen, setModalOpen] = useState(false);

  // Providing a default value for rows
  if (!Array.isArray(rows)) {
    // Checking if rows is an array
    return <p>Error: rows is not an array or is undefined.</p>;
  }

  return (
    <Box className="table-wrapper">
      <table className="table">
        <Box className="thead" backgroundColor={colors.blueAccent[700]}>
          <tr>
            <th id="subject"> Subject</th>
            <th id="description">Description</th>
            <th id="status">Status</th>
            <th id="actions">Actions </th>
          </tr>
        </Box>
        <Box backgroundColor={colors.primary[400]}>
          <tbody>
            {rows.map((row, idx) => {
              const formatSubject = (subject) => {
                return subject
                  .split("-")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toUpperCase()
                  )
                  .join(" ");
              };
              const subjectText = formatSubject(row.subject);
              const formatStatus = (status) => {
                return status
                  .split("-")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");
              };
              const statusText = formatStatus(row.status);

              return (
                <tr key={idx}>
                  <td>{subjectText}</td>
                  <td className="expand">{row.description}</td>
                  <td>
                    <span className={`label label-${row.status}`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="fit">
                    <span className="actions">
                      <DeleteForeverOutlinedIcon
                        className="delete-btn"
                        onClick={() => deleteRow(idx)}
                      />
                      <EditOutlinedIcon
                        className="edit-btn"
                        onClick={() => editRow(idx)}
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Box>
      </table>
    </Box>
  );
};

export default Table;
