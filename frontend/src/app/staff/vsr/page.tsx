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
import { VSR, getAllVSRs } from "@/api/VSRs";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Button } from "@/components/shared/Button";

enum VSRTableError {
  CANNOT_FETCH_VSRS_NO_INTERNET,
  CANNOT_FETCH_VSRS_INTERNAL,
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

  const [selectedVsrIds, setSelectedVsrIds] = useState<string[]>([]);
  const [deleteVsrModalOpen, setDeleteVsrModalOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredZipCodes, setFilteredZipCodes] = useState<string[]>([]);

  useRedirectToLoginIfNotSignedIn();

  const atLeastOneRowSelected = selectedVsrIds.length > 0;

  /**
   * Fetches the list of all VSRs from the backend and updates our vsrs state.
   */
  const fetchVSRs = (zipCodes = null) => {
    if (!firebaseUser) {
      return;
    }

    if (zipCodes !== null) {
      setLoadingVsrs(true);
      firebaseUser?.getIdToken().then((firebaseToken) => {
        getAllVSRs(firebaseToken, zipCodes).then((result) => {
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
    } else {
      setLoadingVsrs(true);
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
          setLoadingVsrs(false);
        });
      });
    }
  };

  // Fetch the VSRs from the backend once the Firebase user loads.
  useEffect(() => {
    fetchVSRs();
  }, [firebaseUser]);

  const fetchSearchedVSRs = (input: string) => {
    if (!firebaseUser) {
      return;
    }

    setLoadingVsrs(true);
    firebaseUser?.getIdToken().then((firebaseToken) => {
      getAllVSRs(firebaseToken, input).then((result) => {
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

  return (
    <div className={styles.page}>
      <HeaderBar showLogoutButton />
      <div className={styles.column}>
        <PageTitle />
        <div className={styles.button_row}>
          <div className={styles.row_left}>
            {searchOnOwnRow ? null : <SearchKeyword fetchFunction={fetchSearchedVSRs} />}

            <div className={styles.statusContainer}>
              <p className={styles.statusLabel}>Status:</p>
              <div className={styles.statusWrapper}>
                <StatusDropdown value="Received" />
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
              text="Export"
              hideTextOnMobile
              onClick={() => {
                // TODO: implement exporting VSRs
              }}
            />
          </div>
        </div>
        {searchOnOwnRow ? <SearchKeyword fetchFunction={fetchSearchedVSRs} /> : null}
        <div className={styles.table}>
          {loadingVsrs ? (
            <LoadingScreen />
          ) : (
            <VSRTable
              vsrs={vsrs ?? []}
              selectedVsrIds={selectedVsrIds}
              onChangeSelectedVsrIds={setSelectedVsrIds}
            />
          )}
        </div>
      </div>

      {/* Error modal and delete modal */}
      {renderErrorModal()}
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
        onClose={() => setIsFilterModalOpen(false)}
        onZipCodesEntered={(zipCodes: string[]) => {
          setFilteredZipCodes(zipCodes);
        }}
      />
    </div>
  );
}
