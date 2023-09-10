import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { tokens } from "../../theme";

const Table = ({ rows = [], deleteRow, editRow }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const formatText = (text) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      width: 112.46,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatText(params.value),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Box className="expand">{params.value}</Box>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 125.59,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Box
          className={`label label-${params.value}`}
          sx={{ backgroundColor: getLabelColor(params.value) }}
        >
          {formatText(params.value)}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 66.73,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box className="actions">
          <DeleteForeverOutlinedIcon
            className="delete-btn"
            onClick={() => deleteRow(params.row.id)}
          />
          <EditOutlinedIcon
            className="edit-btn"
            onClick={() => editRow(params.row.id)}
          />
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const getLabelColor = (status) => {
    switch (status) {
      case "in-Progress":
        return "#ffbd4c";
      case "completed":
        return "#42a942";
      case "overdue":
        return "#d9534f";
      case "not-Started":
        return "#777";
      default:
        return "transparent";
    }
  };

  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 7,
  });

  const handlePaginationModelChange = (model) => {
    setPagination(model.pagination);
  };

  return (
    <Box
      sx={{
        width: "100%",
        "& .table": {
          display: "block",
          overflow: "hidden",
          tableLayout: "fixed",
          borderCollapse: "collapse",
          borderRadius: "10px",
          whiteSpace: "nowrap",
          width: "100em",
          maxWidth: "80%",
          margin: "auto",
          overflowX: "auto",
        },
        "& .table td": {
          borderTop: "0.5px solid #ddd",
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: "0.8rem",
        },
        "& .label": {
          borderRadius: "3px",
          padding: "0.3rem",
          color: "white",
          width: "100px",
          display: "inline-block",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        "& .actions": {
          display: "flex",
          justifyContent: "space-around",
          "& svg": {
            cursor: "pointer",
          },
        },
        "&  .css-1w53k9d-MuiDataGrid-overlay": {
          height: "0px",
          width: "0px",
        },
      }}
    >
      <DataGrid
        rows={rows.map((row, idx) => ({ ...row, id: idx }))}
        columns={columns}
        sx={{ backgroundColor: `${colors.sunglasses[400]} !important` }}
        disableRowSelectionOnClick
        paginationModel={pagination}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[7]}
      />
    </Box>
  );
};

export default Table;
