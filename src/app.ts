// const express = require('express')
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StudentRouters } from './app/Modules/student/student.route';
import { UserRouters } from './app/Modules/user/user.route';
import globalErrorHandler from './app/middlwares/globalErrorHandler';
import notFound from './app/middlwares/notFound';
const app: Application = express();

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

// global error handler 
app.use(globalErrorHandler)

// 404 router not found
app.use(notFound)

export default app;
