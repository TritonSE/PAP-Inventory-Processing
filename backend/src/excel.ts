import ExcelJS from "exceljs";
export interface entry {
  id: string;
  name: string;
  age: number;
}

//data will be an array of arrays, row major order
//clears spreadsheet data, and writes to it
export const writeSpreadsheet = async (filename: string, data: entry[]) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "PAP Inventory System";
  workbook.lastModifiedBy = "Bot";
  workbook.created = new Date(2021, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2021, 7, 27);

  const worksheet = workbook.addWorksheet("New Sheet");

  worksheet.columns = [
    { header: "Id", key: "id" },
    { header: "Name", key: "name" },
    { header: "Age", key: "age" },
  ];

  for (let i = 0; i < data.length; i++) {
    worksheet.addRow(data[i]);
  }

  await workbook.xlsx.writeFile(filename);
};
