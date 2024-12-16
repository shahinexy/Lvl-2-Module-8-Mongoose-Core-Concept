// const express = require('express')
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StudentRouters } from './app/Modules/student/student.route';
const app: Application = express();
// const port = 3000

//parsers
app.use(express.json());
app.use(cors());

// aplication routes
app.use('/api/vi/students', StudentRouters)

app.get('/', (req: Request, res: Response) => {
  const a = 10;

  res.send(a);
});

export default app;
