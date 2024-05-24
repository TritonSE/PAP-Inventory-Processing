"use client";

import styles from "@/app/staff/vsr/page.module.css";
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
import FilterChip from "@/components/VSRTable/FilterChip";
import { SuccessNotification } from "@/components/shared/SuccessNotification";

enum VSRTableError {
  CANNOT_FETCH_VSRS_NO_INTERNET,
  CANNOT_FETCH_VSRS_INTERNAL,
  ZIPCODE_INVALID,
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

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredZipCodes, setFilteredZipCodes] = useState<string[] | undefined>(undefined);
  const [filteredIncome, setFilteredIncome] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);

  useRedirectToLoginIfNotSignedIn();

  const atLeastOneRowSelected = selectedVsrIds.length > 0;

  /**
   * Fetches the list of all VSRs from the backend and updates our vsrs state.
   */
  const fetchVSRs = (search?: string, zipCodes?: string[], income?: string, status?: string) => {
    if (!firebaseUser) {
      return;
    }

    setLoadingVsrs(true);
    firebaseUser?.getIdToken().then((firebaseToken) => {
      getAllVSRs(firebaseToken, search, zipCodes, income, status).then((result) => {
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
  }, [firebaseUser]);

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
      case VSRTableError.ZIPCODE_INVALID:
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
            title="Zip Code Formatting Error"
            content="Each zip code must be exactly 5 digits long. Please correct the zip code and try again."
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
      bulkExportVSRS(firebaseToken, selectedVsrIds).then((result) => {
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

  return (
    <div className={styles.page}>
      <HeaderBar showLogoutButton />
      <div className={styles.column}>
        <PageTitle />
        <div className={styles.button_row}>
          <div className={styles.row_left}>
            {searchOnOwnRow ? null : (
              <SearchKeyword
                onUpdate={(search: string) => {
                  setSearch(search);
                  fetchVSRs(search, filteredZipCodes, filteredIncome, status);
                }}
              />
            )}

            <div className={styles.statusContainer}>
              <p className={styles.statusLabel}>Status:</p>
              <div className={styles.statusWrapper}>
                <StatusDropdown
                  value="Any"
                  onChanged={(value: string) => {
                    if (value === "Any") {
                      setStatus(undefined);
                      fetchVSRs(search, filteredZipCodes, filteredIncome, undefined);
                    } else {
                      setStatus(value);
                      fetchVSRs(search, filteredZipCodes, filteredIncome, value);
                    }
                  }}
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
                onClick={() => setIsFilterModalOpen(true)}
              />
            )}
            <Button
              variant="primary"
              outlined={false}
              iconPath="/upload.svg"
              iconAlt="Export"
              loading={loadingExport}
              text="Export"
              hideTextOnMobile
              onClick={exportVSRs}
            />
          </div>
        </div>
        {/* {searchOnOwnRow ? <SearchKeyword onUpdate={fetchSearchedVSRs} /> : null} */}

        <span className={styles.filterChips}>
          <p className={styles.appliedText}>Applied Filters: </p>
          {filteredZipCodes?.map((zipCode) => (
            <FilterChip
              label={"Zip Code: " + zipCode}
              key={zipCode}
              onDelete={function (): void {
                setFilteredZipCodes(filteredZipCodes?.filter((z) => z !== zipCode));
                fetchVSRs(
                  search,
                  filteredZipCodes?.filter((z) => z !== zipCode),
                  filteredIncome,
                  status,
                );
              }}
            />
          ))}
          {filteredIncome ? (
            <FilterChip
              label={filteredIncome}
              onDelete={function (): void {
                setFilteredIncome(undefined);
                fetchVSRs(search, filteredZipCodes, undefined, status);
              }}
            />
          ) : null}
        </span>

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
      <SuccessNotification
        isOpen={exportSuccess}
        mainText="VSRs Exported Successfully"
        actions={[
          {
            text: "Dismiss",
            onClick: () => setExportSuccess(false),
          },
        ]}
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
        isOpen={isFilterModalOpen}
        onClose={() => {
          setIsFilterModalOpen(false);
        }}
        onInputEntered={(zipCodes: string[] | undefined, incomeLevel: string | undefined) => {
          console.log(zipCodes);
          if (zipCodes) {
            for (let i = 0; i < zipCodes.length; i++) {
              if (zipCodes[i].length != 5) {
                setTableError(VSRTableError.ZIPCODE_INVALID);
                return;
              }
            }
          }
          //add zipCodes to filteredZipCodes and zipcodes
          const combinedZipCodes = [...(filteredZipCodes ?? []), ...(zipCodes ?? [])];

          setFilteredZipCodes(combinedZipCodes);
          setFilteredIncome(incomeLevel);
          fetchVSRs(search, zipCodes, incomeLevel, status);
        }}
        onResetFilters={() => {
          setFilteredZipCodes(undefined);
          setFilteredIncome(undefined);
          fetchVSRs(search, undefined, undefined, status);
        }}
      />
    </div>
  );
}
