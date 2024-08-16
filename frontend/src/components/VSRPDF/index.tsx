import { FurnitureItem } from "@/api/FurnitureItems";
import { FurnitureInput, VSR } from "@/api/VSRs";

import { Document, Font, Image, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { ReactNode } from "react";

/**
 * Register fonts so they can be referenced from the PDF
 */
Font.register({
  family: "Lora",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqg.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787z5vBJBkqg.ttf",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVc.ttf",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk8ZkWVAexQ.ttf",
      fontStyle: "italic",
    },
  ],
});

/**
 * Create style objects (similar to CSS properties) to style the PDF
 */
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: "32px 48px",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 70,
  },
  title: {
    color: "#102D5F",
    fontFamily: "Lora",
    fontSize: 16,
    fontWeight: 700,
  },
  verifyIdContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  verifyIdText: {
    color: "#484848",
    textAlign: "center",
    fontFamily: "Open Sans",
    fontSize: 10,
    fontWeight: 400,
  },
  initialsLine: {
    width: 48,
    height: 0.5,
    backgroundColor: "black",
    marginTop: 32,
    marginBottom: 4,
  },

  sectionContainer: {
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },
  sectionTitle: {
    color: "#102D5F",
    fontFamily: "Lora",
    fontSize: 12,
    fontWeight: 700,
  },
  fullWidthRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  fieldContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 3,
    flex: 1,
  },
  fieldLabel: {
    color: "#484848",
    fontFamily: "Open Sans",
    fontSize: 10,
    fontWeight: 400,
  },
  fieldContents: {
    color: "#000000",
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: 400,
  },
  italicText: {
    color: "#484848",
    fontFamily: "Open Sans",
    fontSize: 10,
    fontWeight: 400,
    fontStyle: "italic",
  },
  filledChip: {
    padding: "3px 7px",
    borderRadius: 27,
    backgroundColor: "#102D5F",
    color: "white",
    fontFamily: "Open Sans",
    fontSize: 12,
  },
  chipText: { textOverflow: "ellipsis", fontSize: 12 },
  outlinedChip: {
    padding: "3px 7px",
    border: "1px solid #102D5F",
    borderRadius: 27,
    color: "#102D5F",
    fontFamily: "Open Sans",
    fontSize: 12,
  },
  furnitureContainer: {
    flexDirection: "column",
    gap: 8,
  },
  furnitureCategoryContainer: {
    flexDirection: "column",
    gap: 4,
    width: "100%",
  },
  chipsContainer: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 8,
  },
});

interface VSRPDFProps {
  vsr: VSR;
  furnitureItems: FurnitureItem[];
}

