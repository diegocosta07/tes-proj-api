const Router = require('express');
const routes = Router();

const issueRouter = require('./routers/issueRouter');

routes.use("/issue", issueRouter);

module.exports = routes;