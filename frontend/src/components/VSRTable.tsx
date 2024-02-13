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
  // return (
  return (
    <Box
      className={styles.container}
      sx={{
        "& .header": {
          // backgroundColor: "rgba(16, 45, 95, 1)",
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
        // getCellClassName={(params: GridRowParams<any, any, number>) => {
        //   if (params.field === 'city' || params.value == null) {
        //     return '';
        //   }
        //   return params.value %2 == 0 ? 'odd' : 'even';
        // }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        // getRowClassName={(params) => "even"}
        pageSizeOptions={[50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );

  // <div style={{ width: "80%" }}>
  //   <DataGrid
  //     rows={rows}
  //     columns={columns}
  //     initialState={{
  //       pagination: {
  //         paginationModel: { page: 0, pageSize: 50 },
  //       },
  //     }}
  //     pageSizeOptions={[50]}
  //     checkboxSelection
  //   />
  // </div>
  // );
}

// export default function VSRTable() {
//   const [order, setOrder] = React.useState<Order>("asc");
//   const [orderBy, setOrderBy] = React.useState<keyof Data>("date");
//   const [selected, setSelected] = React.useState<readonly number[]>([]);
//   const [page, setPage] = React.useState(0);
//   const [dense, setDense] = React.useState(false);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const newSelected = rows.map((n) => n.caseid);
//       setSelected(newSelected);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected: readonly number[] = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1),
//       );
//     }
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setDense(event.target.checked);
//   };

//   const isSelected = (id: number) => selected.indexOf(id) !== -1;

//   // Avoid a layout jump when reaching the last page with empty rows.
//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

//   const visibleRows = React.useMemo(
//     () =>
//       stableSort(rows, getComparator(order, orderBy)).slice(
//         page * rowsPerPage,
//         page * rowsPerPage + rowsPerPage,
//       ),
//     [order, orderBy, page, rowsPerPage],
//   );

//   return (
//     // <Box sx={{ width: "100%" }}>
//     //   <Paper sx={{ width: "100%", mb: 2 }}>
//     //     {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
//     //     <TableContainer>
//     //       <Table
//     //         sx={{ minWidth: 750 }}
//     //         aria-labelledby="tableTitle"
//     //         size={dense ? "small" : "medium"}
//     //       >
//     //         <EnhancedTableHead
//     //           numSelected={selected.length}
//     //           order={order}
//     //           orderBy={orderBy}
//     //           onSelectAllClick={handleSelectAllClick}
//     //           onRequestSort={handleRequestSort}
//     //           rowCount={rows.length}
//     //         />
//     //         <TableBody>
//     //           {visibleRows.map((row, index) => {
//     //             const isItemSelected = isSelected(row.caseid);
//     //             const labelId = `enhanced-table-checkbox-${index}`;

//     //             return (
//     //               <TableRow
//     //                 hover
//     //                 onClick={(event) => handleClick(event, row.caseid)}
//     //                 role="checkbox"
//     //                 aria-checked={isItemSelected}
//     //                 tabIndex={-1}
//     //                 key={row.caseid}
//     //                 selected={isItemSelected}
//     //                 sx={{ cursor: "pointer" }}
//     //               >
//     //                 <TableCell padding="checkbox">
//     //                   <Checkbox
//     //                     color="primary"
//     //                     checked={isItemSelected}
//     //                     inputProps={{
//     //                       "aria-labelledby": labelId,
//     //                     }}
//     //                   />
//     //                 </TableCell>
//     //                 <TableCell component="th" id={labelId} scope="row" padding="none">
//     //                   {row.name}
//     //                 </TableCell>
//     //                 <TableCell align="left">{row.caseid}</TableCell>
//     //                 <TableCell align="left">{row.military}</TableCell>
//     //                 <TableCell align="left">{row.name}</TableCell>
//     //                 <TableCell align="left">{row.status}</TableCell>
//     //                 <TableCell align="left">{row.date}</TableCell>
//     //               </TableRow>
//     //             );
//     //           })}
//     //           {emptyRows > 0 && (
//     //             <TableRow
//     //               style={{
//     //                 height: (dense ? 33 : 53) * emptyRows,
//     //               }}
//     //             >
//     //               <TableCell colSpan={6} />
//     //             </TableRow>
//     //           )}
//     //         </TableBody>
//     //       </Table>
//     //     </TableContainer>
//     //     <TablePagination
//     //       rowsPerPageOptions={[5, 10, 25]}
//     //       component="div"
//     //       count={rows.length}
//     //       rowsPerPage={rowsPerPage}
//     //       page={page}
//     //       onPageChange={handleChangePage}
//     //       onRowsPerPageChange={handleChangeRowsPerPage}
//     //     />
//     //   </Paper>
//     //   <FormControlLabel
//     //     control={<Switch checked={dense} onChange={handleChangeDense} />}
//     //     label="Dense padding"
//     //   />
//     // </Box>
//     <DataGrid
//     rows={rows}
//     columns={columns}
//     initialState={{
//       pagination: {
//         paginationModel: { page: 0, pageSize: 5 },
//       },
//     }}
//     pageSizeOptions={[5, 10]}
//     checkboxSelection
//   />
//   );
// }
