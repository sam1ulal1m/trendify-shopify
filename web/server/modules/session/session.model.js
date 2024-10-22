import mongoose from 'mongoose';
const { Schema } = mongoose;

const shopifySessionSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  shop: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  scope: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ShopifySession = mongoose.model('shopify_session', shopifySessionSchema);


export default ShopifySession;
