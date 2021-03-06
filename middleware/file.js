const MIME_TYPE_MAP =
  {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
  }

const multer = require('multer');

const storage = multer.diskStorage
(
  {
    destination : (request,file,callback)=>
    {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");

      if (isValid)
      {
        error = null;
      }

      callback(error,"images");
    },
    filename : (request,file,callback)=>
    {
      const name = file.originalname.toLowerCase().split(" ").join('-');
      const extension = MIME_TYPE_MAP[file.mimetype];
      callback(null,name + '-' + Date.now() + '.' + extension);
    }
  }
);

module.exports = multer({storage}).single('image');
