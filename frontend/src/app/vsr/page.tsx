"use client";
import React, { useEffect, useState } from "react";
import styles from "src/app/vsr/page.module.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
import { CircularProgress } from "@mui/material";

enum VSRFormError {
  CANNOT_RETRIEVE_FURNITURE_NO_INTERNET,
  CANNOT_RETRIEVE_FURNITURE_INTERNAL,
  CANNOT_SUBMIT_NO_INTERNET,
  CANNOT_SUBMIT_INTERNAL,
  NONE,
}

interface IFormInput {
  name: string;
  marital_status: string;
  gender: string;
  spouse: string;
  age: number;
  ethnicity: string;
  other_ethnicity: string;
  employment_status: string;
  income_level: string;
  size_of_home: string;
  num_boys: number;
  num_girls: number;
  ages_of_boys: number[];
  ages_of_girls: number[];
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  branch: string[];
  conflicts: string[];
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petCompanion: boolean;
  hearFrom: string;
}

const VeteranServiceRequest: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<IFormInput>();
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([]);
  const [otherEthnicity, setOtherEthnicity] = useState("");

  const [selectedConflicts, setSelectedConflicts] = useState<string[]>([]);
  const [otherConflict, setOtherConflict] = useState("");

  const [selectedBranch, setSelectedBranch] = useState<string[]>([]);

  const [selectedHearFrom, setSelectedHearFrom] = useState("");
  const [otherHearFrom, setOtherHearFrom] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

  const [confirmSubmissionModalOpen, setConfirmSubmissionModalOpen] = useState(false);

  const numBoys = watch("num_boys");
  const numGirls = watch("num_girls");

  const maritalOptions = ["Married", "Single", "It's Complicated", "Widowed/Widower"];
  const genderOptions = ["Male", "Female", "Other"];
  const employmentOptions = [
    "Employed",
    "Unemployed",
    "Currently Looking",
    "Retired",
    "In School",
    "Unable to work",
  ];

  const incomeOptions = [
    "$12,500 and under",
    "$12,501 - $25,000",
    "$25,001 - $50,000",
    "$50,001 and over",
  ];

  const homeOptions = [
    "House",
    "Apartment",
    "Studio",
    "1 Bedroom",
    "2 Bedroom",
    "3 Bedroom",
    "4 Bedroom",
    "4+ Bedroom",
  ];

  const ethnicityOptions = [
    "Asian",
    "African American",
    "Caucasian",
    "Native American",
    "Pacific Islander",
    "Middle Eastern",
    "Prefer not to say",
  ];

  const branchOptions = [
    "Air Force",
    "Air Force Reserve",
    "Air National Guard",
    "Army",
    "Army Air Corps",
    "Army Reserve",
    "Coast Guard",
    "Marine Corps",
    "Navy",
    "Navy Reserve",
  ];

  const conflictsOptions = [
    "WWII",
    "Korea",
    "Vietnam",
    "Persian Gulf",
    "Bosnia",
    "Kosovo",
    "Panama",
    "Kuwait",
    "Iraq",
    "Somalia",
    "Desert Shield/Storm",
    "Operation Enduring Freedom (OEF)",
    "Afghanistan",
    "Irani Crisis",
    "Granada",
    "Lebanon",
    "Beirut",
    "Special Ops",
    "Peacetime",
  ];

  const dischargeStatusOptions = [
    "Honorable Discharge",
    "General Under Honorable",
    "Other Than Honorable",
    "Bad Conduct",
    "Entry Level",
    "Dishonorable",
    "Still Serving",
    "Civilian",
    "Medical",
    "Not Given",
  ];

  const hearFromOptions = ["Colleague", "Social Worker", "Friend", "Internet", "Social Media"];

  const stateOptions = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const [loadingVsrSubmission, setLoadingVsrSubmission] = useState(false);
  const [vsrFormError, setVsrFormError] = useState<VSRFormError>(VSRFormError.NONE);

  const [loadingFurnitureItems, setLoadingFurnitureItems] = useState(false);
  const [furnitureCategoriesToItems, setFurnitureCategoriesToItems] =
    useState<Record<string, FurnitureItem[]>>();
  // Map furniture item IDs to selections for those items
  const [selectedFurnitureItems, setSelectedFurnitureItems] = useState<
    Record<string, FurnitureInput>
  >({});

  const [additionalItems, setAdditionalItems] = useState("");

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
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (loadingVsrSubmission) {
      return;
    }
    setLoadingVsrSubmission(true);

    // Construct the request object
    const createVSRRequest: CreateVSRRequest = {
      name: data.name,
      gender: data.gender,
      age: data.age,
      maritalStatus: data.marital_status,
      spouseName: data.spouse,
      agesOfBoys:
        data.ages_of_boys
          ?.slice(0, data.num_boys)
          .map((age) => (typeof age === "number" ? age : parseInt(age))) ?? [],
      agesOfGirls:
        data.ages_of_girls
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
      branch: selectedBranch,
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

    const response = await createVSR(createVSRRequest);

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
    setPageNumber(pageNumber + 1);
  };

  const decrementPageNumber = () => {
    setPageNumber(pageNumber - 1);
  };

  const renderChildInput = (gender: "boy" | "girl") => {
    const numChildrenThisGender = gender === "boy" ? numBoys : numGirls;

    return (
      <>
        <div className={styles.longText}>
          <TextField
            label={`Number of ${gender === "boy" ? "Male" : "Female"} Children`}
            variant="outlined"
            placeholder="e.g. 2"
            type="number"
            {...register(`num_${gender}s`, {
              required: `Number of ${gender}s is required`,
              pattern: {
                // Only allow up to 2 digits
                value: /^[0-9][0-9]?$/,
                message: "This field must be a number less than 100",
              },
            })}
            required
            error={!!errors[`num_${gender}s`]}
            helperText={errors[`num_${gender}s`]?.message}
          />
        </div>

        {numChildrenThisGender > 0 ? (
          <div className={styles.numChildren}>
            {/* Cap it at 99 children per gender to avoid freezing web browser */}
            {Array.from({ length: Math.min(numChildrenThisGender, 99) }, (_, index) => (
              <div key={index} className={styles.childInputWrapper}>
                <TextField
                  label={`Age of ${gender.substring(0, 1).toUpperCase()}${gender.substring(1)}`}
                  type="number"
                  variant="outlined"
                  {...register(`ages_of_${gender}s.${index}`, {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "This field must be a number",
                    },
                    max: {
                      value: 17,
                      message: "Only enter children under 18",
                    },
                  })}
                  error={!!errors[`ages_of_${gender}s`]?.[index]}
                  helperText={errors[`ages_of_${gender}s`]?.[index]?.message}
                  required
                />
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
  };

  const renderPageNumber = () => {
    return <PageNumber pageNum={pageNumber} />;
  };

  const renderBackButton = () => {
    return pageNumber === 1 ? (
      <div className={styles.bottomButton} />
    ) : (
      <button className={`${styles.bottomButton} ${styles.back}`} onClick={decrementPageNumber}>
        Back
      </button>
    );
  };

  const renderNextButton = () => {
    return (
      <button
        className={`${styles.bottomButton} ${styles.submit} ${
          isValid ? styles.enabled : styles.disabled
        }`}
        type="submit"
      >
        {loadingVsrSubmission ? <CircularProgress /> : pageNumber === 3 ? "Submit" : "Next"}
      </button>
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
              If you have any questions or concerns, send us an email at
              veteran@patriotsandpaws.org.
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
                        {...register("name", { required: "Name is required" })}
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
                        rules={{ required: "Gender is required" }}
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
                        {...register("age", {
                          required: "Age is required",
                          pattern: {
                            // Only allow up to 2 digits
                            value: /^[0-9]+$/,
                            message: "This field must be a number",
                          },
                        })}
                        required
                        error={!!errors.age}
                        helperText={errors.age?.message}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.subSec}>
                  <Controller
                    name="marital_status"
                    control={control}
                    rules={{ required: "Marital status is required" }}
                    render={({ field }) => (
                      <MultipleChoice
                        label="Marital Status"
                        options={maritalOptions}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        required
                        error={!!errors.marital_status}
                        helperText={errors.marital_status?.message}
                      />
                    )}
                  />
                  {watch().marital_status === "Married" ? (
                    <div className={styles.formRow}>
                      <div className={styles.longText}>
                        <TextField
                          label="Spouse's Name"
                          variant="outlined"
                          placeholder="e.g. Jane Timberlake"
                          {...register("spouse", {
                            required: "Spouse's Name is required",
                          })}
                          required
                          error={!!errors.spouse}
                          helperText={errors.spouse?.message}
                        />
                      </div>
                      {/* Add an empty div here with flex: 1 to take up the right half of the row */}
                      <div style={{ flex: 1 }} />
                    </div>
                  ) : null}

                  <p className={styles.sectionHeader}>Children Under the Age of 18:</p>

                  <div className={`${styles.formRow} ${styles.desktopRowTabletColumn}`}>
                    <div className={styles.formRow}>{renderChildInput("boy")}</div>
                    <div className={styles.formRow}>{renderChildInput("girl")}</div>
                  </div>
                </div>

                <Controller
                  name="ethnicity"
                  control={control}
                  rules={{ required: "Ethnicity is required" }}
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
                  rules={{ required: "Employment status is required" }}
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
                  rules={{ required: "Income level is required" }}
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
                  rules={{ required: "Size of home is required" }}
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
                          {...register("streetAddress", { required: "Street address is required" })}
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
                          {...register("city", { required: "City is required" })}
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
                          rules={{ required: "State is required" }}
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
                          {...register("zipCode", {
                            required: "Zip Code is required",
                            pattern: {
                              // Must be 5 digits
                              value: /^\d{5}$/,
                              message: "This field must be a 5 digit number",
                            },
                          })}
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
                        {...register("phoneNumber", {
                          required: "Phone Number is required",
                          pattern: {
                            value: /^\d{10}$/,
                            message: "This field must be a 10 digit number",
                          },
                        })}
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
                        {...register("email", {
                          required: "Email Address is required",
                        })}
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
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
                    rules={{ required: "Military Branch is required" }}
                    render={({ field }) => (
                      <MultipleChoice
                        label="Branch"
                        options={branchOptions}
                        value={selectedBranch}
                        onChange={(newValue) => {
                          const valueToSet = ((newValue as string[]) ?? [])[0] ?? "";
                          if (valueToSet !== "") {
                            field.onChange(valueToSet);
                          }
                          setSelectedBranch(newValue as string[]);
                        }}
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
                    rules={{ required: "Military Conflicts is required" }}
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
                    rules={{ required: "Discharge status is required" }}
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
                    rules={{
                      validate: (value) =>
                        [true, false].includes(value) || "Service connected is required",
                    }}
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
                        {...register("lastRank", { required: "Last rank is required" })}
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
                        {...register("militaryID", {
                          required: "Last rank is required",
                          pattern: {
                            value: /^\d{4}$/,
                            message: "This field must be a 4 digit number",
                          },
                        })}
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
                    rules={{
                      validate: (value) =>
                        [true, false].includes(value) || "Companionship animal is required",
                    }}
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
                    rules={{ required: "Referral source is required" }}
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
                      ></TextField>
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
            setPageNumber(1);

            // Reset all form fields after submission
            reset();
            setSelectedEthnicities([]);
            setOtherEthnicity("");
            setSelectedConflicts([]);
            setOtherConflict("");
            setSelectedBranch([]);
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
