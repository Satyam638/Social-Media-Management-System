console.log("1: Server file started");

require('dotenv').config();

console.log("2: Env loaded");

const app = require('./app');

console.log("3: App loaded");

const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

const runServer = async () => {
  try {
    console.log("4: Connecting DB...");

    await connectDB();

    console.log("5: DB Connected, starting server...");

    app.listen(PORT, () => {
      console.log(`6: Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server failed:", error.message);
  }
};

runServer();