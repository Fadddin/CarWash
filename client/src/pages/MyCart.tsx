import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase-config';

interface Booking {
    _id: string;
    name: string;
    phoneNumber: string;
    address: string;
    carNumber: string;
    carName: string;
    bookingTime: string;
    bookingDate: string;
    user: string;
}

const MyCart: React.FC = () => {
    const [bookingData, setBookingData] = useState<Booking[] | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            // Get the currently signed-in user
            const user = auth.currentUser;

            if (!user) {
                alert('Please sign in to book a slot');
                return;
            }

            try {
                const response = await axios.get('http://localhost:7070/v1/api/user/cart', {
                    params: {
                        user: user.email,
                    },
                });

                // Map the response data
                const data: Booking[] = response.data.bookings;
                setBookingData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            {bookingData ? (
                <div>
                    <h1 className='mx-4 my-8 text-3xl font-bold font'>MY ORDERS</h1>
                    <ul className=''>
                        {bookingData.map((booking) => (
                            <li key={booking._id} className='m-4 shadow-lg gap-y-2 p-4 border w-[40%]'>
                                <p><strong>Name:</strong> {booking.name}</p>
                                <p><strong>Car:</strong> {booking.carName}</p>
                                <p><strong>Number:</strong> {booking.carNumber}</p>
                                <p><strong>Date:</strong> {booking.bookingDate}</p>
                                <p><strong>time:</strong> {booking.bookingTime}</p>

                                {/* Add other booking details as needed */}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>No bookings yet.</div>
            )}
        </div>
    );
};

export default MyCart;
