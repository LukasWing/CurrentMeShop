import express from "express";
import { getCats, getProdByCat, getProducts, getSpecificProduct, createCustomer, updateItem, removeShirt, getCustomerId, addItem, addItemList, getCustomer} from "./controller.js";

export const webshopRouter = express.Router();

// middleware specific to this route
webshopRouter.use(express.json());
webshopRouter.get("/categories", getCats);
webshopRouter.get("/products/category/:category", getProdByCat);
webshopRouter.get("/products", getProducts)
webshopRouter.get("/products/:productId", getSpecificProduct)
webshopRouter.post("/customers", createCustomer);
webshopRouter.post("/customers/id", getCustomerId);
webshopRouter.get("/customers/:customerId",getCustomer);
webshopRouter.post("/customers/:customerId/basket/:itemId", updateItem);
webshopRouter.put("/customers/:customerId/basket/:itemId", addItem);
webshopRouter.delete("/customers/:customerId/basket/:itemId", removeShirt);
webshopRouter.put("/customers/:customerId/basket/", addItemList);
    
