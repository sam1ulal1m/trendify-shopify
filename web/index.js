// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { rootRouter } from "./server/routes/rootRouter.js";
import { createRecommendation } from "./server/modules/recommendations/recommendation.controller.js";
import { Recommendations } from "./server/modules/recommendations/recommendations.model.js";
import ShopifySession from "./server/modules/session/session.model.js";
import { getOrderedProducts } from "./server/modules/orders/order.controller.js";
import { getProductsByHandles } from "./server/modules/products/products.controller.js";
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

dotenv.config();
try {
  mongoose.connect(process.env.MONGO_STRING + "/" + process.env.DATABASE_NAME);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB: ", error);

}
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js


app.get("/api/products-by-handle", async (_req, res) => {
  try {
    const shop = _req.query.shop;
    const session = await ShopifySession.findOne({
      shop
    });
    const token = session?.accessToken;
    const productHandle = _req.query.handle;
    // http://127.0.0.1:5000/recommend?product_handle=california-sun-kissed-navel-oranges
    // response : {
    // "recommended_products": [
    //  "seedless-green-table-grapes",
    //  "fresh-organic-honeycrisp-apples",
    //  "farm-fresh-organic-strawberries"
    // ]
    const handleResponse = await fetch(`http://127.0.0.1:5000/recommend?product_handle=${productHandle}`);
    const handleData = await handleResponse.json();
    console.log("handleData", handleData);
    const recommendedProducts = handleData.recommended_products;
    console.log("recommendedProducts", recommendedProducts);
    const products = await getProductsByHandles(shop, token, recommendedProducts);
    res.status(200).json({products: products?.data?.products?.nodes});
  }

  catch (error) {
    console.log("error in recommended api", error);
    res.status(400).json(error);

  }
}
);



app.get("/api/products", async (_req, res) => {
  try {
    console.log("products api called");
    const shop = _req.query.shop;
    const session = await ShopifySession.findOne({ shop });
    const token = session?.accessToken;
    const orders = await getOrderedProducts(shop, token);
    res.status(200).json({ orders: orders?.data?.orders?.nodes });

  } catch (error) {
    console.log("error in products api", error);
    res.status(400).json(error);

  }
}
);



app.get("/api/trendify", async (_req, res) => {
  try {
    const shop = _req.query.shop;
    const recomendations = await Recommendations.find({ shop });
    console.log("recomendations", JSON.stringify(recomendations));
    const recommendation = recomendations.find(recomendation => recomendation.products?.some(product => product.id === _req.query.productId));
    if (recommendation?.type === "automatic") {
      res.status(200).json({ type: "automatic", products: [] });
    } else if (recommendation?.type === "manual") {
      res.status(200).json({ type: "manual", products: [] });
    } else if (recommendation?.type === "frequently_bought_together") {
      res.status(200).json({ type: "frequently_bought_together", products: [] });
    } else {
      res.status(400).json({ message: "Recommendation not found" });
    }
  } catch (error) {
    res.status(400).json(error);

  }
}
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
rootRouter(app);
app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});
app.get("/api/recommendations", async (_req, res) => {
  try {
    const { shop } = res.locals.shopify.session;
    const recommendations = await Recommendations.find({ shop });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get("/api/recommendation/:id", async (_req, res) => {
  try {
    const { id } = _req.params;
    const recommendation = await Recommendations.findById(id);
    res.status(200).json(recommendation);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.put("/api/recommendation/:id", async (_req, res) => {
  try {
    const { id } = _req.params;
    const recommendation = await Recommendations.findByIdAndUpdate(id
      , _req.body, { new: true });
    res.status(200).json(recommendation);
  } catch (error) {
    res.status(400).json(error);
  }
});
app.delete("/api/recommendation/:id", async (_req, res) => {
  try {
    const { id } = _req.params;
    await Recommendations.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json(error);
  }
}
);


app.post("/api/recommendation/create", async (_req, res) => {
  try {

    await createRecommendation(_req, res);
  } catch (e) {
    console.log(e.message)
    res.send({ success: false });
  }
});


app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
