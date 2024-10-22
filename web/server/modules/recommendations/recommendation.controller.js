import { Recommendations } from "./recommendations.model.js";

export async function createRecommendation(req, res) {
    const { title, type, products } = req.body;
    const { shop } = res.locals.shopify.session
    console.log("title", title);
    console.log("type", type);
    console.log("products", products);
    console.log("shop", res.locals.shopify.shop);
    const recommendation = new Recommendations({
        shop,
        title,
        type,
        products
    });
    recommendation.save()
        .then(() => res.status(201).json(recommendation))
        .catch((error) => res.status(400).json(error));
}