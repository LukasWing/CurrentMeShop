import * as fs from "fs/promises";
import {Shirt} from "./Shirt.js";

/**
 * Class for managing information related to shirts
 */
export class ShirtManager {
	filePath: string;

	/**
	 * Constructs the ShirtManager, saving the filepath for the JSON file with shirt information
	 * @param filePath The filepath of the JSON file with the shirt information
	 */
	constructor(filePath: string) {
		this.filePath = filePath;
	}

	/**
	 * Takes an array of shirt objects and saves information as a JSON string
	 * @param items An array of shirt Objects
	 */
	async save(items: Shirt[] = []) {
		let dataRaw: string = await fs.readFile(this.filePath, "utf8");
		let data: { shirts: any[] } = JSON.parse(dataRaw);
		data.shirts = items;
		let itemsTxt: string = JSON.stringify(data);
		await fs.writeFile(this.filePath, itemsTxt);
	}

	/**
	 * Iterates through an array to find a specific shirt item
	 * @param itemArray The array of Shirt objects to be iterated through
	 * @param Id The ID to find shirt match
	 * @returns Element in array where shirt ID matches parameter ID
	 */
	findItem(itemArray: Shirt[], Id: number): number {
		return itemArray.findIndex((currItem) => currItem.id === Id);
	}

	/**
	 * Finds a specific item by its ID from shirts.json
	 * @param itemId Identifier used to iterate through the array
	 * @returns The selected item based on itemID
	 */
	async getByID(itemId: number) {
		let itemArray = await this.readAllShirts();
		let index = this.findItem(itemArray, itemId);
		if (index === -1)
			throw new Error(`Item with ID:${itemId} doesn't exist`);
		else return itemArray[index];
	}

	/**
	 * Reads the current shirts Path and creates an array of the values of all categories
	 * @returns A category array or throws error that shirt data is missing
	 */
	async getEveryCategory(): Promise<string[]> {
		let shirtArray: Shirt[] = await this.readAllShirts();
		let subCats: Set<string> = new Set<string>();
		shirtArray.forEach(shirt => {
			subCats.add(shirt.color);
			if (shirt.topDeal) subCats.add("true");
			subCats.add(shirt.currency);
		});
		return Array.from(subCats);
	}

	/**
	 * Takes a category as a parameter and returns a list sorted by category
	 * @param category A string input
	 * @returns A list of filtered Shirts
	 */
	async getProductsByCategory(category: string): Promise<Object[]> {
		let matches: Object[] = (await this.readAllShirts())
			.filter(shirt => this.catFitsShirt(category, shirt))
			.map(shirt => shirt.mostImp());
		if (matches.length === 0) {
			throw new Error("No such category exist")
		}
		return matches
	}

	/**
	 * @returns Array of all shirts in json data file
	 */
	private async readAllShirts(): Promise<Shirt[]> {
		try {
			let dataTxt = await fs.readFile(this.filePath, "utf8");
			let data: { shirts: Shirt[] } = JSON.parse(dataTxt);
			let objArray: Shirt[] = data.shirts;
			if (objArray === null) throw Error("No shirts");
			let shirts: Shirt[] = objArray.map(s =>
				new Shirt(s.itemName, s.color, s.size, s.currency, s.image, s.price, s.id, s.topDeal)
			);
			return shirts;
		} catch (error) {
			throw new Error(
				"ShirtArray has no values or no file is present:" +
				"Check if values are in shirts.json" + error
			);
		}
	}

	/**
	 * Matches a shirt by category
	 * @param category The specified field being matched
	 * @param shirt Shirt with field being compared
	 * @returns The matches of categories based on search criteria
	 */
	private catFitsShirt(category: string, shirt: Shirt): boolean {
		let istopdeal: boolean = ((category === "true") && shirt.topDeal);
		let matches = istopdeal
			|| shirt.color === category
			|| shirt.currency === category
		return matches;
	}

	/**
	 * Gets all products based on the mostImportant category (Found in Shirt.ts)
	 * @returns Shirts based on the most important category
	 */
	async getProducts(): Promise<Object[]> {
		return (await this.readAllShirts()).map(s => s.mostImp());
	}

}

