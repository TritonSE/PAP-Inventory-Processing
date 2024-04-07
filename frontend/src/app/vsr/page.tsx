"use client";
import emailValidator from "email-validator";
import React, { useEffect, useState } from "react";
import styles from "src/app/vsr/page.module.css";
import { useForm, Controller, SubmitHandler, RegisterOptions } from "react-hook-form";
import TextField from "@/components/shared/input/TextField";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import Dropdown from "@/components/shared/input/Dropdown";
import HeaderBar from "@/components/shared/HeaderBar";
import PageNumber from "@/components/VSRForm/PageNumber";
import { createVSR, CreateVSRRequest, FurnitureInput } from "@/api/VSRs";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import BinaryChoice from "@/components/shared/input/BinaryChoice";
import { ConfirmVSRSubmissionModal } from "@/components/VSRForm/ConfirmVSRSubmissionModal";
import { FurnitureItemSelection } from "@/components/VSRForm/FurnitureItemSelection";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import Image from "next/image";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import {
  branchOptions,
  conflictsOptions,
  dischargeStatusOptions,
  employmentOptions,
  ethnicityOptions,
  genderOptions,
  hearFromOptions,
  homeOptions,
  maritalOptions,
  incomeOptions,
  stateOptions,
} from "@/constants/fieldOptions";
import { ChildrenInput } from "@/components/shared/input/ChildrenInput";
import { Button } from "@/components/shared/Button";
import { ICreateVSRFormInput, IVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { vsrInputFieldValidators } from "@/components/VSRForm/VSRFormValidators";

enum VSRFormError {
  CANNOT_RETRIEVE_FURNITURE_NO_INTERNET,
  CANNOT_RETRIEVE_FURNITURE_INTERNAL,
  CANNOT_SUBMIT_NO_INTERNET,
  CANNOT_SUBMIT_INTERNAL,
  NONE,
}

/**
 * Root component for the page with the VSR form for veterans to fill out.
 */
const VeteranServiceRequest: React.FC = () => {
  /**
   * Form utilities
   */
  const formProps = useForm<ICreateVSRFormInput>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    reset,
  } = formProps;

  /**
   * Internal state for fields that are complicated and cannot be controlled with a
   * named form field alone (e.g. there is a multiple choice and a text field for "Other")
   */
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([]);
  const [otherEthnicity, setOtherEthnicity] = useState("");

  const [selectedConflicts, setSelectedConflicts] = useState<string[]>([]);
  const [otherConflict, setOtherConflict] = useState("");

  const [selectedHearFrom, setSelectedHearFrom] = useState("");
  const [otherHearFrom, setOtherHearFrom] = useState("");

  const [additionalItems, setAdditionalItems] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

  const goToPage = (newPage: number) => {
    setPageNumber(newPage);
    // Jump to top of window when going to new page
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  /**
   * Internal state for loading, errors, and data
   */
  const [loadingVsrSubmission, setLoadingVsrSubmission] = useState(false);
  const [confirmSubmissionModalOpen, setConfirmSubmissionModalOpen] = useState(false);
  const [vsrFormError, setVsrFormError] = useState<VSRFormError>(VSRFormError.NONE);

  const [loadingFurnitureItems, setLoadingFurnitureItems] = useState(false);
  const [furnitureCategoriesToItems, setFurnitureCategoriesToItems] =
    useState<Record<string, FurnitureItem[]>>();
  // Map furniture item IDs to selections for those items
  const [selectedFurnitureItems, setSelectedFurnitureItems] = useState<
    Record<string, FurnitureInput>
  >({});

  /**
   * Fetches the list of available furniture items from the backend, and updates
   * our state for the items to render on page 3.
   */
  const fetchFurnitureItems = () => {
    if (loadingFurnitureItems) {
      return;
    }
    setLoadingFurnitureItems(true);
    getFurnitureItems().then((result) => {
      if (result.success) {
        setFurnitureCategoriesToItems(
          result.data.reduce(
            (prevMap: Record<string, FurnitureItem[]>, curItem) => ({
              ...prevMap,
              [curItem.category]: [...(prevMap[curItem.category] ?? []), curItem],
            }),
            {},
          ),
        );
        setVsrFormError(VSRFormError.NONE);
      } else {
        if (result.error === "Failed to fetch") {
          setVsrFormError(VSRFormError.CANNOT_RETRIEVE_FURNITURE_NO_INTERNET);
        } else {
          setVsrFormError(VSRFormError.CANNOT_RETRIEVE_FURNITURE_INTERNAL);
          console.error(`Cannot retrieve furniture items: error ${result.error}`);
        }
      }
      setLoadingFurnitureItems(false);
    });
  };

  // Fetch all available furniture items from database
  useEffect(() => {
    fetchFurnitureItems();
  }, []);

  // Handle furniture item count whenever a change is made
  const handleSelectionChange = (newSelection: FurnitureInput) => {
    setSelectedFurnitureItems((prevItems) => ({
      ...prevItems,
      [newSelection.furnitureItemId]: newSelection,
    }));
  };

  const { isMobile, isTablet } = useScreenSizes();

  // Execute when submit button is pressed
  const onSubmit: SubmitHandler<ICreateVSRFormInput> = async (data) => {
    if (loadingVsrSubmission) {
      return;
    }
    setLoadingVsrSubmission(true);

    // Construct the request object

    const createVSRRequest: CreateVSRRequest = {
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
      ethnicity: selectedEthnicities.concat(otherEthnicity === "" ? [] : [otherEthnicity]),
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
      conflicts: selectedConflicts.concat(otherConflict === "" ? [] : [otherConflict]),
      dischargeStatus: data.dischargeStatus,
      serviceConnected: data.serviceConnected,
      lastRank: data.lastRank,
      militaryID: data.militaryID,
      petCompanion: data.petCompanion,
      hearFrom: data.hearFrom,

      // Only submit items that the user selected at least 1 of
      selectedFurnitureItems: Object.values(selectedFurnitureItems).filter(
        (selectedItem) => selectedItem.quantity > 0,
      ),
      additionalItems,
    };

    // Send request to backend
    const response = await createVSR(createVSRRequest);

    // Handle success/error
    if (response.success) {
      setConfirmSubmissionModalOpen(true);
    } else {
      if (response.error === "Failed to fetch") {
        setVsrFormError(VSRFormError.CANNOT_SUBMIT_NO_INTERNET);
      } else {
        setVsrFormError(VSRFormError.CANNOT_SUBMIT_INTERNAL);
        console.error(`Cannot submit VSR, error ${response.error}`);
      }
    }
    setLoadingVsrSubmission(false);
  };

  const incrementPageNumber = () => {
    goToPage(pageNumber + 1);
  };

  const decrementPageNumber = () => {
    goToPage(pageNumber - 1);
  };

  const renderPageNumber = () => {
    return <PageNumber pageNum={pageNumber} />;
  };

  const renderBackButton = () => {
    return pageNumber === 1 ? (
      <div className={styles.bottomButton} />
    ) : (
      <Button
        variant="primary"
        outlined
        text="Back"
        className={styles.bottomButton}
        onClick={decrementPageNumber}
        /**
         * We need to set type="button" because the default, type="submit", would cause
         * this button to be triggered when the user presses enter on any input field.
         */
        type="button"
      />
    );
  };

  const renderNextButton = () => {
    return (
      <Button
        variant="primary"
        outlined={false}
        loading={loadingVsrSubmission}
        text={pageNumber === 3 ? "Submit" : "Next"}
        className={`${styles.bottomButton} ${isValid ? "" : styles.disabled}`}
        type="submit"
      />
    );
  };

  const renderBottomRow = () => {
    if (isMobile) {
      return (
        <div className={styles.bottomRow}>
          <PageNumber pageNum={pageNumber} />
          <div className={styles.bottomRowMobile}>
            {pageNumber === 1 ? null : renderBackButton()}
            {renderNextButton()}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.bottomRow}>
          {renderBackButton()}
          {renderPageNumber()}
          {renderNextButton()}
        </div>
      );
    }
  };

  const renderErrorModal = () => {
    switch (vsrFormError) {
      case VSRFormError.CANNOT_RETRIEVE_FURNITURE_NO_INTERNET:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setVsrFormError(VSRFormError.NONE);
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
              setVsrFormError(VSRFormError.NONE);
              fetchFurnitureItems();
            }}
          />
        );
      case VSRFormError.CANNOT_RETRIEVE_FURNITURE_INTERNAL:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setVsrFormError(VSRFormError.NONE);
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
              setVsrFormError(VSRFormError.NONE);
              fetchFurnitureItems();
            }}
          />
        );
      case VSRFormError.CANNOT_SUBMIT_NO_INTERNET:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setVsrFormError(VSRFormError.NONE);
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
            content="Unable to submit the VSR form due to no internet connection. Please check your connection and try again."
            buttonText="Try Again"
            onButtonClicked={() => {
              setVsrFormError(VSRFormError.NONE);
              onSubmit(watch());
            }}
          />
        );
      case VSRFormError.CANNOT_SUBMIT_INTERNAL:
        return (
          <VSRErrorModal
            isOpen
            onClose={() => {
              setVsrFormError(VSRFormError.NONE);
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
            content="Something went wrong with submitting the VSR form. Our team is working to fix it. Please try again later."
            buttonText="OK"
            onButtonClicked={() => {
              setVsrFormError(VSRFormError.NONE);
            }}
          />
        );
      case VSRFormError.NONE:
      default:
        return null;
    }
  };

  /**
   * Render different fields based on current page number
   */
  if (pageNumber == 1) {
    return (
      <div>
        <form onSubmit={handleSubmit(incrementPageNumber)}>
          <HeaderBar showLogoutButton={false} />
          <div className={styles.main}>
            <h1 className={styles.title}>Veteran Service Request Form</h1>
            <p className={styles.description}>
              Welcome, Veterans, Active Duty, Reservists, and Families. If you&apos;re in need of
              furnishings, we&apos;re here to assist you. Please complete and submit the form below
              to request what you require.
              <br></br>
              <br></br>
              Upon submission, a copy of your VSR form will be sent to your email. We&apos;ll
              promptly review it and respond via email as soon as possible. Remember to check your
              spam folder if you don&apos;t receive a response within 48 business hours.
              <br></br>
              <br></br>
              If you have any questions or concerns, send us an email at{" "}
              <a className={styles.emailLink} href="mailto:veteran@patriotsandpaws.org">
                veteran@patriotsandpaws.org
              </a>
              .
            </p>

            <div className={styles.fieldsMarked}>
              <p>
                Fields marked with <span className={styles.asterisk}>*</span> are required.
              </p>
            </div>

            <div className={styles.formContainer}>
              <div className={styles.form}>
                <div className={styles.subSec}>
                  <h1 className={styles.sectionTitle}>Personal Information</h1>

                  <div className={styles.formRow}>
                    <div className={styles.longText}>
                      <TextField
                        label="Name"
                        variant="outlined"
                        placeholder="e.g. Justin Timberlake"
                        {...register(
                          "name",
                          vsrInputFieldValidators.name as RegisterOptions<IVSRFormInput, "name">,
                        )}
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </div>
                    {/* Add an empty div here with flex: 1 to take up the right half of the row, on non-mobile */}
                    {isMobile ? null : <div style={{ flex: 1 }} />}
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.longText}>
                      <Controller
                        defaultValue=""
                        name="gender"
                        control={control}
                        rules={
                          vsrInputFieldValidators.gender as RegisterOptions<IVSRFormInput, "gender">
                        }
                        render={({ field }) => (
                          <Dropdown
                            label="Gender"
                            options={genderOptions}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            required
                            error={!!errors.gender}
                            helperText={errors.gender?.message}
                            placeholder="Select your gender"
                          />
                        )}
                      />
                    </div>
                    <div className={styles.longText}>
                      <TextField
                        label="Age"
                        type="number"
                        variant="outlined"
                        placeholder="Enter your age"
                        {...register(
                          "age",
                          vsrInputFieldValidators.age as RegisterOptions<IVSRFormInput, "age">,
                        )}
                        required
                        error={!!errors.age}
                        helperText={errors.age?.message}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.subSec}>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    rules={
                      vsrInputFieldValidators.maritalStatus as RegisterOptions<
                        IVSRFormInput,
                        "maritalStatus"
                      >
                    }
                    render={({ field }) => (
                      <MultipleChoice
                        label="Marital Status"
                        options={maritalOptions}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        required
                        error={!!errors.maritalStatus}
                        helperText={errors.maritalStatus?.message}
                      />
                    )}
                  />
                  {watch().maritalStatus === "Married" ? (
                    <div className={styles.formRow}>
                      <div className={styles.longText}>
                        <TextField
                          label="Spouse's Name"
                          variant="outlined"
                          placeholder="e.g. Jane Timberlake"
                          {...register(
                            "spouseName",
                            vsrInputFieldValidators.spouseName as RegisterOptions<
                              IVSRFormInput,
                              "spouseName"
                            >,
                          )}
                          required
                          error={!!errors.spouseName}
                          helperText={errors.spouseName?.message}
                        />
                      </div>
                      {/* Add an empty div here with flex: 1 to take up the right half of the row */}
                      <div style={{ flex: 1 }} />
                    </div>
                  ) : null}

                  <p className={styles.sectionHeader}>Children Under the Age of 18:</p>

                  <div className={`${styles.formRow} ${styles.desktopRowTabletColumn}`}>
                    <div className={styles.formRow}>
                      <ChildrenInput gender="boy" formProps={formProps} />
                    </div>
                    <div className={styles.formRow}>
                      <ChildrenInput gender="girl" formProps={formProps} />
                    </div>
                  </div>
                </div>

                <Controller
                  name="ethnicity"
                  control={control}
                  rules={
                    vsrInputFieldValidators.ethnicity as RegisterOptions<IVSRFormInput, "ethnicity">
                  }
                  render={({ field }) => (
                    <>
                      <MultipleChoice
                        label="Ethnicity"
                        options={ethnicityOptions}
                        value={selectedEthnicities}
                        onChange={(newValue) => {
                          const valueToSet = ((newValue as string[]) ?? [])[0] ?? "";
                          if (valueToSet !== "" || otherEthnicity === "") {
                            field.onChange(valueToSet);
                          }
                          setSelectedEthnicities(newValue as string[]);
                        }}
                        required
                        error={!!errors.ethnicity}
                        helperText={errors.ethnicity?.message}
                        allowMultiple
                      />
                      <div style={{ marginTop: -50 }}>
                        <TextField
                          label="Other"
                          type="text"
                          placeholder="Please specify"
                          name="other_ethnicity"
                          value={otherEthnicity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value !== "" || selectedEthnicities.length === 0) {
                              field.onChange(value);
                            }
                            setOtherEthnicity(value);
                          }}
                          variant={"outlined"}
                          required={false}
                        />
                      </div>
                    </>
                  )}
                />

                <Controller
                  name="employment_status"
                  control={control}
                  rules={
                    vsrInputFieldValidators.employment_status as RegisterOptions<
                      IVSRFormInput,
                      "employment_status"
                    >
                  }
                  render={({ field }) => (
                    <MultipleChoice
                      label="Employment Status"
                      options={employmentOptions}
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      required
                      error={!!errors.employment_status}
                      helperText={errors.employment_status?.message}
                    />
                  )}
                />

                <Controller
                  name="income_level"
                  control={control}
                  rules={
                    vsrInputFieldValidators.income_level as RegisterOptions<
                      IVSRFormInput,
                      "income_level"
                    >
                  }
                  render={({ field }) => (
                    <MultipleChoice
                      label="Income Level"
                      options={incomeOptions}
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      required
                      error={!!errors.income_level}
                      helperText={errors.income_level?.message}
                    />
                  )}
                />

                <Controller
                  name="size_of_home"
                  control={control}
                  rules={
                    vsrInputFieldValidators.size_of_home as RegisterOptions<
                      IVSRFormInput,
                      "size_of_home"
                    >
                  }
                  render={({ field }) => (
                    <MultipleChoice
                      label="Size of Home"
                      options={homeOptions}
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      required
                      error={!!errors.size_of_home}
                      helperText={errors.size_of_home?.message}
                    />
                  )}
                />
              </div>
            </div>
            {renderBottomRow()}
          </div>
        </form>
        {renderErrorModal()}
      </div>
    );
  } else if (pageNumber === 2) {
    return (
      <div>
        <form onSubmit={handleSubmit(incrementPageNumber)}>
          <HeaderBar showLogoutButton={false} />
          <div className={styles.main}>
            <div className={styles.formContainer}>
              <div className={styles.form}>
                <div className={styles.subSec}>
                  <h1 className={styles.sectionTitle}>Contact Information</h1>

                  <div className={`${styles.formRow} ${styles.desktopRowTabletColumn}`}>
                    <div className={styles.formRow}>
                      <div className={styles.longText}>
                        <TextField
                          label="Street Address"
                          variant="outlined"
                          placeholder="e.g. 1234 Baker Street"
                          {...register(
                            "streetAddress",
                            vsrInputFieldValidators.streetAddress as RegisterOptions<
                              IVSRFormInput,
                              "streetAddress"
                            >,
                          )}
                          required
                          error={!!errors.streetAddress}
                          helperText={errors.streetAddress?.message}
                        />
                      </div>

                      <div className={styles.longText}>
                        <TextField
                          label="City"
                          variant="outlined"
                          placeholder="e.g. San Diego"
                          {...register(
                            "city",
                            vsrInputFieldValidators.city as RegisterOptions<IVSRFormInput, "city">,
                          )}
                          required
                          error={!!errors.city}
                          helperText={errors.city?.message}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.longText}>
                        <Controller
                          defaultValue=""
                          name="state"
                          control={control}
                          rules={
                            vsrInputFieldValidators.state as RegisterOptions<IVSRFormInput, "state">
                          }
                          render={({ field }) => (
                            <Dropdown
                              label="State"
                              options={stateOptions}
                              value={field.value}
                              onChange={(e) => field.onChange(e)}
                              required
                              error={!!errors.state}
                              helperText={errors.state?.message}
                              placeholder="Select a state"
                            />
                          )}
                        />
                      </div>

                      <div className={styles.longText}>
                        <TextField
                          label="Zip Code"
                          type="number"
                          variant="outlined"
                          placeholder="e.g. 92092"
                          {...register(
                            "zipCode",
                            vsrInputFieldValidators.zipCode as RegisterOptions<
                              IVSRFormInput,
                              "zipCode"
                            >,
                          )}
                          required
                          error={!!errors.zipCode}
                          helperText={errors.zipCode?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.longText}>
                      <TextField
                        label="Phone"
                        type="tel"
                        variant="outlined"
                        placeholder="e.g. 6197123276"
                        {...register(
                          "phoneNumber",
                          vsrInputFieldValidators.phoneNumber as RegisterOptions<
                            IVSRFormInput,
                            "phoneNumber"
                          >,
                        )}
                        required
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                      />
                    </div>

                    <div className={styles.longText}>
                      <TextField
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        placeholder="e.g. justintimberlake@gmail.com"
                        {...register(
                          "email",
                          vsrInputFieldValidators.email as RegisterOptions<IVSRFormInput, "email">,
                        )}
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    {isMobile ? null : <div className={styles.longText} />}
                    <div className={styles.longText}>
                      <TextField
                        label="Confirm Email Address"
                        type="email"
                        variant="outlined"
                        placeholder="e.g. justintimberlake@gmail.com"
                        {...register("confirmEmail", {
                          required: "Please confirm your email address",
                          validate: {
                            validate: (emailAddress) =>
                              emailValidator.validate(emailAddress)
                                ? emailAddress === watch().email || "Emails do not match"
                                : "This field must be a valid email address",
                          },
                        })}
                        required
                        error={!!errors.confirmEmail}
                        helperText={errors.confirmEmail?.message}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formContainer}>
              <div className={styles.form}>
                <div className={styles.subSec}>
                  <h1 className={styles.sectionTitle}>Military Background</h1>

                  <Controller
                    name="branch"
                    control={control}
                    rules={
                      vsrInputFieldValidators.branch as RegisterOptions<IVSRFormInput, "branch">
                    }
                    render={({ field }) => (
                      <MultipleChoice
                        label="Branch"
                        options={branchOptions}
                        value={field.value}
                        onChange={field.onChange}
                        required
                        error={!!errors.branch}
                        helperText={errors.branch?.message}
                        allowMultiple
                      />
                    )}
                  />

                  <Controller
                    name="conflicts"
                    control={control}
                    rules={
                      vsrInputFieldValidators.conflicts as RegisterOptions<
                        IVSRFormInput,
                        "conflicts"
                      >
                    }
                    render={({ field }) => (
                      <>
                        <MultipleChoice
                          label="Conflicts"
                          options={conflictsOptions}
                          value={selectedConflicts}
                          onChange={(newValue) => {
                            const valueToSet = ((newValue as string[]) ?? [])[0] ?? "";
                            if (valueToSet !== "" || otherConflict === "") {
                              field.onChange(valueToSet);
                            }
                            setSelectedConflicts(newValue as string[]);
                          }}
                          required
                          error={!!errors.conflicts}
                          helperText={errors.conflicts?.message}
                          allowMultiple
                        />
                        <div style={{ marginTop: -16 }}>
                          <TextField
                            label="Other"
                            type="text"
                            placeholder="Please list"
                            name="otherConflict"
                            value={otherConflict}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value !== "" || selectedConflicts.length === 0) {
                                field.onChange(value);
                              }
                              setOtherConflict(value);
                            }}
                            variant={"outlined"}
                            required={false}
                          />
                        </div>
                      </>
                    )}
                  />

                  <Controller
                    name="dischargeStatus"
                    control={control}
                    rules={
                      vsrInputFieldValidators.dischargeStatus as RegisterOptions<
                        IVSRFormInput,
                        "dischargeStatus"
                      >
                    }
                    render={({ field }) => (
                      <MultipleChoice
                        label="Discharge Status"
                        options={dischargeStatusOptions}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        required
                        error={!!errors.dischargeStatus}
                        helperText={errors.dischargeStatus?.message}
                      />
                    )}
                  />

                  <Controller
                    name="serviceConnected"
                    control={control}
                    rules={
                      vsrInputFieldValidators.serviceConnected as RegisterOptions<
                        IVSRFormInput,
                        "serviceConnected"
                      >
                    }
                    render={({ field }) => (
                      <BinaryChoice
                        label="Service Connected"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        required
                        error={!!errors.serviceConnected}
                        helperText={errors.serviceConnected?.message}
                      />
                    )}
                  />

                  <div className={styles.formRow}>
                    <div className={styles.longText}>
                      <TextField
                        label="Last Rank"
                        variant="outlined"
                        placeholder="Enter"
                        {...register(
                          "lastRank",
                          vsrInputFieldValidators.lastRank as RegisterOptions<
                            IVSRFormInput,
                            "lastRank"
                          >,
                        )}
                        required
                        error={!!errors.lastRank}
                        helperText={errors.lastRank?.message}
                      />
                    </div>

                    <div className={styles.longText}>
                      <TextField
                        label="Military ID Number (Last 4)"
                        variant="outlined"
                        placeholder="Enter"
                        {...register(
                          "militaryID",
                          vsrInputFieldValidators.militaryID as RegisterOptions<
                            IVSRFormInput,
                            "militaryID"
                          >,
                        )}
                        required
                        error={!!errors.militaryID}
                        helperText={errors.militaryID?.message}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formContainer}>
              <div className={styles.form}>
                <div className={styles.subSec}>
                  <h1 className={styles.sectionTitle}>Additional Information</h1>
                  <Controller
                    name="petCompanion"
                    control={control}
                    rules={
                      vsrInputFieldValidators.petCompanion as RegisterOptions<
                        IVSRFormInput,
                        "petCompanion"
                      >
                    }
                    render={({ field }) => (
                      <BinaryChoice
                        label="Are you interested in a companionship animal (pet)?"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        required
                        error={!!errors.petCompanion}
                        helperText={errors.petCompanion?.message}
                      />
                    )}
                  />

                  <Controller
                    name="hearFrom"
                    control={control}
                    rules={
                      vsrInputFieldValidators.hearFrom as RegisterOptions<IVSRFormInput, "hearFrom">
                    }
                    render={({ field }) => (
                      <>
                        <MultipleChoice
                          label="How did you hear about us?"
                          options={hearFromOptions}
                          value={selectedHearFrom}
                          onChange={(newValue) => {
                            const valueToSet = Array.isArray(newValue) ? newValue[0] : newValue;
                            if (valueToSet !== "" || otherHearFrom === "") {
                              field.onChange(valueToSet);
                            }
                            setSelectedHearFrom(valueToSet);
                          }}
                          required
                          error={!!errors.hearFrom}
                          helperText={errors.hearFrom?.message}
                        />
                        <div style={{ marginTop: -16 }}>
                          <TextField
                            label="Other"
                            type="text"
                            placeholder="Enter"
                            name="otherSource"
                            value={otherHearFrom}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value !== "") {
                                field.onChange(value);
                              }
                              setOtherHearFrom(value);
                              setSelectedHearFrom("");
                            }}
                            variant={"outlined"}
                            required={false}
                          />
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            {renderBottomRow()}
          </div>
        </form>
        {renderErrorModal()}
      </div>
    );
  } else {
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HeaderBar showLogoutButton={false} />
          <div className={styles.main}>
            <div className={styles.formContainer}>
              <div className={styles.form}>
                <div className={styles.subSec}>
                  <div className={styles.sectionTitle}>Furnishings</div>
                  <div>
                    {loadingFurnitureItems ? (
                      <LoadingScreen />
                    ) : (
                      Object.entries(furnitureCategoriesToItems ?? {}).map(([category, items]) => (
                        <div className={styles.furnitureItemsSection} key={category}>
                          <p className={styles.furnitureItemsSectionLabel}>{category}</p>
                          <div className={styles.chipContainer}>
                            {(items ?? []).map((furnitureItem) => (
                              <FurnitureItemSelection
                                key={furnitureItem._id}
                                furnitureItem={furnitureItem}
                                selection={
                                  selectedFurnitureItems[furnitureItem._id] ?? {
                                    furnitureItemId: furnitureItem._id,
                                    quantity: 0,
                                  }
                                }
                                onChangeSelection={(newSelection) =>
                                  handleSelectionChange(newSelection)
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                    <div className={styles.section}>
                      <TextField
                        label="Identify other necessary items"
                        helperText="**We do not offer cleaning supplies"
                        required={false}
                        variant={"outlined"}
                        onChange={(e) => setAdditionalItems(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {renderBottomRow()}
          </div>
        </form>
        <div className={styles.footer}></div>
        <ConfirmVSRSubmissionModal
          isOpen={confirmSubmissionModalOpen}
          onClose={() => {
            setConfirmSubmissionModalOpen(false);
            goToPage(1);

            // Reset all form fields after submission
            reset();
            setSelectedEthnicities([]);
            setOtherEthnicity("");
            setSelectedConflicts([]);
            setOtherConflict("");
            setSelectedHearFrom("");
            setOtherHearFrom("");
            setSelectedFurnitureItems({});
            setAdditionalItems("");
          }}
        />
        {renderErrorModal()}
      </div>
    );
  }
};
export default VeteranServiceRequest;
