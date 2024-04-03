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
import styles from "@/components/VSRIndividual/VSRIndividualPage/styles.module.css";
import Image from "next/image";
import { type VSR, getVSR, updateVSRStatus, UpdateVSRRequest, updateVSR } from "@/api/VSRs";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormInput } from "@/app/vsr/page";
import { BaseModal } from "@/components/shared/BaseModal";

enum VSRIndividualError {
  CANNOT_RETRIEVE_FURNITURE_NO_INTERNET,
  CANNOT_RETRIEVE_FURNITURE_INTERNAL,
  CANNOT_FETCH_VSR_NO_INTERNET,
  CANNOT_FETCH_VSR_NOT_FOUND,
  CANNOT_FETCH_VSR_INTERNAL,
  NONE,
}

/**
 * The root component for the VSR individual page.
 */
export const VSRIndividualPage = () => {
  const [loadingVsr, setLoadingVsr] = useState(true);
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const { firebaseUser, papUser } = useContext(UserContext);
  const router = useRouter();
  const [loadingFurnitureItems, setLoadingFurnitureItems] = useState(false);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>();
  const [pageError, setPageError] = useState(VSRIndividualError.NONE);

  const [isEditing, setIsEditing] = useState(false);

  const formProps = useForm<IFormInput>();
  const { watch } = formProps;

  const [updateStatusSuccessNotificationOpen, setUpdateStatusSuccessNotificationOpen] =
    useState(false);
  const [updateStatusErrorNotificationOpen, setUpdateStatusErrorNotificationOpen] = useState(false);
  const [previousVSRStatus, setPreviousVSRStatus] = useState<string | null>(null);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);

  const [discardEditsConfirmationModalOpen, setDiscardEditsConfirmationModalOpen] = useState(false);
  const [saveEditsConfirmationModalOpen, setSaveEditsConfirmationModalOpen] = useState(false);
  const [editSuccessNotificationOpen, setEditSuccessNotificationOpen] = useState(false);
  const [editErrorNotificationOpen, setEditErrorNotificationOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [deleteVsrModalOpen, setDeleteVsrModalOpen] = useState(false);

  const { isMobile, isTablet } = useScreenSizes();
  const iconSize = isMobile ? 16 : isTablet ? 19 : 24;

  /**
   * Callback triggered when form edits are submitted
   */
  const onSubmitEdits: SubmitHandler<IFormInput> = async (data) => {
    if (loadingEdit) {
      return;
    }

    setEditSuccessNotificationOpen(false);
    setEditErrorNotificationOpen(false);
    setLoadingEdit(true);

    const updateVSRRequest: UpdateVSRRequest = {
      name: data.name,
      gender: data.gender,
      age: data.age,
      maritalStatus: data.maritalStatus,
      spouseName: data.spouseName,
      agesOfBoys:
        data.agesOfBoys
          ?.slice(0, data.num_boys)
          .map((age) => (typeof age === "number" ? age : parseInt(age))) ?? [],
      agesOfGirls:
        data.agesOfGirls
          ?.slice(0, data.num_girls)
          .map((age) => (typeof age === "number" ? age : parseInt(age))) ?? [],
      ethnicity: data.ethnicity.concat(data.other_ethnicity === "" ? [] : [data.other_ethnicity]),
      employmentStatus: data.employment_status,
      incomeLevel: data.income_level,
      sizeOfHome: data.size_of_home,

      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      phoneNumber: data.phoneNumber,
      email: data.email,
      branch: data.branch,
      conflicts: data.conflicts.concat(data.other_conflicts === "" ? [] : [data.other_conflicts]),
      dischargeStatus: data.dischargeStatus,
      serviceConnected: data.serviceConnected,
      lastRank: data.lastRank,
      militaryID: data.militaryID,
      petCompanion: data.petCompanion,
      hearFrom: data.hearFrom,

      // Only submit items that the user selected at least 1 of
      selectedFurnitureItems: Object.values(data.selectedFurnitureItems).filter(
        (selectedItem) => selectedItem.quantity > 0,
      ),
      additionalItems: data.additionalItems,
    };

    const firebaseToken = await firebaseUser?.getIdToken();
    if (!firebaseToken) {
      setLoadingEdit(false);
      setEditErrorNotificationOpen(true);
      return;
    }
    const response = await updateVSR(vsr._id, updateVSRRequest, firebaseToken);

    // Handle success/error
    if (response.success) {
      setIsEditing(false);
      setVSR(response.data);
      setEditSuccessNotificationOpen(true);
    } else {
      console.error(`Cannot edit VSR, error ${response.error}`);
      setEditErrorNotificationOpen(true);
    }
    setSaveEditsConfirmationModalOpen(false);
    setLoadingEdit(false);
  };

  /**
   * Callback triggered when the VSR's status is updated to a new value.
   */
  const onUpdateVSRStatus = async (newStatus: string) => {
    if (loadingUpdateStatus) {
      return;
    }

    setLoadingUpdateStatus(true);
    setUpdateStatusSuccessNotificationOpen(false);
    setUpdateStatusErrorNotificationOpen(false);
    const currentStatus = vsr.status;

    const firebaseToken = await firebaseUser?.getIdToken();
    if (!firebaseToken) {
      setLoadingUpdateStatus(false);
      setUpdateStatusErrorNotificationOpen(true);
      return;
    }
    const res = await updateVSRStatus(vsr._id, newStatus, firebaseToken);

    if (res.success) {
      setPreviousVSRStatus(currentStatus);
      setVSR(res.data);
      setUpdateStatusSuccessNotificationOpen(true);
    } else {
      setUpdateStatusErrorNotificationOpen(true);
    }
    setLoadingUpdateStatus(false);
  };

  /**
   * Callback triggered when the user clicks "Undo" on the success notification
   * after updating the VSR's status
   */
  const onUndoVSRStatusUpdate = async () => {
    if (loadingUpdateStatus) {
      return;
    }

    setLoadingUpdateStatus(true);
    setUpdateStatusSuccessNotificationOpen(false);
    setUpdateStatusErrorNotificationOpen(false);

    const firebaseToken = await firebaseUser?.getIdToken();
    if (!firebaseToken) {
      setLoadingUpdateStatus(false);
      setUpdateStatusErrorNotificationOpen(true);
      return;
    }
    const res = await updateVSRStatus(vsr._id, previousVSRStatus!, firebaseToken);

    if (res.success) {
      setPreviousVSRStatus(null);
      setVSR(res.data);
      setUpdateStatusSuccessNotificationOpen(true);
    } else {
      setUpdateStatusErrorNotificationOpen(true);
    }
    setLoadingUpdateStatus(false);
  };

  /**
   * Conditionally renders the "Approve" button on the page, if the VSR's status is "Received"
   */
  const renderApproveButton = () =>
    vsr.status == "Received" || vsr.status === undefined ? (
      <button className={styles.approveButton} onClick={() => onUpdateVSRStatus("Approved")}>
        {loadingUpdateStatus ? <CircularProgress size={24} /> : "Approve VSR"}
      </button>
    ) : null;

  /**
   * Renders the action buttons (Edit, Export, and possibly Delete) at the top of the page.
   */
  const renderActions = () =>
    loadingVsr ? null : (
      <div className={styles.actions}>
        {isEditing ? (
          <>
            <button
              className={`${styles.button} ${styles.redOutlinedButton}`}
              onClick={() => setDiscardEditsConfirmationModalOpen(true)}
            >
              <Image width={iconSize} height={iconSize} src="/ic_close_red.svg" alt="Close" />
              {isMobile ? null : "Discard Changes"}
            </button>
            <button
              className={styles.button}
              onClick={() => setSaveEditsConfirmationModalOpen(true)}
            >
              <Image width={iconSize} height={iconSize} src="/ic_check.svg" alt="Check" />
              {isMobile ? null : "Save Changes"}
            </button>
          </>
        ) : (
          <>
            {/* Show delete button only if user is an admin */}
            {papUser?.role === "admin" ? (
              <button
                className={`${styles.button} ${styles.redOutlinedButton}`}
                onClick={() => setDeleteVsrModalOpen(true)}
              >
                <Image width={iconSize} height={iconSize} src="/mdi_trash.svg" alt="Delete" />
                {isMobile ? null : "Delete"}
              </button>
            ) : null}
            <button id="edit" className={styles.button} onClick={() => setIsEditing(true)}>
              <Image width={iconSize} height={iconSize} src="/ic_edit.svg" alt="Edit" />
              {isMobile ? null : "Edit Form"}
            </button>
            <a href="REPLACE">
              <button className={styles.button}>
                <Image width={iconSize} height={iconSize} src="/ic_upload.svg" alt="upload" />
                {isMobile ? null : "Export"}
              </button>
            </a>
          </>
        )}
      </div>
    );

  /**
   * Fetches the current VSR data from the backend and updates our "vsr" state.
   */
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

  /**
   * Fetch the VSR from the backend, once we have the VSR id and the Firebase user is loaded
   */
  useEffect(() => {
    fetchVSR();
  }, [id, firebaseUser]);

  /**
   * Fetches the list of available furniture items from the backend and updates
   * our "furnitureItems" state
   */
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

  // Fetch all available furniture items from database when page first loads
  useEffect(() => {
    fetchFurnitureItems();
  }, []);

  /**
   * Renders the error modal corresponding to the current page error, or renders nothing
   * if there is no error.
   */
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
          <a href="/staff/vsr" style={isEditing ? { opacity: 0.5 } : {}}>
            <button className={styles.toDashboard}>
              <Image src="/ic_arrowback.svg" width={iconSize} height={iconSize} alt="arrowback" />
              {isMobile ? null : "Dashboard"}
            </button>
          </a>
          {isMobile ? renderActions() : null}
        </div>
        {loadingVsr ? (
          <LoadingScreen />
        ) : pageError === VSRIndividualError.NONE ? (
          <div className={styles.allDetails}>
            <div className={styles.headerRow}>
              <div className={styles.name}>
                <VeteranTag vsr={vsr} isEditing={isEditing}></VeteranTag>
              </div>
              {isMobile ? null : renderActions()}
            </div>
            <div className={styles.bodyDetails}>
              <CaseDetails
                vsr={vsr}
                isEditing={isEditing}
                loadingStatus={loadingUpdateStatus}
                onUpdateVSRStatus={onUpdateVSRStatus}
              ></CaseDetails>
              <div className={styles.otherDetails}>
                {isTablet ? renderApproveButton() : null}
                <div className={styles.personalInfo}>
                  <ContactInfo vsr={vsr} isEditing={isEditing} formProps={formProps} />
                  <PersonalInformation vsr={vsr} isEditing={isEditing} formProps={formProps} />
                  <MilitaryBackground vsr={vsr} isEditing={isEditing} formProps={formProps} />
                  <AdditionalInfo vsr={vsr} isEditing={isEditing} formProps={formProps} />
                </div>
                <div className={styles.rightColumn}>
                  {loadingFurnitureItems ? (
                    <LoadingScreen />
                  ) : (
                    <RequestedFurnishings
                      vsr={vsr}
                      furnitureItems={furnitureItems ?? []}
                      isEditing={isEditing}
                      formProps={formProps}
                    />
                  )}
                  {isTablet ? null : (
                    <div className={styles.finalActions}>{renderApproveButton()}</div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.footer}></div>
          </div>
        ) : null}
      </div>

      {/* Success, error, and delete modals/notifications */}
      {renderErrorModal()}
      <SuccessNotification
        isOpen={updateStatusSuccessNotificationOpen}
        mainText={
          previousVSRStatus === null ? "Undo Successful" : "VSR Status Successfully Updated"
        }
        actionText={previousVSRStatus === null ? "Dismiss" : "Undo"}
        onActionClicked={
          previousVSRStatus === null
            ? () => setUpdateStatusSuccessNotificationOpen(false)
            : onUndoVSRStatusUpdate
        }
      />
      <ErrorNotification
        isOpen={updateStatusErrorNotificationOpen}
        mainText="Unable to Update VSR Status"
        subText="An error occurred, please check your internet connection or try again later"
        actionText="Dismiss"
        onActionClicked={() => setUpdateStatusErrorNotificationOpen(false)}
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
      <BaseModal
        isOpen={discardEditsConfirmationModalOpen}
        onClose={() => setDiscardEditsConfirmationModalOpen(false)}
        title="Discard Changes"
        content="Are you sure you want to discard your changes?"
        bottomRow={
          <div className={styles.modalBottomRow}>
            <button
              className={`${styles.button} ${styles.blueOutlinedButton} ${styles.modalButton}`}
              onClick={() => setDiscardEditsConfirmationModalOpen(false)}
              style={{ width: "100%" }}
            >
              Keep Editing
            </button>
            <button
              className={`${styles.button} ${styles.redButton} ${styles.modalButton}`}
              onClick={() => {
                fetchVSR();
                setDiscardEditsConfirmationModalOpen(false);
                setIsEditing(false);
              }}
              style={{ width: "100%" }}
            >
              Discard Changes
            </button>
          </div>
        }
      />

      {/* Modals & notifications for saving changes to VSR */}
      <BaseModal
        isOpen={saveEditsConfirmationModalOpen}
        onClose={() => setSaveEditsConfirmationModalOpen(false)}
        title="Save Changes"
        content="Would you like to save your changes?"
        bottomRow={
          <div className={styles.modalBottomRow}>
            <button
              className={`${styles.button} ${styles.blueOutlinedButton} ${styles.modalButton}`}
              onClick={() => setSaveEditsConfirmationModalOpen(false)}
              style={{ width: "100%" }}
            >
              Keep Editing
            </button>
            <button
              className={`${styles.button} ${styles.modalButton}`}
              onClick={() => onSubmitEdits(watch())}
              style={{ width: "100%" }}
            >
              Save Changes
            </button>
          </div>
        }
      />
      <SuccessNotification
        isOpen={editSuccessNotificationOpen}
        mainText={"Changes Saved Successfully"}
        actionText="Dismiss"
        onActionClicked={() => setEditSuccessNotificationOpen(false)}
      />
      <ErrorNotification
        isOpen={editErrorNotificationOpen}
        mainText="Unable to Save Changes"
        subText="An error occurred, please check your internet connection or try again later"
        actionText="Dismiss"
        onActionClicked={() => setEditErrorNotificationOpen(false)}
      />
    </>
  );
};
