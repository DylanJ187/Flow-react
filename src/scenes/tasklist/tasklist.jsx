import React, { useContext } from "react";
import { SubjectContext } from "./../../App";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

//This is a table that uses CRUD operations (Create, Read, Update, Delete) so read up on how APIs typically call for these operations. I've noted out all the relevant areas I think

const initialRows = [
  /* This array is rendered as the rows when you open the tasklist tab so whatever you store in the database should be what pushed as initialRows */
  {
    id: 1,
    subject: "Physics HL",
    description: "Write topic 4 notes",
    due: new Date(2023, 9, 30),
    status: "Complete",
    isNew: false,
  },
  {
    id: 2,
    subject: "Math AA HL",
    description: "Practice circular motion Q's",
    due: new Date(2023, 9, 30),
    status: "Incomplete",
  },
  {
    id: 3,
    subject: "Chemistry HL",
    description: "Review for statistics test",
    due: new Date(2023, 9, 30),
    status: "Overdue",
  },
  {
    id: 4,
    subject: "Eng LangLit SL",
    description: "Paper 1 practice",
    due: new Date(2023, 9, 30),
    status: "In Progress",
  },
  {
    id: 5,
    subject: "Economics SL",
    description: "Start writing I.A",
    due: new Date(2023, 9, 30),
    status: " Not Started",
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;

  //Triggered when the "Add Task" button is clicked.
  const handleClick = () => {
    const newId = Math.max(...rows.map((row) => row.id)) + 1;
    setRows((oldRows) => [
      ...oldRows,
      {
        id: newId, //maximum ID value mapped in rows array +1
        subject: "",
        description: "",
        due: new Date(),
        status: "Not Started",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "subject" },
    }));
    // For database integration: Consider sending a POST request here to create a new task on the server.
    // The server should respond with the new task's ID which can then be added to the client's state.
  };

  return (
    <GridToolbarContainer>
      <Button startIcon={<AddIcon />} onClick={handleClick}>
        <div className="add-task-css">Add Task</div>
      </Button>
    </GridToolbarContainer>
  );
}

const Tasklist = () => {
  const [rows, setRows] = React.useState(initialRows); // This state holds all the task rows. For database integration, initial data should be fetched from the server.
  const [rowModesModel, setRowModesModel] = React.useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { subjectArray } = useContext(SubjectContext);

  //CRUD operations

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      // Save the row when it loses focus.
      const editedRow = rows.find((row) => row.id === params.id);
      if (editedRow) {
        // Update the row (you could send it to the server here too if necessary)
        processRowUpdate(editedRow);
        // Switch the row back to view mode
        setRowModesModel({
          ...rowModesModel,
          [params.id]: { mode: GridRowModes.View },
        });
      }
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // Triggered when a task is edited AND saved or newly createf AND saved.
  const handleSaveClick = (id) => () => {
    // Triggered when a task is edited and saved.
    const editedRow = rows.find((row) => row.id === id); // For database integration: Send the updated task to the server using a PUT request here.
    if (editedRow.isNew) {
      setRows(
        rows.map((row) => {
          if (row.id === id) {
            return { ...row, isNew: false };
          }
          return row;
        })
      );
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // Triggered when a task is deleted.
  const handleDeleteClick = (id) => () => {
    // For database integration: Send a DELETE request to the server to delete the task.
    setRows(rows.filter((row) => row.id !== id));
  };

  // Triggered when a task's edit is canceled.
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    // If the task is newly created and not saved, removing it.
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      // For database integration: If the row was already persisted to the database before this, send a DELETE request.
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // Function for when a row is updated. Processed row could be sent to the server for saving.
  const processRowUpdate = (newRow) => {
    // For database integration: Send a PUT request here with the updated task data.
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //end of CRUD operations

  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      editable: true,
      type: "singleSelect",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      valueOptions: [...subjectArray, "Core"],
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      align: "center",
      editable: true,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => <Box className="expand">{params.value}</Box>,
    },
    {
      field: "due",
      headerName: "Due",
      type: "date",
      width: 120,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Not Started", "In Progress", "Completed", "Overdue"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      sortable: false,
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 8,
  });

  const handlePaginationModelChange = (model) => {
    setPagination(model.pagination);
  };

  return (
    <Box
      className="Container"
      m="10vh 20px 20px 20px"
      sx={{
        "&  .css-1w53k9d-MuiDataGrid-overlay": {
          height: "0px",
          width: "0px",
        },
        "& .MuiDataGrid-cell--editing": {
          backgroundColor: `${colors.polariser[200]} !important`,
        },

        "& .css-14ladji-MuiDataGrid-root": {
          backgroundColor: `${colors.polariser[200]} !important`,
        },
        "& .css-1d6wzja-MuiButton-startIcon": {
          color: `${colors.primary[100]} !important`,
        },
        "& .add-task-css": {
          color: `${colors.primary[100]} !important`,
        },
        "& .css-196n7va-MuiSvgIcon-root": {
          color: `${colors.primary[100]} !important`,
        },
        "& .actions": {
          backgroundColor: `rgba(0,0,0,0) !important`,
        },
        "& .MuiDataGrid-root": {
          fontSize: "0.90rem",
        },
      }}
    >
      <Typography
        variant="h1"
        color={colors.grey[100]}
        fontWeight="bold"
        mb="2vh"
        user-select="none"
        sx={{ userSelect: "none" }}
      >
        Tasklist
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        disableColumnMenu
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows },
        }}
        sx={{ backgroundColor: `${colors.polariser[200]} !important` }}
        disableRowSelectionOnClick
        paginationModel={pagination}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[8]}
      />
    </Box>
  );
};

export default Tasklist;
