import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import {userRoutes} from './routes/userRoutes'
import Slot from './model/Slots';
import cron from 'node-cron'
import { bookingRoutes } from './routes/bookingRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/v1/api/user', userRoutes);
app.use('/v1/api/booking', bookingRoutes);


mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    // const tomorrow = new Date(today);
    // tomorrow.setDate(today.getDate() + 1);
    const formattedDate = today.toLocaleDateString();
  
    const startHour = 9; // 9 AM
    const endHour = 15; // 3 PM
    const interval = 30; // 30 minutes
  
    const slots = [];
  
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slot = new Slot({ date: formattedDate, time, isBooked: false });
        slots.push(slot);
      }
    }
  
    try {
      await Slot.insertMany(slots);
      console.log(`Slots generated for ${formattedDate}`);
    } catch (error) {
      console.error(`Failed to generate slots: ${error}`);
    }
  });


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
