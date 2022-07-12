import config from "../config";

/**
 * Downloads a file from S3 using the API.
 * @param {string} file_key - The full to the file in the bucket
 * @param {string} token - The JWT token to use against the API
 */
const downloadFileAttachment = (file_key, token) => {
  if (file_key) {
    // Remove forward slash if present
    if (file_key[0] === "/") file_key = file_key.substring(1);
    const url = `${config.env.APP_API_ENDPOINT}/files/download/${file_key}`;

    fetch(url, {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // We care
          response
            .json()
            .then((data) => {
              if (data?.download_url) {
                window.location = data.download_url;
              } else {
                console.log("Error Downloading File: No download URL");
              }
            })
            .catch((err) => {
              console.log("Error Downloading File: " + JSON.stringify(err));
            });
        } else {
          // Error
          console.log("Error: Unable to download file.");
        }
      })
      .catch((err) => {
        console.log("Error Downloading File: " + JSON.stringify(err));
      });
  }
};

export default downloadFileAttachment;
