import express from "express";
import { userRouter } from "./router/user.router.js";
import { zapRouter } from "./router/zap.router.js";
import cors from "cors";
import { triggerRouter } from "./router/trigger.router.js";
import { actionRouter } from "./router/action.router.js";

const app=express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Moved to top
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});


app.use('/api/v1/user',userRouter);
app.use('/api/v1/zap',zapRouter);
app.use('/api/v1/trigger',triggerRouter);
app.use('/api/v1/action',actionRouter);


// app.post('/user/signup', (req, res) => {});

// app.post('/user/signin', (req, res) => {});


// app.post('/zap/signin', (req, res) => {});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});