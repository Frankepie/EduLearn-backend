const cloudinary = require("../config/cloudinary");


// =====================================
// UPLOAD COURSE IMAGE
// =====================================

const uploadImageToCloudinary = (fileBuffer) => {

  return new Promise((resolve, reject) => {

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "edulearn/courses",
          resource_type: "image"
        },

        (error, result) => {

          if (error) {

            reject(error);

          } else {

            resolve(result);

          }

        }
      );

    uploadStream.end(fileBuffer);

  });

};


// =====================================
// UPLOAD LESSON VIDEO
// =====================================

const uploadVideoToCloudinary = (fileBuffer) => {

  return new Promise((resolve, reject) => {

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "edulearn/lessons",
          resource_type: "video"
        },

        (error, result) => {

          if (error) {

            reject(error);

          } else {

            resolve(result);

          }

        }
      );

    uploadStream.end(fileBuffer);

  });

};
// =====================================
// UPLOAD PROFILE IMAGE
// =====================================

const uploadProfileImageToCloudinary = (fileBuffer) => {

  return new Promise((resolve, reject) => {

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "edulearn/profiles",
          resource_type: "image"
        },

        (error, result) => {

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }

        }
      );

    uploadStream.end(fileBuffer);

  });

};

module.exports = {
  uploadImageToCloudinary,
  uploadProfileImageToCloudinary,
  uploadVideoToCloudinary
};