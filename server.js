const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path"); // ← ADD THIS LINE (missing)

const connectDB = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const lessonProgressRoutes = require("./routes/lessonProgressRoutes");
const progressRoutes = require("./routes/progressRoutes");
const courseProgressRoutes = require("./routes/courseProgressRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const assignmentSubmissionRoutes = require("./routes/assignmentSubmissionRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const communicationRoutes = require("./routes/communicationRoutes");
const profileRoutes = require('./routes/profile');
const settingsRoutes =
  require("./routes/settingsRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files - FIXED PATH
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "EduLearn LMS API is running"
  });
});

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/lesson-progress", lessonProgressRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/course-progress", courseProgressRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/assignment-submissions", assignmentSubmissionRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/communication", communicationRoutes);
app.use('/api/profile', profileRoutes); // ← Profile routes added
app.use( "/api/settings",settingsRoutes);
// Start Server
app.listen(PORT, () => {
  console.log(`EduLearn backend running on port ${PORT}`);
});