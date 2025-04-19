import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './db/db.js'
import authRoutes from './routes/authRoutes.js'
import moodRoutes from './routes/moodEntryRoutes.js'
import todoRoutes from './routes/todoRoutes.js' // Add this line for Todo routes

dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/mood', moodRoutes)
app.use('/api/todos', todoRoutes) // Add this line for Todo routes

// Default route
app.get('/', (req, res) => {
  res.send('API is working...')
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`))