export const VSRPDF = ({ vsr, furnitureItems }: VSRPDFProps) => {
  const furnitureItemIdsToItems =
    furnitureItems?.reduce(
      (prevMap: Record<string, FurnitureItem>, curItem) => ({
        ...prevMap,
        [curItem._id]: curItem,
      }),
      {},
    ) ?? {};

  const furnitureItemIdsToSelectedItems =
    vsr.selectedFurnitureItems.reduce(
      (prevMap: Record<string, FurnitureInput>, curItem) => ({
        ...prevMap,
        [curItem.furnitureItemId]: curItem,
      }),
      {},
    ) ?? {};

  const furnitureCategoriesToItems = furnitureItems.reduce(
    (prevMap: Record<string, FurnitureItem[]>, curItem) => ({
      ...prevMap,
      [curItem.category]: [...(prevMap[curItem.category] ?? []), curItem],
    }),
    {},
  );

  const findSelectedItemsByCategory = (category: string) => {
    return (vsr.selectedFurnitureItems ?? []).filter(
      (selectedItem) =>
        furnitureItemIdsToItems[selectedItem.furnitureItemId]?.category === category,
    );
  };

  const renderField = (fieldName: string, fieldContents: ReactNode) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{fieldName}</Text>
      {fieldContents}
    </View>
  );

  const renderTextField = (fieldName: string, fieldValue: string | number | null | undefined) =>
    renderField(fieldName, <Text style={styles.fieldContents}>{fieldValue ?? "N/A"}</Text>);

  const renderChipField = (fieldName: string, chip: string | number | string[]) =>
    renderField(
      fieldName,
      Array.isArray(chip) && chip.length === 0 ? (
        <Text style={styles.fieldContents}>N/A</Text>
      ) : (
        <>
          <View style={styles.filledChip}>
            <Text style={styles.chipText}>{Array.isArray(chip) ? chip[0] : chip}</Text>
          </View>
          {Array.isArray(chip) && chip.length > 1 ? (
            <Text style={styles.italicText}>+{chip.length - 1} more</Text>
          ) : null}
        </>
      ),
    );

  const renderFurnitureItemChip = (furnitureItem: FurnitureItem, selectedQuantity: number) => (
    <View
      style={selectedQuantity > 0 ? styles.filledChip : styles.outlinedChip}
      key={furnitureItem._id}
    >
      <Text style={styles.chipText}>
        {furnitureItem.name}
        {furnitureItem.allowMultiple
          ? `: ${selectedQuantity > 0 ? selectedQuantity : "_____"}`
          : ""}
      </Text>
    </View>
  );

  const renderFurnitureCategory = (categoryTitle: string, categoryName: string) => {
    const selectedItems = findSelectedItemsByCategory(categoryName);

    return (
      <View style={styles.fullWidthRow}>
        {renderField(
          categoryTitle,
          <View style={styles.furnitureCategoryContainer}>
            {!selectedItems || selectedItems.length === 0 ? (
              <Text style={styles.italicText}>No items selected</Text>
            ) : null}
            <View style={styles.chipsContainer}>
              {furnitureCategoriesToItems[categoryName]?.map((furnitureItem) =>
                renderFurnitureItemChip(
                  furnitureItem,
                  furnitureItemIdsToSelectedItems[furnitureItem._id]?.quantity ?? 0,
                ),
              )}
            </View>
          </View>,
        )}
        ,
      </View>
    );
  };

  return (
    <Document>
      {/* Page 1: Veteran info */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <Image
            style={styles.image}
            src="http://localhost:3000/Images/LoginImage.png"
            cache={false}
          />
          <Text style={styles.title}>Veteran Service Request Form</Text>
          <View style={styles.verifyIdContainer}>
            <Text style={styles.verifyIdText}>Verify ID</Text>
            <View style={styles.initialsLine} />
            <Text style={styles.verifyIdText}>Initial</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.fullWidthRow}>
            {renderTextField("First and Last Name", vsr.name)}
            {renderTextField("Date", vsr.dateReceived.toDateString())}
          </View>

          <View style={styles.fullWidthRow}>
            {renderTextField("Street Address", vsr.streetAddress)}
            {renderTextField("City", vsr.city)}
            {renderTextField("Zip Code", vsr.zipCode)}
            {renderTextField("State", vsr.state)}
          </View>

          <View style={styles.fullWidthRow}>
            {renderTextField("Phone Number", vsr.phoneNumber)}
            {renderTextField("Email Address", vsr.email)}
          </View>

          <View style={styles.fullWidthRow}>
            {renderTextField("Gender", vsr.gender)}
            {renderTextField("Age", vsr.age)}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.fullWidthRow}>{renderChipField("Ethnicity", vsr.ethnicity)}</View>

          <View style={styles.fullWidthRow}>
            {renderChipField("Branch", vsr.branch)}
            {renderChipField("Conflicts", vsr.conflicts)}
          </View>

          <View style={styles.fullWidthRow}>
            {renderChipField("Discharge Status", vsr.dischargeStatus)}
            {renderChipField("Service Connected", vsr.serviceConnected ? "Yes" : "No")}
          </View>

          <View style={styles.fullWidthRow}>
            {renderTextField("Last Rank", vsr.lastRank)}
            {renderTextField("Military ID Number", vsr.militaryID)}
          </View>

          <View style={styles.fullWidthRow}>
            {renderChipField("Employment Status", vsr.employmentStatus)}
            {renderChipField("Income Level", vsr.incomeLevel)}
          </View>

          <View style={styles.fullWidthRow}>
            {renderChipField("Marital Status", vsr.maritalStatus)}
            {renderTextField("Spouse's Name", vsr.spouseName)}
          </View>

          <Text style={styles.fieldLabel}>Children Under the Age of 18:</Text>

          <View style={styles.fullWidthRow}>
            {renderTextField("Number of Boy(s)", vsr.agesOfBoys.length)}
            {renderTextField("Age(s) of Boy(s)", vsr.agesOfBoys.join(", ") || "N/A")}
            {renderTextField("Number of Girl(s)", vsr.agesOfGirls.length)}
            {renderTextField("Age(s) of Girl(s)", vsr.agesOfGirls.join(", ") || "N/A")}
          </View>

          <View style={styles.fullWidthRow}>{renderChipField("Size of Home", vsr.sizeOfHome)}</View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.fullWidthRow}>
            {renderChipField("Interested in companionship animal", vsr.petCompanion ? "Yes" : "No")}
            {renderChipField("How did you hear about us?", vsr.hearFrom)}
          </View>
        </View>
      </Page>

      {/* Page 2: Furniture items */}
      <Page size="A4" style={styles.page}>
        <View style={styles.furnitureContainer}>
          <Text style={styles.sectionTitle}>Furnishing Requests</Text>

          {renderFurnitureCategory("Bedroom", "bedroom")}
          {renderFurnitureCategory("Bathroom", "bathroom")}
          {renderFurnitureCategory("Kitchen", "kitchen")}
          {renderFurnitureCategory("Living Room", "living room")}
          {renderFurnitureCategory("Dining Room", "dining room")}
          {renderFurnitureCategory("Other", "other")}

          <View style={styles.fullWidthRow}>
            {renderTextField("Additional Items", vsr.additionalItems || "N/A")}
          </View>
        </View>
      </Page>
    </Document>
  );
};
