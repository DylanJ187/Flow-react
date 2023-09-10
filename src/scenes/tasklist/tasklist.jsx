import React from "react";
import { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Table from "./table";
import Modal from "./modal.jsx";
import { tokens } from "../../theme";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import "./Modal.css";
const Tasklist = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);

  const handleDeleteRow = (targetIndex) => {
    setRows(rows.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);

    setModalOpen(true);
  };

  const handleSubmit = (newRow) => {
    rowToEdit === null
      ? setRows([...rows, newRow])
      : setRows(
          rows.map((currRow, idx) => {
            if (idx !== rowToEdit) return currRow;

            return newRow;
          })
        );
  };

  return (
    <Box className="Container" m="10vh 20px 20px 20px">
      <table className="task-header-table">
        <tr className="tr">
          <th>
            <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
              CREATE TASK
            </Typography>
          </th>
          <th>
            <Box
              className="AddButton"
              height="40px"
              width="40px"
              marginLeft="5px"
            >
              <button onClick={() => setModalOpen(true)} className="btn">
                <Box
                  sx={{
                    "& .css-ksjhvr-MuiSvgIcon-root": {
                      color: `${colors.primary[100]} !important`,
                    },
                  }}
                >
                  <AddBoxOutlinedIcon
                    fontSize="large"
                    color={colors.primary[400]}
                  />
                </Box>
              </button>
            </Box>
          </th>
        </tr>
      </table>
      <Box className="Table" m="2.5vh 0 0 0" height="60vh">
        <Table
          rows={rows}
          deleteRow={handleDeleteRow}
          editRow={handleEditRow}
        />
      </Box>
      {modalOpen && (
        <Modal
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && rows[rowToEdit]}
        />
      )}
    </Box>
  );
};

export default Tasklist;
