import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;