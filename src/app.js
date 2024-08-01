const express = require('express');
const { Client } = require('pg');
const { USER } = require('./tablenames');
require('dotenv').config();

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/db', async (req, res) => {
  const client = new Client({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
  });
  try {
    await client.connect();

    const dbresult = await client.query('SELECT NOW() as now');
    // console.log(dbresult);
    res.json(dbresult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unexpected error' });
  } finally {
    client.end();
  }
});

app.get('/user', async (req, res) => {
  const client = new Client({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
  });
  try {
    await client.connect();

    const dbresult = await client.query(`SELECT * FROM public."${USER}"`);
    // console.log(dbresult);
    res.json({ users: dbresult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unexpected error' });
  } finally {
    client.end();
  }
});

module.exports = app;
