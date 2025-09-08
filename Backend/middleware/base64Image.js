const fs = require("fs");
const path = require("path");

const saveBase64Image = async (req, res, next) => {
  try {
    const { pic } = req.body;

    if (!pic) {
      return res.status(400).json({
        status: false,
        response_code: 400,
        message: "Profile image is required",
      });
    }

    const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
    const matches = pic.match(base64Pattern);
    if (!matches) {
      return res.status(400).json({
        status: false,
        response_code: 400,
        message: "Invalid base64 image format",
      });
    }

    const fileExtension = matches[1];
    const base64Data = pic.replace(base64Pattern, "");

    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = path.join(
      __dirname,
      "../../Backend/public/assets",
      fileName
    );

    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(filePath, base64Data, "base64");

    req.imagePath = `${fileName}`;

    next();
  } catch (error) {
    console.error("Error in saveBase64Image middleware:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Failed to process profile image",
    });
  }
};

module.exports = saveBase64Image;
