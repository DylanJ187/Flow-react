import React, { useContext, useEffect} from "react";
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
import axios from 'axios'
import { constrainPoint } from "@fullcalendar/core/internal";
//This is a table that uses CRUD operations (Create, Read, Update, Delete) so read up on how APIs typically call for these operations. I've noted out all the relevant areas I think
/*
let initialRows = [
  // This array is rendered as the rows when you open the tasklist tab so whatever you store in the database should be what pushed as initialRows
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
*/
/*
let user = 'admin'
let initialRows = []
axios({
  method: "GET",
  url: `http://localhost:5000/api/getTask/${user}`,
}).then(response => {
  initialRows = response.data;
  console.log(initialRows)
  console.log(typeof initialRows)
}).catch(error => {
  console.log("error fetching task",error)
})
*/
let initialRows = []
function EditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;

  //Triggered when the "Add Task" button is clicked.
  const handleClick = () => {
    const newId = Math.max(Math.max(...rows.map((row) => row.id)) + 1,0);
    const Data = {
      id: newId, //maximum ID value mapped in rows array +1
      subject: "",
      description: "",
      due: new Date(),
      status: "Not Started",
      isNew: true,
    }
    /*
    axios({
      method: "POST",
      url: 'http://localhost:5000/api/createTask',
      data: Data
    })
    */
    setRows((oldRows) => [
      ...oldRows,Data,
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
let taskIdTodDelete = -1;
let newEnter = true;
const Tasklist = () => {
  const [rows, setRows] = React.useState(initialRows); // This state holds all the task rows. For database integration, initial data should be fetched from the server.
  useEffect(() => {
    if(newEnter == true) {
      console.log('User entered the tasklist page');
      //fetching the data from the database
      let user = 'admin';

      axios({
        method: "GET",
        url: `http://localhost:5000/api/getTask/${user}`,
      })
      .then(response => {
        setRows(response.data);  // Setting the data to React's state
        //rows = response.data
        console.log(rows)
      })
      .catch(error => {
        console.log("error fetching task", error);
      });
      newEnter = false;
    }
    console.log('User entered the tasklist page');

    // This is the cleanup function that will be called when the component is unmounted
    return async () => {
        initialRows = rows;
        saveData(rows);
        console.log(rows)
        
        if(taskIdTodDelete !== -1) {
          axios({
            method: "DELETE",
            url: `http://localhost:5000/api/deleteTask/${taskIdTodDelete}`,
          });
        }
        
        taskIdTodDelete = -1
        console.log('User left the tasklist page');
        console.log(taskIdTodDelete)
    };
  }, [rows]);
  
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
        console.log("focus out")
        console.log(rows)
        // Switch the row back to view mode
        setRowModesModel({
          ...rowModesModel,
          [params.id]: { mode: GridRowModes.View },
        });
      }
      event.defaultMuiPrevented = true;
      /*
      axios({
        method: "PUT",
        url: 'http://localhost:5000/api/editTask',
        data: editedRow
      });
      */
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    console.log(rows)
  };

  // Triggered when a task is edited AND saved or newly createf AND saved.
  const handleSaveClick = (id) => () => {
    console.log("save button is clicked")

    setRows((currentRows) => {
        let editedRowIndex = currentRows.findIndex((row) => row.id === id);
        if (editedRowIndex === -1) {
            return currentRows; 
        }
  
        const updatedRows = [...currentRows]; 
  
        if (updatedRows[editedRowIndex].isNew) {
            updatedRows[editedRowIndex] = { ...updatedRows[editedRowIndex], isNew: false };
        }

        // After setting rows, then save the data
        //saveData(updatedRows);  // Assuming saveData uses updatedRows now

        return updatedRows;
    });

    setRowModesModel((currentMode) => ({ ...currentMode, [id]: { mode: GridRowModes.View } }));
};


const saveData = async (data) => {
  console.log(data)
  const promises = data.map(row => {
    return axios({
      method: "POST",
      url: 'http://localhost:5000/api/createTask',
      data: row
    });
  });
  await Promise.all(promises);
  console.log("saved");
}

  const log = () => {
    console.log(rows)
    saveData()
  }
  // Triggered when a task is deleted.
  const handleDeleteClick = (id) => () => {
    // For database integration: Send a DELETE request to the server to delete the task.
    setRows(rows.filter((row) => row.id !== id));
    /*
    axios({
      method: "DELETE",
      url: 'http://localhost:5000/api/deleteTask',
      data: id
    });
    */
   /*
    axios({
      method: "DELETE",
      url: `http://localhost:5000/api/deleteTask/${id}`,
    });
    */
    taskIdTodDelete = id;
    console.log("row deleted")
    console.log(id)
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
      valueGetter: (params) => new Date(params.value)
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
    <Button onClick={log}>show rows</Button>
    </Box>
  );
};

export default Tasklist;
export const taskListData = initialRows;
