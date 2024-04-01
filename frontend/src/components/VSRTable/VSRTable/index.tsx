"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect } from "react";
import { VSR, getAllVSRs } from "@/api/VSRs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { StatusChip } from "@/components/shared/StatusChip";
import { STATUS_OPTIONS } from "@/components/shared/StatusDropdown";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { UserContext } from "@/contexts/userContext";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import Image from "next/image";

enum VSRTableError {
  CANNOT_FETCH_VSRS_NO_INTERNET,
  CANNOT_FETCH_VSRS_INTERNAL,
  NONE,
}

const formatDateReceived = (dateReceived: Date) => {
  // Return the empty string on a falsy date received, instead of defaulting to today's date
  return dateReceived ? moment(dateReceived).format("MMMM D, YYYY") : "";
};

export default function VSRTable() {
  const [vsrs, setVsrs] = React.useState<VSR[]>();
  const router = useRouter();
  const { firebaseUser } = React.useContext(UserContext);
  const [tableError, setTableError] = React.useState(VSRTableError.NONE);

  const { isMobile, isTablet } = useScreenSizes();

  const columns: GridColDef[] = React.useMemo(() => {
    const result = [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 72,
        headerClassName: "header",
      },
    ];

    if (!isMobile) {
      result.push({
        field: "_id",
        headerName: "Case ID",
        type: "string",
        flex: 1,
        headerAlign: "left",
        headerClassName: "header",
        disableColumnMenu: true,
        hideSortIcons: true,
        width: 100,
      });
    }

    if (!isTablet) {
      result.push({
        field: "militaryID",
        headerName: "Military ID (Last 4)",
        type: "string",
        flex: 1,
        headerClassName: "header",
        disableColumnMenu: true,
        hideSortIcons: true,
        width: 100,
      });
    }

    result.push({
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "header",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 100,
    });

    if (!isTablet) {
      result.push({
        field: "dateReceived",
        headerName: "Date Received",
        type: "date",
        sortable: true,
        flex: 1,
        headerClassName: "header",
        disableColumnMenu: true,
        hideSortIcons: true,
        valueFormatter: (params) => formatDateReceived(params?.value),
        width: 100,
      });
    }

    result.push({
      field: "status",
      headerName: "Status",
      type: "string",
      flex: 1,
      headerClassName: "header",
      disableColumnMenu: true,
      hideSortIcons: true,
      renderCell: (params) => (
        <StatusChip
          status={
            STATUS_OPTIONS.find((statusOption) => statusOption.value === params.value) ??
            STATUS_OPTIONS[0]
          }
        />
      ),
      width: 100,
    });

    return result;
  }, [isMobile, isTablet]);

  const fetchVSRs = () => {
    firebaseUser?.getIdToken().then((firebaseToken) => {
      getAllVSRs(firebaseToken).then((result) => {
        if (result.success) {
          setVsrs(result.data);
        } else {
          if (result.error === "Failed to fetch") {
            setTableError(VSRTableError.CANNOT_FETCH_VSRS_NO_INTERNET);
          } else {
            console.error(`Error retrieving VSRs: ${result.error}`);
            setTableError(VSRTableError.CANNOT_FETCH_VSRS_INTERNAL);
          }
        }
      });
    });
  };

  useEffect(() => {
    fetchVSRs();
  }, [firebaseUser]);

  const renderErrorModal = () => {
    switch (tableError) {
      case VSRTableError.CANNOT_FETCH_VSRS_NO_INTERNET:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setTableError(VSRTableError.NONE);
            }}
            imageComponent={
              <Image
                src="/errors/no_internet.svg"
                alt="No Internet"
                width={isMobile ? 100 : isTablet ? 138 : 114}
                height={isMobile ? 93 : isTablet ? 129 : 106}
              />
            }
            title="No Internet Connection"
            content="Unable to retrieve the VSRs due to no internet connection. Please check your connection and try again."
            buttonText="Try Again"
            onButtonClicked={() => {
              setTableError(VSRTableError.NONE);
              fetchVSRs();
            }}
          />
        );
      case VSRTableError.CANNOT_FETCH_VSRS_INTERNAL:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setTableError(VSRTableError.NONE);
            }}
            imageComponent={
              <Image
                src="/errors/500_internal_error.svg"
                alt="Internal Error"
                width={isMobile ? 100 : 155}
                height={isMobile ? 69 : 106}
              />
            }
            title="Internal Error"
            content="Something went wrong with retrieving the VSRs. Our team is working to fix it. Please try again later."
            buttonText="Try Again"
            onButtonClicked={() => {
              setTableError(VSRTableError.NONE);
              fetchVSRs();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
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
          ".MuiDataGrid-cell": {
            cursor: "pointer",
          },
          ".MuiDataGrid-cellContent": {
            fontSize: isMobile ? "0.75rem" : isTablet ? "0.875rem" : "1rem",
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
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          pageSizeOptions={[50]}
          checkboxSelection
          disableRowSelectionOnClick
          // Callback fired when user clicks on a cell
          onCellClick={(params, event, _details) => {
            // Ignore if they click the column with the checkboxes
            if (params.field === "__check__") {
              return;
            }
            // Otherwise, take them to the page for this row's VSR
            event.stopPropagation();
            if (params.id) {
              router.push(`/staff/vsr/${params.id}`);
            }
          }}
        />
      </Box>
      {renderErrorModal()}
    </>
  );
}
