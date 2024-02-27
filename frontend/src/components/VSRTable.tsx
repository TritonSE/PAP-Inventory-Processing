"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect } from "react";
import { VSR, getAllVSRs } from "@/api/VSRs";

const columns: GridColDef[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 72,
    headerClassName: "header",
  },
  {
    field: "_id",
    headerName: "Case ID",
    type: "string",
    flex: 1,
    headerAlign: "left",
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: "military",
    headerName: "Military ID (Last 4)",
    type: "string",
    flex: 1,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },

  {
    field: "date",
    headerName: "Date Received",
    type: "date",
    sortable: true,
    flex: 1,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: "status",
    headerName: "Status",
    type: "string",
    flex: 1,
    headerClassName: "header",
    disableColumnMenu: true,
    hideSortIcons: true,
  },
];

export default function VSRTable() {
  const [vsrs, setVsrs] = React.useState<VSR[]>();

  useEffect(() => {
    getAllVSRs().then((result) => {
      if (result.success) {
        setVsrs(result.data);
      } else {
        // TODO better error handling
        alert(`Could not fetch VSRs: ${result.error}`);
      }
    });
  }, []);

  return (
    <Box
      style={{ width: "100%" }}
      sx={{
        "& .header": {
          color: "rgba(247, 247, 247, 1)",
          backgroundColor: "var(--color-tse-accent-blue-1)",
          // Customize color of checkboxes in header
          ".MuiCheckbox-root": {
            color: "white !important",
          },
          // Customize styles of text in header
          ".MuiDataGrid-columnHeaderTitle": {
            fontSize: "1.125rem",
            fontWeight: 600,
          },
        },
        // Hide the default white bar column separators
        ".MuiDataGrid-columnSeparator": {
          display: "none !important",
        },
        ".MuiDataGrid-cellContent": {
          fontSize: "1rem",
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
        // Customize color of checkboxes
        "& .MuiCheckbox-root": {
          color: "#0C2B35 !important",
        },
      }}
    >
      <DataGrid
        rows={
          // Each row needs a unique "id" property; we can use the MongoDB "_id" for this
          vsrs?.map((vsr) => ({
            ...vsr,
            id: vsr._id,
          })) ?? []
        }
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
        }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        pageSizeOptions={[50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
