const express = require('express');
const logger = require('./logger');
const {collectDefaultMetrics, register} = require('prom-client');

collectDefaultMetrics();

const app = express();

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.get('/log', async (_req, res) => {
    try {
        logger.log({
            level: 'info',
            message: 'Hello distributed log files! ' + new Date()
          });
          
        logger.info('Hello again distributed logs');

        res.status(200).end();
    } catch (err) {
      res.status(500).end(err);
    }
  });

const port = 4001;

const path = require('path');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(port, '0.0.0.0', () => {
  console.log("Starting on port", port);
});