"use client";

import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
// import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import styles from "src/components/VSRTable.module.css";
import { useEffect } from "react";
import { ClassNames } from "@emotion/react";
// import globals from "src/app/globals.css";

const columns: GridColDef[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 72,
    headerClassName: "header",
  },
  {
    field: "caseid",
    headerName: "Case ID",
    type: "string",
    width: 147,
    headerAlign: "left",
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: "military",
    headerName: "Military ID (Last 4)",
    type: "string",
    width: 206,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: "name",
    headerName: "Name",
    width: 233,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },

  {
    field: "date",
    headerName: "Date Received",
    type: "date",
    sortable: true,
    width: 160,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: "status",
    headerName: "Status",
    type: "string",
    width: 210,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
];

const rows = [
  {
    id: 1,
    caseid: "0001",
    military: 1234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 2,
    caseid: "0002",
    military: 2234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 3,
    caseid: "0003",
    military: 3234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 4,
    caseid: "0004",
    military: 4234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 5,
    caseid: "0005",
    military: 5234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 6,
    caseid: "0006",
    military: 6234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 7,
    caseid: "0007",
    military: 7234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 8,
    caseid: "0008",
    military: 8234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 9,
    caseid: "0009",
    military: 9234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
  {
    id: 10,
    caseid: "00010",
    military: 10234,
    name: "Justin Timberlake",
    date: new Date("2024-12-18"),
    status: "Received",
  },
];

export default function VSRTable() {
  useEffect(() => {
    // This function will run when the component is first loaded
    console.log("Page has been refreshed or loaded for the first time");
  }, []);
  return (
    <Box
      className={styles.container}
      sx={{
        "& .header": {
          color: "rgba(247, 247, 247, 1)",
          backgroundColor: "var(--color-tse-accent-blue-1)",
        },
        ".MuiDataGrid-columnSeparator": {
          display: "none",
        },
        "&.MuiDataGrid-root": {
          border: "none",
        },
        border: 0,
        "& .odd": {
          backgroundColor: "var(--color-tse-neutral-gray-0)",
          "&:hover": {
            backgroundColor: "var(--color-tse-neutral-gray-0) !important",
          },
          "&.Mui-hovered": {
            backgroundColor: "var(--color-tse-neutral-gray-0) !important",
          },

          "&.Mui-selected": {
            backgroundColor: "var(--color-tse-neutral-gray-0) !important",

            "&:hover": {
              backgroundColor: "var(--color-tse-neutral-gray-0) !important",
            },
          },
        },
        "& .even": {
          backgroundColor: "var(--color-tse-primary-light)",
          "&:hover": {
            backgroundColor: "var(--color-tse-primary-light) !important",
          },
          "&.Mui-hovered": {
            backgroundColor: "var(--color-tse-primary-light) !important",
          },

          "&.Mui-selected": {
            backgroundColor: "var(--color-tse-primary-light) !important",

            "&:hover": {
              backgroundColor: "var(--color-tse-primary-light) !important",
            },
          },
        },
      }}
    >
      <DataGrid
        className={styles.table}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
        }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        // getRowClassName={(params) => "even"}
        pageSizeOptions={[50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
