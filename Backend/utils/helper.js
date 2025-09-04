const jwt = require("jsonwebtoken");

const isVerifiedToken = async (token) => {
  try {
    const isVerified = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!!isVerified) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const getAssetURL = (assetName = "", directoryPath = "/assets") => {
  const baseURL = process.env.BASE_URL || "";

  // if (!assetName || typeof assetName !== "string") {
  //     return "";
  // }

  // if (assetName?.startsWith("http://") || assetName?.startsWith("https://")) {
  //     return assetName;
  // }

  return `${baseURL}${directoryPath}/${assetName}`;
};

module.exports = {
  isVerifiedToken,
  getAssetURL,
};
