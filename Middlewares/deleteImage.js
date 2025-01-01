
const asyncHandler = require("express-async-handler");
const fs = require("fs");



const deleteImage = asyncHandler(async (req) => {
    fs.access(req, fs.constants.F_OK, (err) => {
        if (err) {
          // File doesn't exist
          console.error(
            `Error deleting previous image: File does not exist`
          );
        } else {
          // File exists, attempt to delete it
          fs.unlink(req, (err) => {
            if (err) {
              console.error(`Error deleting previous image: ${err}`);
            } else {
              console.log(`Previous image deleted successfully`);
            }
          });
        }
      });

});


module.exports = {deleteImage};