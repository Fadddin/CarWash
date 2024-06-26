import mongoose, {Document, Schema} from "mongoose";

export interface Slot extends Document {
    date: Date;
    time: string;
    isBooked: boolean;
}

const slotSchema = new Schema<Slot>({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    isBooked: {
        type: Boolean,
        required: true
    }
})

export default mongoose.model<Slot>('Slot', slotSchema);