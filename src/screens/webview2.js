const express = require("express");
const mysql = require('mysql');
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define the path for storing uploaded files
const uploadPath = path.join(__dirname, "uploads"); // Adjust this based on your cPanel setup

// Ensure the uploads folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });



// Set up MySQL connection (Main database)
const db = mysql.createPool({
  host: "localhost",
  user: "saas",
  password: "Bangladesh$$786",
  database: "saas",
   connectionLimit: 10,
});

// Home route for the welcome message
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the SAAS Home Page</h1>");
});

// API route to save user IP address
app.post('/api/save-ip', (req, res) => {
  const { email, ip } = req.body;

  // Get current date and time in Australia/Sydney timezone
  const currentTimestamp = moment().tz('Australia/Sydney').unix();

  const updateQuery = `
    UPDATE uerp_user 
    SET ip = ?, date = ?
    WHERE email = ?
  `;
  
  db.query(updateQuery, [ip, currentTimestamp, email], (error, result) => {
    if (error) {
      console.error('Error saving IP address:', error);
      return res.status(500).json({ error: 'Failed to save IP address' });
    }

    res.json({ message: 'IP address saved successfully!' });
  });
});


// Function to check if email and password exist in the user's specific database
const verifyInUserDatabase = (ref_db, email, password, callback) => {
  const userDbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
    connectionLimit: 10,
  });

  const query = `SELECT * FROM uerp_user WHERE email = ? AND passbox = ?`;
  userDbConnection.query(query, [email, password], (error, results) => {
    userDbConnection.end(); // Close the connection
    if (error) {
      return callback(error, null);
    }
    callback(null, results.length > 0 ? results[0] : null); // Return the user object if found
  });
};

// Function to retrieve user details from user-specific database
const getUserDetails = (ref_db, userId, callback) => {
  const userDbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  const query = `SELECT id, ip, date, username2, images FROM uerp_user WHERE id = ?`;
  userDbConnection.query(query, [userId], (error, results) => {
    userDbConnection.end(); // Close the connection
    if (error) {
      return callback(error, null);
    }
    callback(null, results.length > 0 ? results[0] : null); // Return the user details if found
  });
};


// Function to hash with MD5
const hashMD5 = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};


