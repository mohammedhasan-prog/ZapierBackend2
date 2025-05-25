import express from "express";
import { userRouter } from "./router/user.router.js";
import { zapRouter } from "./router/zap.router.js";
import cors from "cors";
import { triggerRouter } from "./router/trigger.router.js";
import { actionRouter } from "./router/action.router.js";

const app=express();
const PORT=3000;
app.use(express.json());
app.use(cors());


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