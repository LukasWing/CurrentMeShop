import { Request, Response } from "express";
import { CustomerManager } from "./CustomerManager.js";
import { OrderLine, Size } from "./interfaces.js";
import { ShirtManager } from "./ShirtManager.js";
const DATA_FILE = "./Data.json";

/**
 * Refer to CustomerManager.removeShirt() for functionality
 * @param req 
 * @param res 
 */
export async function removeShirt(req: Request, res: Response) {
	try {
		let modelMan: CustomerManager = new CustomerManager(DATA_FILE);
		let customerId : number = Number(req.params.customerId);
		let itemId : number = Number(req.params.itemId);
		await modelMan.removeShirt(customerId, itemId);
		res.status(200).send({message: "Succesfully removed item"});
		res.end();
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}

/**
 * Refer to ShirtManager.getEveryCategory() for functionality
 * @param req 
 * @param res 
 */
export async function getCats(req: Request, res: Response) {
	try {
		let modelMan = new ShirtManager(DATA_FILE);
		let allCats: Object[] = await modelMan.getEveryCategory();
		res.status(200).send(allCats);
		res.end();
	} catch (error: any) {
		// res.statusMessage=
		res.status(400).send(error.message);
	}
}

/**
 * Refer to ShirtManager.getProductsByCategory() for functionality
 * @param req 
 * @param res 
 */
export async function getProdByCat(req: Request, res: Response) {
	try {
		let cat: string = req.params.category;
		let modelMan = new ShirtManager(DATA_FILE);
		let prods: Object[] = await modelMan.getProductsByCategory(cat);
		res.status(200).send(prods);
		res.end();
	} catch (error: any) {
		res.status(404).send(error.message);
	}
}

/**
 * Refer to ShirtManager.getProducts() for functionality
 * @param req 
 * @param res 
 */
export async function getProducts(req: Request, res: Response) {
	try {
		let modelMan = new ShirtManager(DATA_FILE);
		let prods: Object[] = await modelMan.getProducts();
		res.status(200).send(prods);
		res.end();
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}
export async function createCustomer(req: Request, res: Response) {
	try {
		let cusMan = new CustomerManager(DATA_FILE);
		let email = req.body.email;
		let firstname = req.body.firstname;
		let lastname = req.body.lastname;
		const customerId = await cusMan.lookUpEmail(email);
		console.log(customerId);
		if(customerId !== -1){
			throw Error("Customer already exists");
		};
		let id = await cusMan.createCustomer(email, firstname, lastname);
		res.status(201).send({customerId: id});
		res.end();
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}
/**
 * Set the item amount of an item in basket to whatever quantity the customer sends
 * @param req to server
 * @param res to client
 */
export async function updateItem(req: Request, res: Response) {
	try {
		let basMan = new CustomerManager(DATA_FILE);
		let customerId: number = Number(req.params.customerId);
		let itemId: number = Number(req.params.itemId);
		let amount: number = req.body.amount;
		let sz: number = Number(req.body.size);
		let size : Size = sz;
		await basMan.updateShirt(customerId, itemId, amount);
		res.status(201);
		res.end();
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}
export async function addItem(req: Request, res:Response){
	try {
		let basMan = new CustomerManager(DATA_FILE);
		let customerId: number = Number(req.params.customerId);
		let itemId: number = Number(req.params.itemId);
		let amount: number = req.body.amount;
		let sz: number = Number(req.body.size);
		let size : Size = sz;
		await basMan.updateShirt(customerId, itemId, amount);
		res.status(201);
		res.end();
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}

export async function addItemList(req: Request, res:Response){
	try {
		let basMan = new CustomerManager(DATA_FILE);
		let customerId: number = Number(req.params.customerId);
		let items: OrderLine[] = req.body.items;
		await basMan.fillBasket(customerId, items);
		res.status(201);
		res.end();
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}


export async function getCustomer(req: Request, res: Response){
	try{
		let cusMan = new CustomerManager(DATA_FILE);
		let customerId : number = Number(req.params.customerId);
		let basket: Object = await cusMan.getCustomer(customerId);
		res.status(200).send(basket);
	}
	catch(error: any){
		res.status(400).send(error.message)
	}
}

/**
 * 
 * Refer to ShirtManager.getByID() for functionality
 * @param req 
 * @param res 
 */
 export async function getSpecificProduct(req: Request, res: Response) {
	try{
		let modelMan = new ShirtManager(DATA_FILE);
		let productId : number = Number(req.params.productId);
		let product : Object = await modelMan.getByID(productId);
		res.status(200).send(product);
		res.end(); 
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}

export async function getCustomerId(req: Request, res: Response) {
	try {
		let cusMan = new CustomerManager(DATA_FILE);
		let email: string = req.body.email;
		let customerId: number = await cusMan.lookUpEmail(email);
		if(customerId == -1) throw Error("Unknown email");
		res.status(200).send({customerId: customerId});
		res.end();
	} catch (error: any) {
		res.status(400).send(error.message);
	}
}


