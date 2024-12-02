import dotenv from "dotenv";
import app from "./app.js";
import databaseConnection from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, async () => {
  try {
    await databaseConnection();
  } catch (error) {
    process.exit(1);
  }
  console.log(`server is running on ${port}`);
});
