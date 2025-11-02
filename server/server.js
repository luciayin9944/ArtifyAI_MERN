import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRouters.js';


const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
await connectDB();

app.use('/api/user',userRouter)
app.get('/', (req, res) => res.send("API is working"));

// app.listen(PORT, () => console.log('Server is running on port: ' + PORT));
const server = app.listen(PORT, () => {
  console.log('Server is running on port:', PORT);
});
server.on('error', (err) => console.error('Server error:', err));