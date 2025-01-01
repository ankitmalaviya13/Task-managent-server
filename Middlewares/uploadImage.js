const asyncHandler = require("express-async-handler");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/userprofiles"); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  // limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
});

const uploadProfileImage = asyncHandler(async (req, res, next) => {
  try {
    upload.single("profilepic")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(200)
          .json({ Status: 0, Message: "File upload error" });
      } else if (err) {
        return res.status(200).json({
          Status: 0,
          error: err,
          Message: "Internal server error",
        });
      }
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({
      Status: 0,
      Message: "Something went wrong. Profile not updated",
      err: err,
    });
  }
});

module.exports = { uploadProfileImage };
