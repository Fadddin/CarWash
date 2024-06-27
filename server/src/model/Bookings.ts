import mongoose, {Document, Schema} from "mongoose";

export interface Booking extends Document {
    name: string;
    phoneNumber: string;
    address: string;
    carNumber: string;
    carName: string;
    bookingTime: string;
    bookingDate: string;
    user: string;
}

const bookingSchema = new Schema<Booking>({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    carNumber: { 
        type: String,
        required: true
    },
    carName: {
        type: String,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    bookingDate: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
    
})

export default mongoose.model<Booking>('Booking', bookingSchema);