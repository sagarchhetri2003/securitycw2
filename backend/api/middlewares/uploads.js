
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileDestination = "public/uploads/";
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true });
    }
    cb(null, fileDestination);
  },
  filename: function (req, file, cb) {
    const sanitizedName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_.-]/g, "");
    cb(null, Date.now() + "_" + sanitizedName);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/svg+xml"];
  const allowedExtensions = /\.(jpg|jpeg|png|svg)$/i;

  const isExtensionValid = allowedExtensions.test(file.originalname);
  const isMimeValid = allowedMimeTypes.includes(file.mimetype);

  if (!isExtensionValid || !isMimeValid) {
    return cb(new Error("Only image files (JPG, PNG, SVG) are allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

module.exports = upload;
