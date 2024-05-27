"use client";

import VSRTable from "@/components/VSRTable/VSRTable";
import FilterModal from "@/components/VSRTable/FilterModal";
import { SearchKeyword } from "@/components/VSRTable/SearchKeyword";
import PageTitle from "@/components/VSRTable/PageTitle";
import HeaderBar from "@/components/shared/HeaderBar";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { StatusDropdown } from "@/components/shared/StatusDropdown";
import { useMediaQuery } from "@mui/material";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";
import { UserContext } from "@/contexts/userContext";
import { DeleteVSRsModal } from "@/components/shared/DeleteVSRsModal";
import { VSR, getAllVSRs, bulkExportVSRS } from "@/api/VSRs";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Button } from "@/components/shared/Button";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import FilterChip from "@/components/VSRTable/FilterChip";
import styles from "@/app/staff/vsr/page.module.css";

enum VSRTableError {
  CANNOT_FETCH_VSRS_NO_INTERNET,
  CANNOT_FETCH_VSRS_INTERNAL,
  NONE,
}

enum VSRExportError {
  CANNOT_EXPORT_VSRS_NO_INTERNET,
  CANNOT_EXPORT_VSRS_INTERNAL,
  NONE,
}

/**
 * Root component for the VSR list/table view.
 */
