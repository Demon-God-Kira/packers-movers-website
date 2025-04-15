const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "kira", // Your MySQL password
  database: "packers_movers", // The name of your database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
(async () => {
  try {
    const [rows] = await db.execute("SELECT 1");
    console.log("✅ Database connection successful.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error(err); // Log full error for debugging
    process.exit(1); // Exit the process if the connection fails
  }
})();

module.exports = db;
