import mongoose from 'mongoose';

const aayushmanSchema = new mongoose.Schema({
  cardId: {
    type: String,
    unique: true,
  },
});

export default mongoose.model('AayushmanCard', aayushmanSchema);
