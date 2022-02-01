const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');
const AdmZip = require('adm-zip');
const path = require('path');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

module.exports = {
  async sendAttachment(req, res, next) {
    try {
      let issueKey = req.params.key;
      let body = req.body;
      let token = req.headers['token'];
      let zip = new AdmZip();

      zip.addFile(`ajaxRequests-${issueKey}.json`,
        Buffer.from(body.ajaxInteceptor, "utf-8"));

      zip.addFile(`eventListened-${issueKey}.json`,
        Buffer.from(body.eventListener, "utf-8"));

      zip.addLocalFile(`${req.file.path}`);

      zip.writeZip(path.join(__dirname,`../uploads/${issueKey}.zip`));

      const filePath = path.join(__dirname, `../uploads/${issueKey}.zip`);
      const form = new FormData();
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      const fileStream = fs.createReadStream(filePath);

      form.append('file', fileStream, { knownLength: fileSizeInBytes });
      console.log(issueKey);
      await fetch(`https://myproj-jira.atlassian.net/rest/api/3/issue/${issueKey}/attachments`, {
        method: 'POST',
        agent: httpsAgent,
        body: form,
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${token}`
          ).toString('base64')}`,
          'Accept': 'application/json',
          'X-Atlassian-Token': 'no-check'
        }
      })
        .then(response => {
          console.log(
            `Response from attachment: ${response.status} ${response.statusText}`
          );
          res.sendStatus(response.status);
          return response.status;
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
    } catch {
      res.sendStatus(400);
    }
  },

  async createIssue (req, res, next) {
    try {
      let token = req.headers['token'];
      await fetch('https://myproj-jira.atlassian.net/rest/api/3/issue', {
        method: 'POST',
        agent: httpsAgent,
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${token}`
          ).toString('base64')}`,
          'Accept':'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      })
      .then(response => {
        console.log(
          `Response from crate issue: ${response.status} ${response.statusText}`
        );
        return response.text();
      })
      .then(text => {
        let obj = JSON.parse(text);
        res.json(obj)
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      })
    } catch {
      res.sendStatus(400);
    }
  }
}