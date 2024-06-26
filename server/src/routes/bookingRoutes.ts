import express, { Request, Response } from 'express';
import Slot from '../model/Slots';

const router = express.Router();

router.post('/book', async (req: Request, res: Response) => {

    const { date, time } = req.body;
  
    try {
      const slot = await Slot.findOne({ date, time });
      if (!slot) {
        return res.status(404).send('Slot not found');
      }
      if (slot.isBooked) {
        return res.status(400).send('Slot already booked');
      }
  
      slot.isBooked = true;
      await slot.save();
  
      res.status(200).send('Slot booked');
    } catch (error) {
      res.status(400).send(error);
    }
  });

router.get('/slots', async (req, res) => {

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

try {
    const slots = await Slot.find({
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json({
        slots
    });
} catch (error) {
    res.status(500).json({
        message: error
    });
}
})

export const bookingRoutes = router;