// Login route with bcrypt + MD5 check
app.post("/api/signin", (req, res) => {
  const { unbox, passbox } = req.body;

  if (!unbox || !passbox) {
    return res.status(400).json({ message: "Unbox and password are required." });
  }

  const queryMainDB = "SELECT id, unbox, ref_db, passbox FROM uerp_user WHERE unbox = ?";
  db.query(queryMainDB, [unbox], async (err, mainResult) => {
    if (err) {
      console.error("Main database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (mainResult.length === 0) {
      return res.status(401).json({ message: "Invalid unbox or password in main database." });
    }

    const { id, unbox: mainUnbox, ref_db, passbox: mainHashedPassword } = mainResult[0];
    

    // Check bcrypt first
    let isPasswordValid = await bcrypt.compare(passbox, mainHashedPassword);

    // If bcrypt fails, check MD5
    if (!isPasswordValid) {
      isPasswordValid = mainHashedPassword === hashMD5(passbox);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid unbox or password in main database." });
    }

    console.log("Main database authentication successful:", { id, mainUnbox, ref_db });

    // Connect to the database specified by ref_db
    const secondaryDB = mysql.createPool({
      host: "localhost",
      user: "saas",
      password: "Bangladesh$$786",
      database: ref_db,
      connectionLimit: 10,
    });

    const querySecondaryDB = "SELECT id, unbox, username, username2, email, phone, passbox FROM uerp_user WHERE unbox = ?";
    secondaryDB.query(querySecondaryDB, [unbox], async (err, secondaryResult) => {
      if (err) {
        console.error("Secondary database error:", err);
        return res.status(500).json({ message: "Error connecting to secondary database." });
      }

      if (secondaryResult.length === 0) {
        return res.status(401).json({ message: "Invalid unbox or password in secondary database." });
      }

      const { id: secondaryId, unbox: secondaryUnbox, username, username2, email, phone, passbox: secondaryHashedPassword } =
        secondaryResult[0];

      // Check bcrypt first
      let isSecondaryPasswordValid = await bcrypt.compare(passbox, secondaryHashedPassword);

      // If bcrypt fails, check MD5
      if (!isSecondaryPasswordValid) {
        isSecondaryPasswordValid = secondaryHashedPassword === hashMD5(passbox);
      }

      if (!isSecondaryPasswordValid) {
        return res.status(401).json({ message: "Invalid unbox or password in secondary database." });
      }

      console.log("Secondary database authentication successful:", {
        secondaryId,
        secondaryUnbox,
        username,
        username2,
        email,
        phone,
      });

      return res.status(200).json({
        saas: { id, unbox: mainUnbox, ref_db },
        secondary: { id: secondaryId, unbox: secondaryUnbox, username, username2, email, phone },
      });
    });
  });
});



// Define the connectToDatabase function
const connectToDatabase = (ref_db) => {
  return new Promise((resolve, reject) => {
    const dbConnection = mysql.createPool({
      host: 'localhost',
      user: 'saas',
      password: 'Bangladesh$$786',
      database: ref_db,
    });

    // Test the connection
    dbConnection.getConnection((err, connection) => {
      if (err) {
        reject(err); // If there's an error, reject the promise
      } else {
        resolve(dbConnection); // If the connection is successful, resolve the promise
      }
    });
  });
};



app.post("/api/update-user-info", async (req, res) => {
  const { ref_db } = req.query;
  const { id, username, username2, phone, address, city, country } = req.body;

    // Log the incoming data
    console.log("Received request with the following data:");
    console.log("Query parameters:", { ref_db });
    console.log("Request body:", { id, username, username2, phone, address, city, country });

  if (!ref_db || !id) {
    console.log("Error: Missing required parameters.");
    return res.status(400).json({ success: false, message: "Missing parameters." });
  }

  try {
     // Log the database connection attempt
     console.log(`Attempting to connect to database: ${ref_db}`);

    // Connect to the secondary database using ref_db
    const dbConnection = await connectToDatabase(ref_db);

    // Log the SQL query and the parameters being passed
    console.log("Executing SQL query with the following data:");
    console.log({
      query: "UPDATE uerp_user SET username = ?, username2 = ?, phone = ?, address = ?, city = ?, country = ? WHERE id = ?",
      parameters: [username, username2, phone, address, city, country, id],
    });


    // Update the user info in the uerp_user table
    await dbConnection.query(
      "UPDATE uerp_user SET username = ?, username2 = ?, phone = ?, address = ?, city = ?, country = ? WHERE id = ?",
      [username, username2, phone, address, city, country, id]
    );

    console.log("User info updated successfully in the database.");
    res.json({ success: true, message: "User info updated successfully." });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


app.get('/api/users', async (req, res) => {
  const { ref_db } = req.query;

  if (!ref_db) {
    return res.status(400).json({ success: false, message: 'Missing ref_db parameter.' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = 'SELECT username2, images FROM uerp_user where mtype = "CLIENT"';
    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' }); 
  }
});



//NEDD TO ADD IN NEXIS SERVER START AFTER API USERS 

//Time Interval Start


app.post('/api/save-single-interval', async (req, res) => {
  const { ref_db, sid, intervalIndex, latitude, longitude, userId } = req.body;

  if (!ref_db || !sid || !intervalIndex || latitude == null || longitude == null || !userId) {
    return res.status(400).json({ success: false, message: 'Missing or invalid parameters' });
  }

  try {
    const db = await connectToDatabase(ref_db);

    // Generate the field names dynamically based on the interval
    const tA = `t${intervalIndex}a`;
    const tB = `t${intervalIndex}b`;

    // Check if this is the first interval or if we need to update an existing row
    const checkQuery = `
      SELECT * FROM schedule_tracking WHERE sid = ?
    `;

    db.query(checkQuery, [sid], (err, result) => {
      if (err) {
        console.error('Error checking if job exists:', err);
        return res.status(500).json({ success: false, message: 'DB error' });
      }

      if (result.length > 0) {
        // If there's an existing row for the given sid, update the intervals
        const updateQuery = `
          UPDATE schedule_tracking 
          SET ${tA} = ?, ${tB} = ?, employeeid = ?
          WHERE sid = ?
        `;
        db.query(updateQuery, [latitude, longitude, userId, sid], (err, updateResult) => {
          if (err) {
            console.error('Error updating interval:', err);
            return res.status(500).json({ success: false, message: 'Error updating interval' });
          }

          res.json({ success: true, message: `Interval ${intervalIndex} updated successfully.` });
        });
      } else {
        // If no row exists for the given sid, insert a new row with the first set of intervals
        const insertQuery = `
          INSERT INTO schedule_tracking (sid, ${tA}, ${tB}, employeeid) 
          VALUES (?, ?, ?, ?)
        `;
        db.query(insertQuery, [sid, latitude, longitude, userId], (err, insertResult) => {
          if (err) {
            console.error('Error inserting new job intervals:', err);
            return res.status(500).json({ success: false, message: 'Error inserting new job intervals' });
          }

          res.json({ success: true, message: `Interval ${intervalIndex} inserted successfully.` });
        });
      }
    });
  } catch (error) {
    console.error('Error in API:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





//Time Interval End

app.post('/api/clock-in', upload.single("images"), async (req, res) => {
  const { ref_db, jobId, clockIn, latitude, longitude } = req.body;
  const file = req.file;

  if (!ref_db || !jobId || !clockIn || !latitude || !longitude || !file) {
    return res.status(400).json({ success: false, message: 'All fields are required, including ref_db.' });
  }

  try {
    const { date } = JSON.parse(clockIn);
    const dbConnection = await connectToDatabase(ref_db);

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const query = 'UPDATE shifting_allocation SET clockin = ?, latitude_in = ?, longitude_in = ?, image_in = ? WHERE id = ?';
    dbConnection.query(query, [`${date}`, latitude, longitude, imageUrl, jobId], (err, result) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error.' });
      }

      res.json({ success: true, message: 'Clock-in successful' });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});
 

app.post('/api/clock-out', upload.single("images"), async (req, res) => {
  const { ref_db, jobId, clockOut, latitude, longitude } = req.body;
  const file = req.file;

  if (!ref_db || !jobId || !clockOut || !latitude || !longitude || !file) {
    return res.status(400).json({ success: false, message: 'All fields are required, including ref_db.' });
  }

  try {
    const { date } = JSON.parse(clockOut);
    const dbConnection = await connectToDatabase(ref_db);

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const query = 'UPDATE shifting_allocation SET clockout = ?, latitude_out = ?, longitude_out = ?, image_out = ? WHERE id = ?';
    dbConnection.query(query, [`${date}`, latitude, longitude, imageUrl, jobId], (err, result) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error.' });
      }

      res.json({ success: true, message: 'Clock-out successful' });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


app.get("/api/get-jobs", async (req, res) => {
  const { ref_db, userid, filter } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    let query = `
      SELECT sa.id, sa.stime, sa.etime, sa.clientid, sa.clockin, sa.image_in, sa.image_out, sa.clockout, sa.accepted, uu.username AS client_name
      FROM shifting_allocation sa
      LEFT JOIN uerp_user uu ON sa.clientid = uu.id
      WHERE sa.employeeid = ?
    `;

    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    if (filter === "today") {
      query += ` AND DATE(sa.stime) = '${todayDate}' AND sa.clockin = 0 AND sa.clockout = 0`;
    } else if (filter === "ongoing") {
      query += ` AND sa.clockin > 0 AND sa.clockout = 0`;
    } else if (filter === "completed") {
      query += ` AND sa.clockin > 0 AND sa.clockout > 0`; 
    } else if (filter === "upcoming") {
      query += ` AND DATE(sa.stime) > '${todayDate}'`;
    }

    query += ` ORDER BY sa.id DESC LIMIT 10`;

    dbConnection.query(query, [userid], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, jobs: results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});




app.post("/api/accept-job", async (req, res) => {
  const { ref_db, userid, jobId } = req.body;

  if (!ref_db || !userid || !jobId) {
    return res.status(400).json({ success: false, message: "ref_db, userid, and jobId are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `
      UPDATE shifting_allocation
      SET accepted = 1
      WHERE id = ? AND employeeid = ?
    `;

    dbConnection.query(query, [jobId, userid], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.affectedRows > 0) {
        res.json({ success: true, message: "Job accepted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Job not found or already accepted" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



app.get('/api/documents', async (req, res) => {
  const { ref_db } = req.query;

  if (!ref_db) {
    return res.status(400).json({ success: false, message: 'Missing ref_db parameter.' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    // const query = "SELECT * FROM modules where parent = '5174' ";
    const query = "SELECT * FROM modules WHERE (parent = '5174' AND dashboard = '1') ORDER BY orders ASC";

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching documents:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch documents.' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.get('/api/favicon', async (req, res) => {
  const { ref_db } = req.query;

  if (!ref_db) {
    return res.status(400).json({ success: false, message: 'ref_db is required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const query = 'SELECT favicon FROM companysetting WHERE id = 1';  // Assuming you're fetching the favicon for a fixed ID, adjust accordingly

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Data not found' });
      }

      res.json({ success: true, favicon: results[0].favicon });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.get('/api/get-profile', async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: 'ref_db and userid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const query = `
      SELECT uerp_user.address, uerp_user.department, uerp_user.id, uerp_user.jointime, 
      uerp_user.nationality, uerp_user.marital_status, uerp_user.driving_licence_no,
      uerp_user.address2, uerp_user.city, uerp_user.area, uerp_user.account_name, uerp_user.bank_name, uerp_user.dob, uerp_user.gender, uerp_user.email, uerp_user.abn,
      uerp_user.emergency_contact_1, uerp_user.emergency_contact_2, uerp_user.emergency_relation_1, uerp_user.emergency_relation_2, uerp_user.emergency_email_1, uerp_user.emergency_email_2, uerp_user.emergency_phone_1, uerp_user.emergency_phone_2,
      uerp_user.zip, uerp_user.country,  uerp_user.account_number, uerp_user.bsb, uerp_user.images,
      designation.designation AS designation_name
      FROM uerp_user
      JOIN designation ON uerp_user.designation = designation.id
      WHERE uerp_user.id = ?
    `;

    dbConnection.query(query, [userid], (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, profile: results[0] });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.get('/api/get-tasks', async (req, res) => {
  const { ref_db, userid, activity } = req.query;

  if (!ref_db || !userid || !activity) {
    return res.status(400).json({ success: false, message: 'ref_db, userid, and activity are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const query = 'SELECT id, date, title, detail, start, end FROM tasks WHERE employeeid = ? and activity = ?';

    dbConnection.query(query, [userid, activity], (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({ success: true, tasks: results });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post("/api/update-task-status", async (req, res) => {
  const { ref_db, userid, taskId, newStatus } = req.body;

  if (!ref_db || !userid || !taskId || !newStatus) {
    return res.status(400).json({ success: false, message: "ref_db, userid, taskId, and newStatus are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `
      UPDATE tasks 
      SET activity = ? 
      WHERE employeeid = ? AND id = ?
    `;

    dbConnection.query(query, [newStatus, userid, taskId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.affectedRows > 0) {
        res.json({ success: true, message: "Task status updated" });
      } else {
        res.status(404).json({ success: false, message: "Task not found or already updated" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.get('/api/recent-activity', async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: 'ref_db and userid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const query = `SELECT date, tran_type, note FROM audit WHERE sourceid = ? ORDER BY id DESC LIMIT 10`;

    dbConnection.query(query, [userid], (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
       console.log('Query Results:', results);
      res.json({ success: true, activities: results });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get("/api/get-project-teams", async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    // Fetch project team allocation data using userid directly
    const query = `SELECT pta.*, p.clientid, u.username, u.username2 FROM project_team_allocation pta 
    JOIN project p ON pta.projectid = p.id
    LEFT JOIN uerp_user u ON p.clientid = u.id
    WHERE pta.employeeid = ?`;
    dbConnection.query(query, [userid], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, data: results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-alluser", async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `SELECT id, username, username2 FROM uerp_user WHERE mtype = "USER" AND status = 1 OR mtype="ADMIN" and status = 1`;
    dbConnection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, data: results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-modules", async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `SELECT * FROM modules WHERE id = 5276 and status = 1 order by id ASC limit 1`;
    dbConnection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, data: results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-parents-modules", async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `SELECT * FROM modules WHERE parent = 5276 and status = 1 order by id ASC`;
    dbConnection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, data: results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



// app.get("/api/update-boc", async (req, res) => {
//     const { ref_db, userid, date, type, freq, other, other1, dur, other3, earlywining, earlywiningex, bocParticipant, preBoc, reinforcement, information, additionalInfo, suggestion, clientid } = req.query;
  
//     if (!ref_db || !userid) {
//       return res.status(400).json({ success: false, message: "ref_db and userid are required" });
//     }
  
//     try {
//       const dbConnection = await connectToDatabase(ref_db);
  
//       // Update BOC table with all form fields
//       const query = ` UPDATE boc SET date = ?, typeid = ?, frequencyid = ?, type_other = ?, frequency_other = ?, durationid = ?,
//       duration_other = ?, signs = ?, signs_note = ?, situation_note = ? , situation_description = ?, factor_note = ?, information = ?, information_note = ?, suggest = ?, clientid = ?  WHERE employeeid = ?`;
  
//       const values = [date, type, freq, other, other1, dur, other3, earlywining, earlywiningex, bocParticipant, preBoc, reinforcement, information, additionalInfo, suggestion, clientid, userid];
  
//       dbConnection.query(query, values, (err, results) => {
//         if (err) {
//           console.error("Database error:", err);
//           return res.status(500).json({ success: false, message: "Database error" });
//         }
  
//         res.json({ success: true, message: "BOC record updated successfully", data: results });
//       });
//     } catch (error) {
//       console.error("Internal server error:", error);
//       res.status(500).json({ success: false, message: "Internal server error" });
//     }
//   });



app.get("/api/insert-eod", async (req, res) => {
  const { ref_db, userid, date, clientid, shift, type, other, behave, challenge, challenge1, communication, communication1, communication2, wellbeing, wellbeing1, wellbeing2,
  socialize1, socialize2, learn1, learn2, staff, staff1, staff2, engagement1, engagement2, manage, manage1, manage2, risk, risk1, risk2, documentation, documentation1, documentation2,
  summary1, summary2, status } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    // Insert data into EOD table
    const query = `INSERT INTO eod (employeeid, eod_date, clientid, shiftid, activityid, activity_other, eod_behavior, eod_eat, eod_walk,
    eod_communication, eod_communication_note, eod_communication_scale, eod_mobility, eod_mobility_note, eod_mobility_scale, eod_social_note, eod_socialize_scale,
    eod_learn, eod_learn_note, eod_notification, eod_notification_note, eod_notification_scale, eod_engagement_note, eod_engagement_scale, eod_manage,
    eod_manage_note, eod_manage_scale, eod_risk, eod_risk_note, eod_risk_scale, eod_document, eod_document_note, eod_suggest_note, eod_summary, eod_suggest_overall_note, status )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [userid, date, clientid, shift, type, other, behave, challenge, challenge1, communication, communication1, communication2, wellbeing, wellbeing1,
    wellbeing2, socialize1, socialize2, learn1, learn2, staff, staff1, staff2, engagement1, engagement2, manage, manage1, manage2, risk, risk1, risk2, documentation,
    documentation1, documentation2, summary1, summary2, status ];

    dbConnection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, message: "EOD record inserted successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.get("/api/insert-boc", async (req, res) => {
    const { ref_db, userid, date, type, freq, other, other1, dur, other3, earlywining, earlywiningex, bocParticipant, preBoc, reinforcement, information, additionalInfo, suggestion, clientid, status } = req.query;
  
    if (!ref_db || !userid) {
      return res.status(400).json({ success: false, message: "ref_db and userid are required" });
    }
  
    try {
      const dbConnection = await connectToDatabase(ref_db);
  
      // Insert data into BOC table
      const query = `INSERT INTO boc (employeeid, date, typeid, frequencyid, type_other, frequency_other, durationid,
        duration_other, signs, signs_note, situation_note, situation_description, factor_note, information, information_note, suggest, clientid, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      const values = [userid, date, type, freq, other, other1, dur, other3, earlywining, earlywiningex, bocParticipant, preBoc, reinforcement, information, additionalInfo, suggestion, clientid, status];
  
      dbConnection.query(query, values, (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, message: "Database error" });
        }
  
        res.json({ success: true, message: "BOC record inserted successfully", data: results });
      });
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
});

 
app.post("/api/insert-incident", upload.single('document'), async (req, res) => {
  const { ref_db, userid, date, clientid, person, incident, witness1, dob1, address1, phone1, witness2, dob2, address2, phone2, incidentdate, timeofincident, happend, incidentperform, type,
    other, type1, other1, type2, other2, type3, other3, suggestion, firstaid, status } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    const referredValue = `${type3 || ""} - ${other3 || ""}`;

    // Handle file upload
    let filePath = null;
    if (req.file) {
      filePath = path.join(uploadPath, req.file.filename);
    }

    // Insert data into the incident table with file path
    const query = `INSERT INTO incident (employeeid, date, clientid, upload, involved, location, witness1, dob1, address1, phone1, witness2, dob2, address2, phone2, incidentdate, hourminute, what_happened,
        what_performed, injury, other_injury, area, other_area, treatment, treatment_other, referred, suggestion, firstaid, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;  

    const values = [userid, date, clientid, filePath, person, incident, witness1, dob1, address1, phone1, witness2, dob2, address2, phone2, incidentdate, timeofincident, happend, incidentperform, type,
    other, type1, other1, type2, other2, referredValue, suggestion, firstaid, status];  

    dbConnection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, message: "Incident record inserted successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.get("/api/campaigns-form", async (req, res) => {
  const {
    ref_db,
    userid,
    campaignName,
    managerid,
    plan,
    possibility,
    opportunity,
    priority,
    currentDate
  } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `INSERT INTO campaigns (campaign_name, employeeid, plan, possibility, opportunity, priority, start_date)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [campaignName, managerid, plan, possibility, opportunity, priority, currentDate];

    dbConnection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, message: "Campaign created successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-campaigns", async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `SELECT c.*, u.username, u.username2 FROM campaigns c LEFT JOIN uerp_user u ON c.employeeid = u.id`;

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/update-campaign", async (req, res) => {
  const {
    ref_db,
    id,
    campaignName,
    plan,
    priority,
    possibility,
    managerid,
    opportunity
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing campaign ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const updateQuery = `
      UPDATE campaigns 
      SET campaign_name = ?, plan = ?, priority = ?, possibility = ?, opportunity = ?, employeeid = ?
      WHERE id = ?`;

    const values = [campaignName, plan, priority, possibility, opportunity, managerid, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Campaign updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/update-campaign-status", async (req, res) => {
  const { ref_db, campaignId, newStatus } = req.body;

  if (!ref_db || !campaignId || !newStatus) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const updateQuery = `UPDATE campaigns SET status = ? WHERE id = ?`;

    dbConnection.query(updateQuery, [newStatus, campaignId], (err, result) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ success: false, message: "Database update failed" });
      }

      res.json({ success: true, message: "Status updated successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/leads-form", upload.single('images'), async (req, res) => {
  const { ref_db, userid, leadName, campaignid, title, firstName, surName, preferredName, gender, dob, address, city, state, zip, country, email, phone, billingAddress, clientStory,
    note, managerid, addemail, addphone, type, priority, ndis, followUpDate, appointmentDate, targetDate, status } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : '';
    
    const query = `INSERT INTO leads (employeeid, image, lead_name, campaignid, title, name, surname, preferred_name, gender, cdob, address, ccity, cstate, czip, ccountry,
      email, phone, billing_address, note, note_for_staff, case_manager, remail, rphone, rtype, priority, ndis_no, followup_date, appointment_date, target_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;  

    const values = [userid, imageUrl, leadName, campaignid, title, firstName, surName, preferredName, gender, dob, address, city, state, zip,
    country, email, phone, billingAddress, clientStory, note, managerid, addemail, addphone, type, priority, ndis, followUpDate, appointmentDate, targetDate, status];  

    dbConnection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, message: "Leads record inserted successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-leads", async (req, res) => {
  const { ref_db, userid } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `SELECT l.*, u.username, u.username2, c.campaign_name FROM leads l LEFT JOIN uerp_user u ON l.employeeid = u.id LEFT JOIN campaigns c ON l.campaignid = c.id`;

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/update-lead", async (req, res) => {
  const {
    ref_db,
    id,
    address,
    surname,
    leadname,
    name
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing campaign ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const updateQuery = `
      UPDATE leads 
      SET address = ?, surname = ?, lead_name = ?, name = ?
      WHERE id = ?`;

    const values = [address, surname, leadname, name, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Leads updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/update-leads-status", async (req, res) => {
  const { ref_db, leadId, newStatus } = req.body;

  if (!ref_db || !leadId || !newStatus) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const updateQuery = `UPDATE leads SET status = ? WHERE id = ?`;

    dbConnection.query(updateQuery, [newStatus, leadId], (err, result) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ success: false, message: "Database update failed" });
      }

      res.json({ success: true, message: "Status updated successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/call", upload.single('document'), async (req, res) => {
  const { ref_db, userid, logid, date, title, detail, status, client_response, log_type  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }


  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }

    const query = `
      INSERT INTO activity_logs (logid, date, documents, title, detail, status, client_response, log_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [logid, date, filePath, title, detail, status, client_response, log_type];

    dbConnection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Call log saved successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-calls", async (req, res) => {
    const {ref_db, userid} = req.query;
    
    if (!ref_db || !userid) {
        return res.status(400).json({success:false, message: "ref_db and userid are required"});
    }
    
    try {
        const dbConnection = await connectToDatabase(ref_db);
        
        const query = 'SELECT * FROM activity_logs WHERE log_type = ?';
        const values = ['CALL'];
        
        dbConnection.query(query, values, (err, results) =>{
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({success: false, message: "Database error"});
            }
            res.json({success: true, data: results});
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}); 

app.post("/api/update-call", upload.single('document'), async (req, res) => {
  const {
    ref_db,
    userid,
    id,
    title,
    detail,
    date
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing activity_logs ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }
    
    const updateQuery = `
      UPDATE activity_logs 
      SET title = ?, documents = ?, detail = ?, date = ?
      WHERE id = ?`;

    const values = [title, filePath, detail, date, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Calls updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/email", upload.single('document'), async (req, res) => {
  const { ref_db, userid, logid, date, title, detail, status, client_response, log_type  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }


  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }

    const query = `
      INSERT INTO activity_logs (logid, date, documents, title, detail, status, client_response, log_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [logid, date, filePath, title, detail, status, client_response, log_type];

    dbConnection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Call log saved successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-emails", async (req, res) => {
    const {ref_db, userid} = req.query;
    
    if (!ref_db || !userid) {
        return res.status(400).json({success:false, message: "ref_db and userid are required"});
    }
    
    try {
        const dbConnection = await connectToDatabase(ref_db);
        
        const query = 'SELECT * FROM activity_logs WHERE log_type = ?';
        const values = ['EMAIL'];
        
        dbConnection.query(query, values, (err, results) =>{
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({success: false, message: "Database error"});
            }
            res.json({success: true, data: results});
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}); 

app.post("/api/update-email", upload.single('document'), async (req, res) => {
  const {
    ref_db,
    userid,
    id,
    title,
    detail,
    date
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing activity_logs ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }
    
    const updateQuery = `
      UPDATE activity_logs 
      SET title = ?, documents = ?, detail = ?, date = ?
      WHERE id = ?`;

    const values = [title, filePath, detail, date, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Calls updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/minutes", upload.single('document'), async (req, res) => {
  const { ref_db, userid, logid, date, title, detail, status, client_response, log_type  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }


  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }

    const query = `
      INSERT INTO activity_logs (logid, date, documents, title, detail, status, client_response, log_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [logid, date, filePath, title, detail, status, client_response, log_type];

    dbConnection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Call log saved successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-minutes", async (req, res) => {
    const {ref_db, userid} = req.query;
    
    if (!ref_db || !userid) {
        return res.status(400).json({success:false, message: "ref_db and userid are required"});
    }
    
    try {
        const dbConnection = await connectToDatabase(ref_db);
        
        const query = 'SELECT * FROM activity_logs WHERE log_type = ?';
        const values = ['MINUTES'];
        
        dbConnection.query(query, values, (err, results) =>{
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({success: false, message: "Database error"});
            }
            res.json({success: true, data: results});
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}); 

app.post("/api/update-minute", upload.single('document'), async (req, res) => {
  const {
    ref_db,
    userid,
    id,
    title,
    detail,
    date
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing activity_logs ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }
    
    const updateQuery = `
      UPDATE activity_logs 
      SET title = ?, documents = ?, detail = ?, date = ?
      WHERE id = ?`;

    const values = [title, filePath, detail, date, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Calls updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/cases", upload.single('document'), async (req, res) => {
  const { ref_db, userid, logid, date, title, detail, status, client_response, log_type  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }


  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }

    const query = `
      INSERT INTO activity_logs (logid, date, documents, title, detail, status, client_response, log_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [logid, date, filePath, title, detail, status, client_response, log_type];

    dbConnection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Call log saved successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-cases", async (req, res) => {
    const {ref_db, userid} = req.query;
    
    if (!ref_db || !userid) {
        return res.status(400).json({success:false, message: "ref_db and userid are required"});
    }
    
    try {
        const dbConnection = await connectToDatabase(ref_db);
        
        const query = 'SELECT * FROM activity_logs WHERE log_type = ?';
        const values = ['CASES'];
        
        dbConnection.query(query, values, (err, results) =>{
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({success: false, message: "Database error"});
            }
            res.json({success: true, data: results});
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}); 

app.post("/api/update-cases", upload.single('document'), async (req, res) => {
  const {
    ref_db,
    userid,
    id,
    title,
    detail,
    date
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing activity_logs ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }
    
    const updateQuery = `
      UPDATE activity_logs 
      SET title = ?, documents = ?, detail = ?, date = ?
      WHERE id = ?`;

    const values = [title, filePath, detail, date, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Calls updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/quote", upload.single('document'), async (req, res) => {
  const { ref_db, userid, logid, date, title, detail, status, client_response, log_type  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }


  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }

    const query = `
      INSERT INTO activity_logs (logid, date, documents, title, detail, status, client_response, log_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [logid, date, filePath, title, detail, status, client_response, log_type];

    dbConnection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Call log saved successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-quotes", async (req, res) => {
    const {ref_db, userid} = req.query;
    
    if (!ref_db || !userid) {
        return res.status(400).json({success:false, message: "ref_db and userid are required"});
    }
    
    try {
        const dbConnection = await connectToDatabase(ref_db);
        
        const query = 'SELECT * FROM activity_logs WHERE log_type = ?';
        const values = ['QUOTE'];
        
        dbConnection.query(query, values, (err, results) =>{
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({success: false, message: "Database error"});
            }
            res.json({success: true, data: results});
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}); 

app.post("/api/update-quote", upload.single('document'), async (req, res) => {
  const {
    ref_db,
    userid,
    id,
    title,
    detail,
    date
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing activity_logs ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }
    
    const updateQuery = `
      UPDATE activity_logs 
      SET title = ?, documents = ?, detail = ?, date = ?
      WHERE id = ?`;

    const values = [title, filePath, detail, date, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Calls updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/deal", upload.single('document'), async (req, res) => {
  const { ref_db, userid, logid, date, title, detail, status, client_response, log_type  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }


  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }

    const query = `
      INSERT INTO activity_logs (logid, date, documents, title, detail, status, client_response, log_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [logid, date, filePath, title, detail, status, client_response, log_type];

    dbConnection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Call log saved successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-deals", async (req, res) => {
    const {ref_db, userid} = req.query;
    
    if (!ref_db || !userid) {
        return res.status(400).json({success:false, message: "ref_db and userid are required"});
    }
    
    try {
        const dbConnection = await connectToDatabase(ref_db);
        
        const query = 'SELECT * FROM activity_logs WHERE log_type = ?';
        const values = ['DEAL'];
        
        dbConnection.query(query, values, (err, results) =>{
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({success: false, message: "Database error"});
            }
            res.json({success: true, data: results});
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}); 

app.post("/api/update-deal", upload.single('document'), async (req, res) => {
  const {
    ref_db,
    userid,
    id,
    title,
    detail,
    date
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing activity_logs ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }
    
    const updateQuery = `
      UPDATE activity_logs 
      SET title = ?, documents = ?, detail = ?, date = ?
      WHERE id = ?`;

    const values = [title, filePath, detail, date, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Calls updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/api/contract", upload.single('document'), async (req, res) => {
  const { ref_db, userid, logid, date, title, detail, status, client_response, log_type  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }


  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }

    const query = `
      INSERT INTO activity_logs (logid, date, documents, title, detail, status, client_response, log_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [logid, date, filePath, title, detail, status, client_response, log_type];

    dbConnection.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Call log saved successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/get-contracts", async (req, res) => {
    const {ref_db, userid} = req.query;
    
    if (!ref_db || !userid) {
        return res.status(400).json({success:false, message: "ref_db and userid are required"});
    }
    
    try {
        const dbConnection = await connectToDatabase(ref_db);
        
        const query = 'SELECT * FROM activity_logs WHERE log_type = ?';
        const values = ['CONTRACT'];
        
        dbConnection.query(query, values, (err, results) =>{
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({success: false, message: "Database error"});
            }
            res.json({success: true, data: results});
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}); 

app.post("/api/update-contract", upload.single('document'), async (req, res) => {
  const {
    ref_db,
    userid,
    id,
    title,
    detail,
    date
  } = req.body;

  if (!ref_db || !id) {
    return res.status(400).json({ success: false, message: "Missing activity_logs ID or ref_db" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
     //Handle file upload
    let filePath = 0;
    if(req.file) {
        filePath = path.join(uploadPath, req.file.filename);
    }
    
    const updateQuery = `
      UPDATE activity_logs 
      SET title = ?, documents = ?, detail = ?, date = ?
      WHERE id = ?`;

    const values = [title, filePath, detail, date, id];

    dbConnection.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Calls updated successfully", data: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/category-form", async (req, res) => {
  const {
    ref_db,
    userid,
    categoryName,
    moduleid,
    status
  } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = `INSERT INTO modules (parent, name, status)
                   VALUES (?, ?, ?)`;

    const values = [moduleid, categoryName, status];

    dbConnection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, message: "Category created successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/view-category", async (req, res) => {
  const { ref_db, userid, status } = req.query;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: 'ref_db and userid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    let query = "SELECT id, name FROM modules WHERE parent = 5276";
    if (status === '1') {
      query += " AND status = 1";
    } else if (status === '0') {
      query += " AND status = 0";
    }

    dbConnection.query(query, async (err, categories) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err });
      }

      // For each category, count documents in global_documents
      const enhancedCategories = await Promise.all(
        categories.map(async (category) => {
          return new Promise((resolve, reject) => {
            const countQuery = `SELECT * FROM global_documents WHERE categoryid = ? AND employeeid = ?`;
            dbConnection.query(countQuery, [category.id, userid], (err, results) => {
              if (err) return reject(err);
              resolve({
                id: category.id,
                name: category.name,
                document_count: results.length,
                documents: results
              });
            });
          });
        })
      );

      res.json({ success: true, data: enhancedCategories });
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});





app.post('/api/documents-form', upload.array('document'), async (req, res) => {
  const {
    ref_db,
    documentName,
    parentsmoduleid,
    userid,
    cardNumber,
    date,
    status,
  } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: 'ref_db and userid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const timestamp = Math.floor(Date.now() / 1000);

    const globalQuery = `
      INSERT INTO global_documents 
      (document_name, categoryid, employeeid, card_number, expire_date, hard_copy, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const globalValues = [documentName, parentsmoduleid, userid, cardNumber, date, timestamp, status];

    dbConnection.query(globalQuery, globalValues, async (err, globalResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error in global_documents" });
      }

      const globalDocId = globalResult.insertId;

      // Insert multiple rows in multi_documents for each uploaded file
      const files = req.files || [];
      const insertedFiles = [];

      try {
        for (const file of files) {
          const filePath = path.join(uploadPath, file.filename);
          const multiQuery = `
            INSERT INTO multi_documents (uid, postid, location, date, randid, status, source)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
          const multiValues = [userid, globalDocId, filePath, timestamp, timestamp, 1, "GLOBAL DOCUMENTS"];

          const multiResult = await new Promise((resolve, reject) => {
            dbConnection.query(multiQuery, multiValues, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            });
          });

          insertedFiles.push({ file: file.filename, insertId: multiResult.insertId });
        }

        res.json({
          success: true,
          message: "Document saved in both tables",
          globalInsertId: globalDocId,
          filesInserted: insertedFiles
        });

      } catch (multiErr) {
        console.error("Error inserting into multi_documents:", multiErr);
        res.status(500).json({ success: false, message: "Error in multi_documents", error: multiErr });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});




app.get('/api/eod', async (req, res) => {
  const { ref_db, employeeid } = req.query;

  if (!ref_db || !employeeid) {
    return res.status(400).json({ success: false, message: 'ref_db and employeeid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const query = 'SELECT * FROM eod WHERE employeeid = ? and status = 1 ';

    dbConnection.query(query, [employeeid], (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      res.json({ success: true, data: results });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/eod-pagination', async (req, res) => {
  const { ref_db, employeeid, page = 1, limit = 50 } = req.query;

  if (!ref_db || !employeeid) {
    return res.status(400).json({ success: false, message: 'ref_db and employeeid are required' });
  }

  try {
    // Connect to the database
    const dbConnection = await connectToDatabase(ref_db);

    // Ensure page and limit are valid integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or limit value' });
    }

    // Calculate the offset for pagination
    const offset = (pageNum - 1) * limitNum;

    console.log(`Page: ${pageNum}, Limit: ${limitNum}, Offset: ${offset}`);

    // Get total count for pagination
    const totalCountQuery = `
      SELECT COUNT(*) AS total FROM eod
      LEFT JOIN uerp_user ON eod.clientid = uerp_user.id
      WHERE eod.employeeid = ? AND eod.status = 1
    `;
    dbConnection.query(totalCountQuery, [employeeid], (err, countResults) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      const totalRecords = countResults[0].total;
      const totalPages = Math.ceil(totalRecords / limitNum);

      // Fetch paginated data
      const query = `
        SELECT *, uerp_user.username AS eoduser, uerp_user.username2 AS eoduser2
        FROM eod
        LEFT JOIN uerp_user ON eod.clientid = uerp_user.id
        WHERE eod.employeeid = ? AND eod.status = 1
        ORDER BY eod.eod_date DESC
        LIMIT ? OFFSET ?
      `;
      dbConnection.query(query, [employeeid, limitNum, offset], (err, results) => {
        if (err) {
          console.error('MySQL Error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        // Send paginated data along with total pages information
        res.json({ success: true, data: results, totalPages, totalRecords });
      });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/boc', async (req, res) => {
  const { ref_db, employeeid } = req.query;

  if (!ref_db || !employeeid) {
    return res.status(400).json({ success: false, message: 'ref_db and employeeid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const query = 'SELECT * FROM boc WHERE employeeid = ? and status = 1';

    dbConnection.query(query, [employeeid], (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

    //   if (results.length === 0) {
    //     return res.status(404).json({ success: false, message: 'Data not found' });
    //   }

      res.json({ success: true, data: results });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/boc-pagination', async (req, res) => {
  const { ref_db, employeeid, page = 1, limit = 50 } = req.query;

  if (!ref_db || !employeeid) {
    return res.status(400).json({ success: false, message: 'ref_db and employeeid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    // Ensure page and limit are valid integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or limit value' });
    }

    // Calculate the offset for pagination
    const offset = (pageNum - 1) * limitNum;

    console.log(`Page: ${pageNum}, Limit: ${limitNum}, Offset: ${offset}`);

    // Get total count for pagination
    const totalCountQuery = `
      SELECT COUNT(*) AS total FROM boc
      LEFT JOIN uerp_user ON boc.clientid = uerp_user.id
      WHERE boc.employeeid = ? AND boc.status = 1
    `;
    dbConnection.query(totalCountQuery, [employeeid], (err, countResults) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      const totalRecords = countResults[0].total;
      const totalPages = Math.ceil(totalRecords / limitNum);

      // Fetch paginated data
      const query = `
        SELECT *, uerp_user.username AS bocuser, uerp_user.username2 AS bocuser2
        FROM boc
        LEFT JOIN uerp_user ON boc.clientid = uerp_user.id
        WHERE boc.employeeid = ? AND boc.status = 1
        ORDER BY boc.date DESC
        LIMIT ? OFFSET ?
      `;
      dbConnection.query(query, [employeeid, limitNum, offset], (err, results) => {
        if (err) {
          console.error('MySQL Error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        // Send paginated data along with total pages information
        res.json({ success: true, data: results, totalPages, totalRecords });
      });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/incident', async (req, res) => {
  const { ref_db, employeeid } = req.query;

  if (!ref_db || !employeeid) {
    return res.status(400).json({ success: false, message: 'ref_db and employeeid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const query = 'SELECT * FROM incident WHERE employeeid = ? and status = 1 ';

    dbConnection.query(query, [employeeid], (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

    //   if (results.length === 0) {
    //     return res.status(404).json({ success: false, message: 'Data not found' });
    //   }

      res.json({ success: true, data: results });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/incident-pagination', async (req, res) => {
  const { ref_db, employeeid, page = 1, limit = 50 } = req.query;

  if (!ref_db || !employeeid) {
    return res.status(400).json({ success: false, message: 'ref_db and employeeid are required' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    // Ensure page and limit are valid integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or limit value' });
    }

    // Calculate the offset for pagination
    const offset = (pageNum - 1) * limitNum;

    console.log(`Page: ${pageNum}, Limit: ${limitNum}, Offset: ${offset}`);

    // Get total count for pagination
    const totalCountQuery = `
      SELECT COUNT(*) AS total FROM incident
      LEFT JOIN uerp_user ON incident.clientid = uerp_user.id
      WHERE incident.employeeid = ? AND incident.status = 1
    `;
    dbConnection.query(totalCountQuery, [employeeid], (err, countResults) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      const totalRecords = countResults[0].total;
      const totalPages = Math.ceil(totalRecords / limitNum);

      // Fetch paginated data
      const query = `
        SELECT *, uerp_user.username AS incidentuser, uerp_user.username2 AS incidentuser2
        FROM incident
        LEFT JOIN uerp_user ON incident.clientid = uerp_user.id
        WHERE incident.employeeid = ? AND incident.status = 1
        ORDER BY incident.date DESC
        LIMIT ? OFFSET ?
      `;
      dbConnection.query(query, [employeeid, limitNum, offset], (err, results) => {
        if (err) {
          console.error('MySQL Error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        // Send paginated data along with total pages information
        res.json({ success: true, data: results, totalPages, totalRecords });
      });
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



//NEDD TO ADD IN NEXIS SERVER END




app.get('/api/users-one', async (req, res) => {
  const { ref_db } = req.query;

  if (!ref_db) {
    return res.status(400).json({ success: false, message: 'Missing ref_db parameter.' });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);

    const query = 'SELECT username2, images FROM uerp_user where mtype = "EMPLOYEE" or mtype = "USER"';
    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// app.post('/api/add-user', async (req, res) => {
//   const { ref_db } = req.query;
//   const { username2, images } = req.body;

//   if (!ref_db || !username2 || !images) {
//     return res.status(400).json({ message: 'Missing required fields.' });
//   }

//   try {
//     const dbConnection = await connectToDatabase(ref_db);

//     const query = 'INSERT INTO uerp_user (username2, images) VALUES (?, ?)';
//     dbConnection.query(query, [username2, images], (err) => {
//       if (err) {
//         console.error('Error adding user:', err);
//         return res.status(500).json({ message: 'Failed to add user.' });
//       }

//       res.status(200).json({ message: 'User added successfully.' });
//     });
//   } catch (error) {
//     console.error('Error connecting to database:', error);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });

// API to add a user with an image upload
app.post("/api/add-user", upload.single("images"), async (req, res) => {
  const { ref_db } = req.query;
  const { username2 } = req.body;
  const file = req.file;

  if (!ref_db || !username2 || !file) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Connect to the secondary database
    const dbConnection = await connectToDatabase(ref_db);

    // Construct the file URL (for public access)
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    // Insert the user with the image URL
    const query = "INSERT INTO uerp_user (username2, images) VALUES (?, ?)";
    dbConnection.query(query, [username2, imageUrl], (err) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ message: "Failed to add user." });
      }

      res.status(200).json({ message: "User added successfully.", imageUrl });
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Serve static files for uploaded images
app.use("/uploads", express.static(uploadPath));







// API route to save user device ID
app.post('/api/save-device-id', (req, res) => {
  const { email, deviceId } = req.body;

  if (!email || !deviceId) {
    return res.status(400).json({ error: 'Email and Device ID are required' });
  }

  // Save device ID in main `saas` database
  const updateMainDbQuery = `
    UPDATE uerp_user 
    SET device_id = ? 
    WHERE email = ?
  `;
  
  // Use `db` to execute the query on the main `saas` database
  db.query(updateMainDbQuery, [deviceId, email], (mainDbError) => {
    if (mainDbError) {
      console.error('Error updating device ID in main database:', mainDbError);
      return res.status(500).json({ error: 'Failed to save device ID in main database' });
    }

    // Fetch the user-specific database name based on email
    const ref_db = `saas_${email.replace(/@/g, '_').replace(/\./g, '_')}`;

    // Connect to the user-specific database
    const userDbConnection = mysql.createPool({
      host: 'localhost',
      user: 'saas',
      password: 'Bangladesh$$786',
      database: ref_db,
    });

    // Update the user-specific database with the device ID
    const updateUserDbQuery = `
      UPDATE uerp_user 
      SET device_id = ?
      WHERE email = ?
    `;

    userDbConnection.query(updateUserDbQuery, [deviceId, email], (userDbError) => {
      if (userDbError) {
        console.error('Error updating device ID in user-specific database:', userDbError);
        return res.status(500).json({ error: 'Failed to save device ID in user database' });
      }

      res.json({ message: 'Device ID saved successfully in both databases!' });
    });
  });
});

// API endpoint to update FCM token
app.post('/api/update-fcm', (req, res) => {
  const { email, fcmToken } = req.body;
  console.log('Received payload:', { email, fcmToken });

  if (!email || !fcmToken) {
    return res.status(400).json({ error: 'Email and FCM token are required' });
  }

  // Update the FCM token in the database based on the email
  const query = 'UPDATE uerp_user SET fcm = ? WHERE email = ?';
  db.execute(query, [fcmToken, email], (err, result) => {
    if (err) {
      console.error('Error updating FCM token:', err);
      return res.status(500).json({ error: 'Error updating FCM token' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found with the given email' });
    }

    res.status(200).json({ message: 'FCM token updated successfully' });
  });
});


// Fetch solution names from the solutions table
app.get("/api/solutions", async (req, res) => {
  const { ref_db } = req.query;

  if (!ref_db) {
    return res.status(400).json({ success: false, message: "Missing ref_db parameter." });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    const sql = "SELECT name FROM solutions";

    dbConnection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching solutions from secondary database:", err);
        return res.status(500).send("Server error");
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error connecting to secondary database:", error);
    res.status(500).json({ success: false, message: "Failed to connect to secondary database." });
  }
});



// Update dashboard settings in the user-specific database
app.post('/api/update-dashboard', (req, res) => {
  const { selectedSolution, userEmail } = req.body;  // Expect the user's email to identify the user-specific database

  // Generate the user-specific database name based on the user's email
  const ref_db = `saas_${userEmail.replace(/@/g, '_').replace(/\./g, '_')}`;

  // Connect to the user-specific database
  const userDB = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  // SQL to update all solutions in the user-specific database
  const updateAllSql = 'UPDATE solutions SET dashboard = 0';
  const updateSelectedSql = 'UPDATE solutions SET dashboard = 1 WHERE name = ?';

  // Update all solutions to set dashboard = 0
  userDB.query(updateAllSql, (err) => {
    if (err) {
      console.error(`Error updating dashboard in ${ref_db}:`, err);
      return res.status(500).json({ error: 'Failed to update dashboard in user database' });
    }

    // Update the selected solution to set dashboard = 1
    userDB.query(updateSelectedSql, [selectedSolution], (err2) => {
      if (err2) {
        console.error(`Error updating selected solution in ${ref_db}:`, err2);
        return res.status(500).json({ error: 'Failed to update selected solution in user database' });
      }

      res.json({ message: 'Dashboard updated successfully in user-specific database!' });
    });
  });
});


// Modify API route to handle POST requests and dynamic database selection
app.post("/api/get-dashboard-menu", (req, res) => {
  const { email, ref_db, application } = req.body;

  if (!ref_db || !application) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a new MySQL connection pool for the specific user database
  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,    
  });

  // Query the menu based on the selected application
  const sql = `SELECT * FROM solutions WHERE dashboard = 1 ORDER BY orders ASC`;

  dbConnection.query(sql, [application], (err, results) => {
    if (err) {
      console.error(`Error fetching menu data for database ${ref_db}:`, err);
      return res.status(500).json({ error: 'Failed to fetch menu data' });
    }

    res.json(results); // Return the results as a JSON response
  });
});



// Fetch Modules Menu Data
app.post("/api/modu", async (req, res) => {
  const { email, ref_db, application } = req.body;

  if (!ref_db || !application) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create a new MySQL connection pool for the specific user database
    const dbConnection = mysql.createPool({
      host: 'localhost',
      user: 'saas',
      password: 'Bangladesh$$786',
      database: ref_db,
    });

    // Query to fetch sidebar menu based on selected application
    const sql = "SELECT * FROM modules ORDER BY orders ASC";

    dbConnection.query(sql, (err, results) => {
      // Release the connection and handle results
      dbConnection.end();

      if (err) {
        console.error(`Error fetching sidebar menu data for database ${ref_db}:`, err);
        return res.status(500).json({ error: 'Failed to fetch sidebar menu data' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({ error: "Failed to connect to the database." });
  }
});


// Update the dashboard value for an item
app.post("/api/updateToggles", (req, res) => {
  const { ref_db, itemId, dashboard } = req.body;

  if (!ref_db || !itemId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a new MySQL connection pool for the specific user database
  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  // Update query to set the new dashboard value
  const updateQuery = "UPDATE solutions SET dashboard = ? WHERE id = ?";

  dbConnection.query(updateQuery, [dashboard, itemId], (err, result) => {
    if (err) {
      console.error(`Error updating dashboard value for item ${itemId}:`, err);
      return res.status(500).json({ error: 'Failed to update dashboard value' });
    }

    res.json({ success: true, message: 'Dashboard value updated successfully' });
  });
});


// Fetch Sidebar Menu Data
app.post("/api/sidebarmenus", (req, res) => {
  const { email, ref_db, application } = req.body;

  if (!ref_db || !application) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db, 
  });

 
  const sql = "SELECT * FROM solutions ORDER BY orders ASC";  

  dbConnection.query(sql, (err, results) => {
    if (err) {
      console.error(`Error fetching sidebar menu data for database ${ref_db}:`, err);
      return res.status(500).json({ error: 'Failed to fetch sidebar menu data' });
    }

    res.json(results);
  });
});

// Update the dashboard value for an item
app.post("/api/updateToggle", (req, res) => {
  const { ref_db, itemId, dashboard } = req.body;

  if (!ref_db || !itemId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a new MySQL connection pool for the specific user database
  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  // Update query to set the new dashboard value
  const updateQuery = "UPDATE solutions SET dashboard = ? WHERE id = ?";

  dbConnection.query(updateQuery, [dashboard, itemId], (err, result) => {
    if (err) {
      console.error(`Error updating dashboard value for item ${itemId}:`, err);
      return res.status(500).json({ error: 'Failed to update dashboard value' });
    }

    res.json({ success: true, message: 'Dashboard value updated successfully' });
  });
});



// Fetch Sidebar Menu Data from dynamic database
app.post("/api/sidebarmenu", (req, res) => {
  const { email, ref_db, application } = req.body;

  if (!ref_db || !application) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a new MySQL connection pool for the specific user database
  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  // Query to fetch sidebar menu based on selected application
  const sql = "SELECT * FROM solutions WHERE parent = '0' and status = '1' and dashboard = '1' ORDER BY orders ASC";

  dbConnection.query(sql, [application], (err, results) => {
    if (err) {
      console.error(`Error fetching sidebar menu data for database ${ref_db}:`, err);
      return res.status(500).json({ error: 'Failed to fetch sidebar menu data' });
    }

    res.json(results);
  });
});

// Fetch Modules Menu Data from dynamic database
app.post("/api/modulesmenu", (req, res) => {
  const { email, ref_db, application } = req.body;

  if (!ref_db || !application) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a new MySQL connection pool for the specific user database
  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  // Query to fetch modules menu based on selected application
  const sql = "SELECT * FROM modules WHERE dashboard = '1' and profile = '0' and status = '1' ORDER BY orders ASC";

  dbConnection.query(sql, [application], (err, results) => {
    if (err) {
      console.error(`Error fetching modules menu data for database ${ref_db}:`, err);
      return res.status(500).json({ error: 'Failed to fetch modules menu data' });
    }

    res.json(results);
  });
});

// Fetch Modules P Menu Data from dynamic database
app.post("/api/modulespmenu", (req, res) => {
  const { email, ref_db, application } = req.body;

  if (!ref_db || !application) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a new MySQL connection pool for the specific user database
  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  // Query to fetch modules P menu based on selected application
  const sql = "SELECT * FROM modules WHERE parent = '5174' and dashboard = '1' and status = '1' ORDER BY orders ASC";

  dbConnection.query(sql, [application], (err, results) => {
    if (err) {
      console.error(`Error fetching modules P menu data for database ${ref_db}:`, err);
      return res.status(500).json({ error: 'Failed to fetch modules P menu data' });
    }

    res.json(results);
  });
});

// Fetch Modules PS Menu Data (third layer) from dynamic database
app.post("/api/modulespsmenu", (req, res) => {
  const { email, ref_db, application } = req.body;

  if (!ref_db || !application) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a new MySQL connection pool for the specific user database
  const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  // Query to fetch modules PS menu based on selected application
  const sql = "SELECT * FROM modules WHERE parent = '5174' and dashboard = '1' and status = '1' ORDER BY orders ASC";

  dbConnection.query(sql, [application], (err, results) => {
    if (err) {
      console.error(`Error fetching modules PS menu data for database ${ref_db}:`, err);
      return res.status(500).json({ error: 'Failed to fetch modules PS menu data' });
    }

    res.json(results);
  });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

