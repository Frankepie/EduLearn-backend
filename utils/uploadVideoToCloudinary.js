const cloudinary =
  require("../config/cloudinary");

const uploadVideoToCloudinary = (
  fileBuffer
) => {

  return new Promise(
    (resolve, reject) => {

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

    }
  );

};

module.exports =
  uploadVideoToCloudinary;