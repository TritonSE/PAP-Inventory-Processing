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
import Image from "next/image";
import {
  type VSR,
  getVSR,
  updateVSRStatus,
  UpdateVSRRequest,
  updateVSR,
  deleteVSR,
  exportVSRPDF,
} from "@/api/VSRs";
import { useParams, useRouter } from "next/navigation";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import HeaderBar from "@/components/shared/HeaderBar";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import { UserContext } from "@/contexts/userContext";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { Button } from "@/components/shared/Button";
import { useMediaQuery } from "@mui/material";
import styles from "@/components/VSRIndividual/VSRIndividualPage/styles.module.css";
import { ConfirmDiscardEditsModal } from "@/components/shared/ConfirmDiscardEditsModal";

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

  const formProps = useForm<IEditVSRFormInput>();
  const { handleSubmit } = formProps;

  const [updateStatusSuccessNotificationOpen, setUpdateStatusSuccessNotificationOpen] =
    useState(false);
  const [updateStatusErrorNotificationOpen, setUpdateStatusErrorNotificationOpen] = useState(false);
  const [previousVSRStatus, setPreviousVSRStatus] = useState<string | null>(null);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);

  const [discardEditsConfirmationModalOpen, setDiscardEditsConfirmationModalOpen] = useState(false);
  const [editSuccessNotificationOpen, setEditSuccessNotificationOpen] = useState(false);
  const [editErrorNotificationOpen, setEditErrorNotificationOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [downloadSuccessNotificationOpen, setDownloadSuccessNotificationOpen] = useState(false);
  const [downloadErrorNotificationOpen, setDownloadErrorNotificationOpen] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const [deleteVsrModalOpen, setDeleteVsrModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  const { isMobile, isTablet } = useScreenSizes();
  const useColumn = useMediaQuery("@media screen and (max-width: 1000px)");

  /**
   * Callback triggered when form edits are submitted
   */
  const onSubmitEdits: SubmitHandler<IEditVSRFormInput> = async (data) => {
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

  const onDelete = async () => {
    if (loadingDelete || !firebaseUser) {
      return;
    }

    setSuccessNotificationOpen(false);
    setErrorNotificationOpen(false);
    setLoadingDelete(true);

    try {
      const firebaseToken = await firebaseUser.getIdToken();
      if (!firebaseToken) {
        setLoadingDelete(false);
        return;
      }

      await deleteVSR(vsr._id, firebaseToken).then((res) => {
        if (res.success) {
          return Promise.resolve();
        } else {
          return Promise.reject(res.error);
        }
      }),
        setSuccessNotificationOpen(true);
      // Redirect user to dashboard after deleting VSR, but give them some time to see the success message first
      setTimeout(() => {
        router.push("/staff/vsr");
      }, 1000);
    } catch (error) {
      console.error(`Error deleting VSR(s): ${error}`);
      setErrorNotificationOpen(true);
    } finally {
      setLoadingDelete(false);
      setDeleteVsrModalOpen(false);
    }
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

  const onDownloadClicked = async () => {
    if (!firebaseUser) {
      return;
    }

    setDownloadSuccessNotificationOpen(false);
    setDownloadErrorNotificationOpen(false);
    setLoadingDownload(true);
    const firebaseToken = await firebaseUser.getIdToken();
    const result = await exportVSRPDF(firebaseToken, vsr._id);

    if (result.success) {
      setDownloadSuccessNotificationOpen(true);
    } else {
      console.error(`Error downloading VSR PDF: ${result.error}`);
      setEditErrorNotificationOpen(true);
    }
    setLoadingDownload(false);
  };

  /**
   * Conditionally renders the "Approve" button on the page, if the VSR's status is "Received"
   */
  const renderApproveButton = () =>
    vsr.status == "Received" || vsr.status === undefined ? (
      <Button
        variant="primary"
        outlined={false}
        text="Approve VSR"
        loading={loadingUpdateStatus}
        className={`${styles.approveButton} ${isEditing ? styles.disabledButton : ""}`}
        onClick={() => {
          if (!isEditing) {
            onUpdateVSRStatus("Approved");
          }
        }}
        disabled={isEditing}
      />
    ) : null;

  /**
   * Renders the action buttons (Edit, Export, and possibly Delete) at the top of the page.
   */
  const renderActions = () =>
    loadingVsr ? null : (
      <div className={styles.actions}>
        {isEditing ? (
          <>
            <Button
              variant="error"
              outlined
              iconPath="/ic_close_red.svg"
              iconAlt="Close"
              text="Discard Changes"
              hideTextOnMobile
              onClick={() => setDiscardEditsConfirmationModalOpen(true)}
            />
            <Button
              variant="primary"
              outlined={false}
              iconPath="/ic_check.svg"
              iconAlt="Check"
              text="Save Changes"
              hideTextOnMobile
              onClick={(e) => handleSubmit(onSubmitEdits)(e)}
            />
          </>
        ) : (
          <>
            {/* Show delete button only if user is an admin */}
            {papUser?.role === "admin" ? (
              <Button
                variant="error"
                outlined
                iconPath="/mdi_trash.svg"
                iconAlt="Delete"
                text="Delete"
                hideTextOnMobile
                onClick={() => setDeleteVsrModalOpen(true)}
              />
            ) : null}
            <Button
              variant="primary"
              outlined
              iconPath="/ic_edit.svg"
              iconAlt="Edit"
              text="Edit Form"
              hideTextOnMobile
              onClick={() => setIsEditing(true)}
            />
            <Button
              variant="primary"
              outlined={false}
              iconPath="/ic_upload.svg"
              iconAlt="Download"
              loading={loadingDownload}
              text="Download"
              hideTextOnMobile
              onClick={onDownloadClicked}
            />
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
          } else if (result.error.startsWith("404")) {
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
            <Button
              variant="primary"
              outlined
              iconPath="/ic_arrowback.svg"
              iconAlt="Arrowback"
              text="Dashboard"
              hideTextOnMobile
              className={styles.toDashboard}
            />
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
                  {useColumn ? null : (
                    <div className={styles.finalActions}>{renderApproveButton()}</div>
                  )}
                </div>
                <div className={styles.personalInfo}>
                  <ContactInfo vsr={vsr} isEditing={isEditing} formProps={formProps} />
                  <PersonalInformation vsr={vsr} isEditing={isEditing} formProps={formProps} />
                  <MilitaryBackground vsr={vsr} isEditing={isEditing} formProps={formProps} />
                  <AdditionalInfo vsr={vsr} isEditing={isEditing} formProps={formProps} />
                </div>
                {useColumn ? renderApproveButton() : null}
              </div>
            </div>
            <div className={styles.footer}></div>
          </div>
        ) : null}
      </div>

      {/* Success, error, and delete modals/notifications */}
      {renderErrorModal()}
      <NotificationBanner
        variant={previousVSRStatus === null ? "undone" : "success"}
        isOpen={updateStatusSuccessNotificationOpen}
        mainText={
          previousVSRStatus === null
            ? "Changes Have Been Undone"
            : "VSR Status Successfully Updated"
        }
        showUndo={previousVSRStatus !== null}
        onDismissClicked={() => setUpdateStatusSuccessNotificationOpen(false)}
        onUndoClicked={onUndoVSRStatusUpdate}
      />
      <NotificationBanner
        variant="error"
        isOpen={updateStatusErrorNotificationOpen}
        mainText="Unable to Update VSR Status"
        subText="An error occurred, please check your internet connection or try again later"
        onDismissClicked={() => setUpdateStatusErrorNotificationOpen(false)}
      />
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
      <ConfirmDiscardEditsModal
        isOpen={discardEditsConfirmationModalOpen}
        onClose={() => setDiscardEditsConfirmationModalOpen(false)}
        onDiscardChanges={() => {
          fetchVSR();
          setIsEditing(false);
        }}
      />

      {/* Modals & notifications for saving changes to VSR */}
      <NotificationBanner
        variant="success"
        isOpen={editSuccessNotificationOpen}
        mainText="Changes Saved Successfully"
        onDismissClicked={() => setEditSuccessNotificationOpen(false)}
      />
      <NotificationBanner
        variant="error"
        isOpen={editErrorNotificationOpen}
        mainText="Unable to Save Changes"
        subText="An error occurred, please check your internet connection or try again later"
        onDismissClicked={() => setEditErrorNotificationOpen(false)}
      />

      <NotificationBanner
        variant="success"
        isOpen={downloadSuccessNotificationOpen}
        mainText="Downloaded Successfully"
        onDismissClicked={() => setDownloadSuccessNotificationOpen(false)}
      />
      <NotificationBanner
        variant="error"
        isOpen={downloadErrorNotificationOpen}
        mainText="Unable to Download PDF"
        subText="An error occurred, please check your internet connection or try again later"
        onDismissClicked={() => setDownloadErrorNotificationOpen(false)}
      />
      <NotificationBanner
        variant="success"
        isOpen={successNotificationOpen}
        mainText="VSR(s) Deleted Successfully"
        onDismissClicked={() => setSuccessNotificationOpen(false)}
      />
      <NotificationBanner
        variant="error"
        isOpen={errorNotificationOpen}
        mainText="Unable to Delete VSR(s)"
        subText="There was an error deleting the VSR(s). Please try again later."
        onDismissClicked={() => setErrorNotificationOpen(false)}
      />
    </>
  );
};