export default function VSRTableView() {
  const { isMobile, isTablet } = useScreenSizes();
  const searchOnOwnRow = useMediaQuery("@media screen and (max-width: 1000px)");

  const { firebaseUser, papUser } = useContext(UserContext);
  const [loadingVsrs, setLoadingVsrs] = useState(true);
  const [vsrs, setVsrs] = useState<VSR[]>();
  const [tableError, setTableError] = useState(VSRTableError.NONE);
  const [exportError, setExportError] = useState(VSRExportError.NONE);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);

  const [selectedVsrIds, setSelectedVsrIds] = useState<string[]>([]);
  const [deleteVsrModalOpen, setDeleteVsrModalOpen] = useState(false);

  const [filterModalAnchorElement, setFilterModalAnchorElement] = useState<HTMLElement | null>(
    null,
  );
  const [filteredZipCodes, setFilteredZipCodes] = useState<string[]>();
  const [filteredIncome, setFilteredIncome] = useState<string>();
  const [search, setSearch] = useState<string>();
  const [status, setStatus] = useState<string>();

  useRedirectToLoginIfNotSignedIn();

  const atLeastOneRowSelected = selectedVsrIds.length > 0;

  /**
   * Fetches the list of all VSRs from the backend and updates our vsrs state.
   */
  const fetchVSRs = () => {
    if (!firebaseUser) {
      return;
    }

    setLoadingVsrs(true);
    firebaseUser?.getIdToken().then((firebaseToken) => {
      getAllVSRs(firebaseToken, search, filteredZipCodes, filteredIncome, status).then((result) => {
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
        setLoadingVsrs(false);
      });
    });
  };

  // Fetch the VSRs from the backend once the Firebase user loads.
  useEffect(() => {
    fetchVSRs();
  }, [firebaseUser, search, filteredZipCodes, filteredIncome, status]);

  /**
   * Renders an error modal corresponding to the page's error state, or renders
   * nothing if there is no error.
   */
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

  const renderExportErrorModal = () => {
    switch (exportError) {
      case VSRExportError.CANNOT_EXPORT_VSRS_NO_INTERNET:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setExportError(VSRExportError.NONE);
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
            content="Unable to export VSRs due to no internet connection. Please check your connection and try again"
            buttonText="Try Again"
            onButtonClicked={() => {
              setExportError(VSRExportError.NONE);
              exportVSRs();
            }}
          />
        );

      case VSRExportError.CANNOT_EXPORT_VSRS_INTERNAL:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setExportError(VSRExportError.NONE);
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
            content="Something went wrong with exporting the VSRs. Our team is working to fix it. Please try again later."
            buttonText="Try Again"
            onButtonClicked={() => {
              setExportError(VSRExportError.NONE);
              exportVSRs();
            }}
          />
        );
      default:
        return null;
    }
  };

  const exportVSRs = () => {
    if (!firebaseUser) {
      return;
    }

    setExportSuccess(false);
    setExportError(VSRExportError.NONE);
    setLoadingExport(true);
    firebaseUser?.getIdToken().then((firebaseToken) => {
      bulkExportVSRS(
        firebaseToken,
        selectedVsrIds,
        search,
        filteredZipCodes,
        filteredIncome,
        status,
      ).then((result) => {
        if (result.success) {
          setExportSuccess(true);
        } else {
          if (result.error === "Failed to fetch") {
            setExportError(VSRExportError.CANNOT_EXPORT_VSRS_NO_INTERNET);
          } else {
            console.error(`Error exporting VSRs: ${result.error}`);
            setExportError(VSRExportError.CANNOT_EXPORT_VSRS_INTERNAL);
          }
        }
        setLoadingExport(false);
      });
    });
  };

  const renderSearchBar = () => <SearchKeyword onUpdate={setSearch} />;

  return (
    <div className={styles.page}>
      <HeaderBar showLogoutButton />
      <div className={styles.column}>
        <PageTitle />
        <div className={styles.button_row}>
          <div className={styles.row_left}>
            {searchOnOwnRow ? null : renderSearchBar()}

            <div className={styles.statusContainer}>
              <p className={styles.statusLabel}>Status:</p>
              <div className={styles.statusWrapper}>
                <StatusDropdown
                  value="All Statuses"
                  onChanged={(value: string) => {
                    setStatus(value === "All Statuses" ? undefined : value);
                  }}
                  includeAllStatuses
                />
              </div>
            </div>
          </div>
          <div className={styles.row_right}>
            {papUser?.role === "admin" && atLeastOneRowSelected ? (
              <Button
                variant="error"
                outlined
                iconPath="/mdi_trash.svg"
                iconAlt="Delete"
                text="Delete VSR(s)"
                hideTextOnMobile
                onClick={() => setDeleteVsrModalOpen(true)}
              />
            ) : null}
            {atLeastOneRowSelected ? null : (
              <Button
                variant="primary"
                outlined={false}
                iconPath="/round-sort.svg"
                iconAlt="Filter"
                text="Filter"
                hideTextOnMobile
                onClick={(e) => setFilterModalAnchorElement(e.target as HTMLElement)}
              />
            )}
            <Button
              variant="primary"
              outlined={false}
              iconPath="/upload.svg"
              iconAlt="Export"
              loading={loadingExport}
              text={
                selectedVsrIds.length === 0 ? "Export All" : `Export (${selectedVsrIds.length})`
              }
              hideTextOnMobile
              onClick={exportVSRs}
            />
          </div>
        </div>
        {searchOnOwnRow ? renderSearchBar() : null}

        {(filteredZipCodes && filteredZipCodes.length > 0) || filteredIncome ? (
          <div className={styles.appliedFiltersContainer}>
            <p className={styles.appliedText}>Applied Filters: </p>
            <span className={styles.filterChips}>
              {filteredZipCodes?.map((zipCode) => (
                <FilterChip
                  label={"Zip Code: " + zipCode}
                  key={zipCode}
                  onDelete={() => {
                    setFilteredZipCodes(filteredZipCodes?.filter((z) => z !== zipCode));
                  }}
                />
              ))}
              {filteredIncome ? (
                <FilterChip
                  label={filteredIncome}
                  onDelete={() => {
                    setFilteredIncome(undefined);
                  }}
                />
              ) : null}
            </span>
          </div>
        ) : null}

        <div className={styles.table}>
          {loadingVsrs ? (
            <LoadingScreen />
          ) : vsrs?.length !== 0 ? (
            <VSRTable
              vsrs={vsrs ?? []}
              selectedVsrIds={selectedVsrIds}
              onChangeSelectedVsrIds={setSelectedVsrIds}
            />
          ) : (
            <div className={styles.noVsrs}>
              <p>No VSRs found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Error modals, success model, and delete modal */}
      <NotificationBanner
        variant="success"
        isOpen={exportSuccess}
        mainText="VSRs Exported Successfully"
        onDismissClicked={() => setExportSuccess(false)}
      />
      {renderErrorModal()}
      {renderExportErrorModal()}
      <DeleteVSRsModal
        isOpen={deleteVsrModalOpen}
        onClose={() => setDeleteVsrModalOpen(false)}
        afterDelete={() => {
          setSelectedVsrIds([]);
          fetchVSRs();
        }}
        vsrIds={selectedVsrIds}
      />
      <FilterModal
        anchorElement={filterModalAnchorElement}
        onClose={() => {
          setFilterModalAnchorElement(null);
        }}
        initialZipCodes={filteredZipCodes ?? []}
        initialIncomeLevel={filteredIncome ?? ""}
        onInputEntered={(zipCodes: string[] | undefined, incomeLevel: string | undefined) => {
          setFilteredZipCodes(zipCodes);
          setFilteredIncome(incomeLevel);
        }}
        onResetFilters={() => {
          setFilteredZipCodes(undefined);
          setFilteredIncome(undefined);
        }}
      />
    </div>
  );
}
