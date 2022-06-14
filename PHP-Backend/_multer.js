const multer = require("multer");
const storage  = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
      },
      filename(req, file = {}, cb) {
        const { originalname } = file;
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
        cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`);
      },
});

module.exports = {storage, multer};