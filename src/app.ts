const express = require("express");
const app = express();
import storiesRouter from "./routes/stories";
const cors = require("cors");


app.use(cors());
// Use the API route for /stories
app.use("/api", storiesRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
