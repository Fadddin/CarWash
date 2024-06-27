import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase-config';


interface BookingSlot {
  id: number;
  time: string;
  isBooked: boolean;
}


interface FormData {
  name: string;
  phoneNumber: string;
  address: string;
  carNumber: string;
  carName: string;
  bookingTime: string;
  bookingDate: string;
}

const Booking: React.FC = () => {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    address: '',
    carNumber: '',
    carName: '',
    bookingTime: '',
    bookingDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });

  useEffect(() => {

    const fetchSlots = async () => {
      try {
        const response = await axios.get<{ slots: BookingSlot[] }>('http://localhost:7070/v1/api/booking/slots');

        if (Array.isArray(response.data.slots)) {
          setSlots(response.data.slots);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        setError('Error fetching booking slots');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    const user = auth.currentUser;
    console.log(user?.email);


    if (!user) {
      alert('Please sign in to book a slot');
      return;
    }


    const currentDate = new Date();
    const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    

    try {
      // Send the booking time and today's date
      await axios.post('http://localhost:7070/v1/api/booking/book', {
        date: formattedDate,
        time: formData.bookingTime
      });

      // Send the rest of the information
      await axios.post('http://localhost:7070/v1/api/booking/save', {
        bookingTime: formData.bookingTime,
        bookingDate: formData.bookingDate,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        carNumber: formData.carNumber,
        carName: formData.carName,
        user: user.email
      });

      alert('Booking submitted successfully');
    } catch (err) {
      alert('Error submitting booking');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  // console.log(formattedDate, formData.bookingTime);


  return (
    <div>
      <div className='m-8 text-2xl font-bold '> BOOK YOUR SLOT FOR {formattedDate}</div>
      <form onSubmit={handleSubmit} className='m-8'>
        <div className='grid grid-cols-1 gap-4'>
          
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleInputChange}
            className='px-4 py-2 border rounded-md'
            required
          />
          <input
            type='text'
            name='phoneNumber'
            placeholder='Phone Number'
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className='px-4 py-2 border rounded-md'
            required
          />
          <input
            type='text'
            name='address'
            placeholder='Address'
            value={formData.address}
            onChange={handleInputChange}
            className='px-4 py-2 border rounded-md'
            required
          />
          <input
            type='text'
            name='carNumber'
            placeholder='Car Number'
            value={formData.carNumber}
            onChange={handleInputChange}
            className='px-4 py-2 border rounded-md'
            required
          />
          <input
            type='text'
            name='carName'
            placeholder='Car Name'
            value={formData.carName}
            onChange={handleInputChange}
            className='px-4 py-2 border rounded-md'
            required
          />
          <input
            type='hidden'
            name='bookingTime'
            value={formData.bookingTime}
            onChange={handleInputChange}
          />
          <input
            type='hidden'
            name='bookingDate'
            value={formData.bookingDate}
            onChange={handleInputChange}
          />
        </div>

        <div className='m-8 border grid grid-cols-5'>
          {slots.map(slot => (
            <button
              type='button'
              key={slot.id}
              disabled={slot.isBooked}
              className={`m-4 px-4 py-2 rounded-md shadow-md text-center ${slot.isBooked ? 'bg-slate-700 text-white line-through' : 'bg-slate-200'}`}
              onClick={() => setFormData({ ...formData, bookingTime: slot.time })}
            >
              {slot.time}
            </button>
          ))}
        </div>
        <div className='m-8 text-xl font-bold h-10'>
          {formData.bookingTime ? `Time Selected as ${formData.bookingTime}` : ''}
        </div>
        <button type='submit' className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Booking;
