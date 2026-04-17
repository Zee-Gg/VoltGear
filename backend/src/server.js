import 'dotenv/config'
// import { config } from 'dotenv'
// config({ path: '.env' })
import app from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT ,()=>{
    console.log(`Server running on port ${PORT}`)
} )