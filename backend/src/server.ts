/**
 * Initializes mongoose and express.
 */

import "module-alias/register";
import mongoose from "mongoose";

import app from "src/app";
import env from "src/util/validateEnv";

import { entry, writeSpreadsheet } from "src/excel";

const PORT = env.PORT;
const MONGODB_URI = env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Mongoose connected!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
    });
  })
  .catch(console.error);

//write some dummy data into text.xlsx
const entries: entry[] = [];
entries.push({ id: "A1", name: "Bob", age: 25 });
entries.push({ id: "A123", name: "Alice", age: 21 });
entries.push({ id: "A523", name: "Mark", age: 32 });
entries.push({ id: "S5", name: "Leicester", age: 48 });
entries.push({ id: "S3", name: "Annabelle", age: 48 });
entries.push({ id: "O1", name: "?????", age: 255 });
writeSpreadsheet("test.xlsx", entries);
