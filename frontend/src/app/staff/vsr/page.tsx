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
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { VSR, getAllVSRs, bulkExportVSRS, deleteVSR } from "@/api/VSRs";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Button } from "@/components/shared/Button";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import FilterChip from "@/components/VSRTable/FilterChip";
import styles from "@/app/staff/vsr/page.module.css";
import { ADMIN_ROLE } from "@/constants/roles";

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
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteSuccessNotificationOpen, setDeleteSuccessNotificationOpen] = useState(false);
  const [deleteErrorNotificationOpen, setDeleteErrorNotificationOpen] = useState(false);

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

  const onDelete = async () => {
    if (loadingDelete || !firebaseUser) {
      return;
    }

    setDeleteSuccessNotificationOpen(false);
    setDeleteErrorNotificationOpen(false);
    setLoadingDelete(true);

    try {
      const firebaseToken = await firebaseUser.getIdToken();
      if (!firebaseToken) {
        setLoadingDelete(false);
        return;
      }

      await Promise.all(
        selectedVsrIds.map((vsrId) =>
          deleteVSR(vsrId, firebaseToken).then((res) => {
            if (res.success) {
              return Promise.resolve();
            } else {
              return Promise.reject(res.error);
            }
          }),
        ),
      );
      setDeleteSuccessNotificationOpen(true);
      setSelectedVsrIds([]);
      fetchVSRs();
    } catch (error) {
      console.error(`Error deleting VSR(s): ${error}`);
      setDeleteErrorNotificationOpen(true);
    } finally {
      setLoadingDelete(false);
      setDeleteVsrModalOpen(false);
    }
  };

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
            {papUser?.role === ADMIN_ROLE && atLeastOneRowSelected ? (
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
      <ConfirmDeleteModal
        isOpen={deleteVsrModalOpen}
        onClose={() => setDeleteVsrModalOpen(false)}
        title="Delete VSR(s)"
        content={
          <>
            {"Deleted VSR’s "}
            <span style={{ fontWeight: 700 }}>cannot</span>
            {" be recovered. Are you sure you’d like to delete the selected VSR forms ("}
            {1}
            {")?"}
          </>
        }
        cancelText="Cancel"
        confirmText="Delete VSR(s)"
        onConfirm={onDelete}
        buttonLoading={loadingDelete}
      />

      <NotificationBanner
        variant="success"
        isOpen={deleteSuccessNotificationOpen}
        mainText="VSR(s) Deleted Successfully"
        onDismissClicked={() => setDeleteSuccessNotificationOpen(false)}
      />
      <NotificationBanner
        variant="error"
        isOpen={deleteErrorNotificationOpen}
        mainText="Unable to Delete VSR(s)"
        subText="There was an error deleting the VSR(s). Please try again later."
        onDismissClicked={() => setDeleteErrorNotificationOpen(false)}
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
