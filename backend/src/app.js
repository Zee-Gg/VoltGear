import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'

dotenv.config()


const app =express();
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use ( express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/v1', router)

app.get('/' , (req,res)=>{
    res.json({
        success:'true',
        message:'VoltGear is running'
    })
})

app.use((req , res)=>{
    res.status(404).json({
        success:false ,
        message:'Route not found'

    })
})

app.use((err, req,res,next)=>{
    console.error(err.stack)
    res.status(err.status || 500).json({
        success:'false',
        message:err.message || 'Internal Server Error'
    })

    
})

export default app