import mongoose from 'mongoose';
const RecommendationsSchema = new mongoose.Schema({
    title: String,
    type: String,
    shop: String,
    description: String,
    recommendedProducts : [{
        id: String,
        title: String,
        handle: String,
        image: String,
        variants: [{
            id: String
        }]
    }],
    products: [{
        id: String,
        variants: [{
            id: String
        }]
    }]
});
export const Recommendations = mongoose.model('Recommendations', RecommendationsSchema);