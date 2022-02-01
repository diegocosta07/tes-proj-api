const Router = require('express');
const IssueRouter = Router();
const path = require('path');
const issueController = require('../controllers/Issue');

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.mkv`)
  }
})

const upload = multer({ storage: storage });

IssueRouter.all('/',(req,res,next) => {
  res.setHeader('Content-type', 'application/json');
  next();
})
.post('/create', issueController.createIssue)
.post('/attachment/:key', upload.single('video'), issueController.sendAttachment)

module.exports = IssueRouter;