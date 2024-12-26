// const express = require('express')
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StudentRouters } from './app/Modules/student/student.route';
import { UserRouters } from './app/Modules/user/user.route';
const app: Application = express();
// const port = 3000

//parsers
app.use(express.json());
app.use(cors());

// students routes
app.use('/api/vi/students', StudentRouters)

// users router
app.use('/api/vi/users', UserRouters)

app.get('/', (req: Request, res: Response) => {
  const a = 10;

  res.send(a);
});

export default app;
