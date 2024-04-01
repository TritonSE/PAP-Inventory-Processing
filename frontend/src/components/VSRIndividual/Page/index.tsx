import React, { useContext, useEffect, useState } from "react";
import {
  VeteranTag,
  ContactInfo,
  CaseDetails,
  PersonalInformation,
  MilitaryBackground,
  AdditionalInfo,
  RequestedFurnishings,
} from "@/components/VSRIndividual";
import styles from "src/components/VSRIndividual/Page/styles.module.css";
import Image from "next/image";
import { type VSR, getVSR, updateVSRStatus } from "@/api/VSRs";
import { useParams, useRouter } from "next/navigation";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import HeaderBar from "@/components/shared/HeaderBar";
import { SuccessNotification } from "@/components/shared/SuccessNotification";
import { ErrorNotification } from "@/components/Errors/ErrorNotification";
import { UserContext } from "@/contexts/userContext";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { CircularProgress } from "@mui/material";
import { DeleteVSRsModal } from "@/components/shared/DeleteVSRsModal";

enum VSRIndividualError {
  CANNOT_RETRIEVE_FURNITURE_NO_INTERNET,
  CANNOT_RETRIEVE_FURNITURE_INTERNAL,
  CANNOT_FETCH_VSR_NO_INTERNET,
  CANNOT_FETCH_VSR_NOT_FOUND,
  CANNOT_FETCH_VSR_INTERNAL,
  NONE,
}

