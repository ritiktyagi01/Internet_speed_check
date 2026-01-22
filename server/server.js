import express from 'express'
import cors from 'cors'
 import router from './routes/speed-route.js';


const PORT = process.env.PORT ||2000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.raw({ type: '*/*', limit: '20mb' }));



app.get('/',(req,res)=>{
    res.send('server is live !')
})
app.use('/api/',router)

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
});