export const Page = () => {
  const [loadingVsr, setLoadingVsr] = useState(true);
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const { firebaseUser, papUser } = useContext(UserContext);
  const router = useRouter();
  const [loadingFurnitureItems, setLoadingFurnitureItems] = useState(false);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>();
  const [pageError, setPageError] = useState(VSRIndividualError.NONE);

  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);
  const [previousVSRStatus, setPreviousVSRStatus] = useState<string | null>(null);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);

  const [deleteVsrModalOpen, setDeleteVsrModalOpen] = useState(false);

  const { isMobile, isTablet } = useScreenSizes();
  const iconSize = isMobile ? 16 : isTablet ? 19 : 24;

  const onUpdateVSRStatus = async (newStatus: string) => {
    if (loadingUpdateStatus) {
      return;
    }

    setLoadingUpdateStatus(true);
    setSuccessNotificationOpen(false);
    setErrorNotificationOpen(false);
    const currentStatus = vsr.status;

    const firebaseToken = await firebaseUser?.getIdToken();
    if (!firebaseToken) {
      setLoadingUpdateStatus(false);
      return;
    }
    const res = await updateVSRStatus(vsr._id, newStatus, firebaseToken);

    if (res.success) {
      setPreviousVSRStatus(currentStatus);
      setVSR(res.data);
      setSuccessNotificationOpen(true);
    } else {
      setErrorNotificationOpen(true);
    }
    setLoadingUpdateStatus(false);
  };

  const onUndoVSRStatusUpdate = async () => {
    if (loadingUpdateStatus) {
      return;
    }

    setLoadingUpdateStatus(true);
    setSuccessNotificationOpen(false);
    setErrorNotificationOpen(false);

    const firebaseToken = await firebaseUser?.getIdToken();
    if (!firebaseToken) {
      setLoadingUpdateStatus(false);
      return;
    }
    const res = await updateVSRStatus(vsr._id, previousVSRStatus!, firebaseToken);

    if (res.success) {
      setPreviousVSRStatus(null);
      setVSR(res.data);
      setSuccessNotificationOpen(true);
    } else {
      setErrorNotificationOpen(true);
    }
    setLoadingUpdateStatus(false);
  };

  const renderApproveButton = () =>
    vsr.status == "Received" || vsr.status === undefined ? (
      <button className={styles.approveButton} onClick={() => onUpdateVSRStatus("Approved")}>
        {loadingUpdateStatus ? <CircularProgress size={24} /> : "Approve VSR"}
      </button>
    ) : null;

  const renderActions = () =>
    loadingVsr ? null : (
      <div className={styles.actions}>
        {/* Show delete button only if user is an admin */}
        {papUser?.role === "admin" ? (
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => setDeleteVsrModalOpen(true)}
          >
            <Image width={iconSize} height={iconSize} src="/mdi_trash.svg" alt="edit" />
            {isMobile ? null : "Delete"}
          </button>
        ) : null}
        <a href="REPLACE">
          <button id="edit" className={styles.button}>
            <Image width={iconSize} height={iconSize} src="/ic_edit.svg" alt="edit" />
            {isMobile ? null : "Edit Form"}
          </button>
        </a>
        <a href="REPLACE">
          <button className={styles.button}>
            <Image width={iconSize} height={iconSize} src="/ic_upload.svg" alt="upload" />
            {isMobile ? null : "Export"}
          </button>
        </a>
      </div>
    );

  const fetchVSR = () => {
    if (!firebaseUser) {
      return;
    }

    setLoadingVsr(true);
    firebaseUser?.getIdToken().then((firebaseToken) => {
      setPageError(VSRIndividualError.NONE);
      getVSR(id as string, firebaseToken).then((result) => {
        if (result.success) {
          setVSR(result.data);
        } else {
          if (result.error === "Failed to fetch") {
            setPageError(VSRIndividualError.CANNOT_FETCH_VSR_NO_INTERNET);
          } else if (result.error.includes("404 Not Found")) {
            setPageError(VSRIndividualError.CANNOT_FETCH_VSR_NOT_FOUND);
          } else {
            console.error(`Error retrieving VSR: ${result.error}`);
            setPageError(VSRIndividualError.CANNOT_FETCH_VSR_INTERNAL);
          }
        }
        setLoadingVsr(false);
      });
    });
  };

  useEffect(() => {
    fetchVSR();
  }, [id, firebaseUser]);

  const fetchFurnitureItems = () => {
    if (loadingFurnitureItems) {
      return;
    }

    setLoadingFurnitureItems(true);
    getFurnitureItems().then((result) => {
      if (result.success) {
        setFurnitureItems(result.data);
      } else {
        if (result.error === "Failed to fetch") {
          setPageError(VSRIndividualError.CANNOT_RETRIEVE_FURNITURE_NO_INTERNET);
        } else {
          console.error(`Error retrieving furniture items: ${result.error}`);
          setPageError(VSRIndividualError.CANNOT_RETRIEVE_FURNITURE_INTERNAL);
        }
      }
      setLoadingFurnitureItems(false);
    });
  };

  // Fetch all available furniture items from database
  useEffect(() => {
    fetchFurnitureItems();
  }, []);

  const renderErrorModal = () => {
    switch (pageError) {
      case VSRIndividualError.CANNOT_RETRIEVE_FURNITURE_NO_INTERNET:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setPageError(VSRIndividualError.NONE);
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
            content="Unable to retrieve the available furniture items due to no internet connection. Please check your connection and try again."
            buttonText="Try Again"
            onButtonClicked={() => {
              setPageError(VSRIndividualError.NONE);
              fetchFurnitureItems();
            }}
          />
        );
      case VSRIndividualError.CANNOT_RETRIEVE_FURNITURE_INTERNAL:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setPageError(VSRIndividualError.NONE);
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
            content="Something went wrong with retrieving the available furniture items. Our team is working to fix it. Please try again later."
            buttonText="Try Again"
            onButtonClicked={() => {
              setPageError(VSRIndividualError.NONE);
              fetchFurnitureItems();
            }}
          />
        );
      case VSRIndividualError.CANNOT_FETCH_VSR_NO_INTERNET:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setPageError(VSRIndividualError.NONE);
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
            content="Unable to retrieve the VSR data due to no internet connection. Please check your connection and try again."
            buttonText="Try Again"
            onButtonClicked={() => {
              setPageError(VSRIndividualError.NONE);
              fetchVSR();
            }}
          />
        );
      case VSRIndividualError.CANNOT_FETCH_VSR_NOT_FOUND:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setPageError(VSRIndividualError.NONE);
            }}
            imageComponent={
              <Image
                src="/errors/red_x.svg"
                alt="Red X"
                width={isMobile ? 69 : 106}
                height={isMobile ? 69 : 106}
              />
            }
            title="VSR Not Found"
            content="Sorry, we couldn't find the VSR you're looking for."
            buttonText="Back to Dashboard"
            onButtonClicked={() => {
              setPageError(VSRIndividualError.NONE);
              router.push("/staff/vsr");
            }}
          />
        );
      case VSRIndividualError.CANNOT_FETCH_VSR_INTERNAL:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setPageError(VSRIndividualError.NONE);
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
            content="Something went wrong with retrieving the VSR. Our team is working to fix it. Please try again later."
            buttonText="Try Again"
            onButtonClicked={() => {
              setPageError(VSRIndividualError.NONE);
              fetchVSR();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <HeaderBar showLogoutButton />
      <div className={styles.page}>
        <div className={`${styles.headerRow} ${styles.toDashboardRow}`}>
          <a href="/staff/vsr">
            <button className={styles.toDashboard}>
              <Image src="/ic_arrowback.svg" width={iconSize} height={iconSize} alt="arrowback" />
              {isMobile ? null : "Dashboard"}
            </button>
          </a>
          {isMobile ? renderActions() : null}
        </div>
        {loadingVsr ? (
          <LoadingScreen />
        ) : (
          <div className={styles.allDetails}>
            <div className={styles.headerRow}>
              <div className={styles.name}>
                <VeteranTag vsr={vsr}></VeteranTag>
              </div>
              {isMobile ? null : renderActions()}
            </div>
            <div className={styles.bodyDetails}>
              <CaseDetails
                vsr={vsr}
                loadingStatus={loadingUpdateStatus}
                onUpdateVSRStatus={onUpdateVSRStatus}
              ></CaseDetails>
              <div className={styles.otherDetails}>
                {isTablet ? renderApproveButton() : null}
                <div className={styles.personalInfo}>
                  <ContactInfo vsr={vsr} />
                  <PersonalInformation vsr={vsr} />
                  <MilitaryBackground vsr={vsr} />
                  <AdditionalInfo vsr={vsr} />
                </div>
                <div className={styles.rightColumn}>
                  {loadingFurnitureItems ? (
                    <LoadingScreen />
                  ) : (
                    <RequestedFurnishings vsr={vsr} furnitureItems={furnitureItems ?? []} />
                  )}
                  {isTablet ? null : (
                    <div className={styles.finalActions}>{renderApproveButton()}</div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.footer}></div>
          </div>
        )}
      </div>

      {renderErrorModal()}
      <SuccessNotification
        isOpen={successNotificationOpen}
        mainText={
          previousVSRStatus === null ? "Undo Successful" : "VSR Status Successfully Updated"
        }
        actionText={previousVSRStatus === null ? "Dismiss" : "Undo"}
        onActionClicked={
          previousVSRStatus === null
            ? () => setSuccessNotificationOpen(false)
            : onUndoVSRStatusUpdate
        }
      />
      <ErrorNotification
        isOpen={errorNotificationOpen}
        mainText="Unable to Update VSR Status"
        subText="An error occurred, please check your internet connection or try again later"
        actionText="Dismiss"
        onActionClicked={() => setErrorNotificationOpen(false)}
      />
      <DeleteVSRsModal
        isOpen={deleteVsrModalOpen}
        onClose={() => setDeleteVsrModalOpen(false)}
        afterDelete={() => {
          // Redirect user to dashboard after deleting VSR, but give them some time to see the success message first
          setTimeout(() => {
            router.push("/staff/vsr");
          }, 1000);
        }}
        vsrIds={[vsr._id]}
      />
    </>
  );
};
