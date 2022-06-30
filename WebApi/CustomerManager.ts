import * as fs from "fs/promises";
import {Customer} from "./Customer.js";
import {OrderLine, Size} from "./interfaces.js";

interface ICustomer {
  email: String,
  customerId: number,
  firstname: String,
  lastname: String,
  basket: OrderLine[];
}
/**
 * Class for managing information related to customers.
 */
export class CustomerManager {
  filePath: string;
  
  /**
   * Constructs the CustomerManager, saving the filepath for the JSON file with customer information.
   * @param filePath The filepath of the JSON file with the customer information.
   */
  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Look up customer ID via unique email.
   * @param email Email of customer.
   * @returns CustomerId or -1.
   */
  async lookUpEmail(email: String) : Promise<number> {
    let customers = await this.getAll();
    let index: number = customers.findIndex(c => (c.email === email));
    return index === -1 ? -1 : customers[index].customerId;
  }

  /**
   * Method for getting all customer profiles.
   * @returns Array of customer profiles on success. Else an empty array.
   */
  async getAll(): Promise<Customer[]> {
    try {
      let dataText: string = await fs.readFile(this.filePath, "utf8");
      let data: { customers: ICustomer[] } = JSON.parse(dataText);
      let customers: Customer[] = data.customers.map(
          c => new Customer(c.customerId, c.email, c.firstname, c.lastname, c.basket)
      );
      return customers;
    } catch (err: any) {
      if (err.code === "ENOENT") {
        // file does not exits
        await this.save([]); // create a new file with empty array
        return []; // return empty array
      } // cannot handle this exception, so rethrow
      else {
        console.log(err);
        throw err;
      }
    }
  }

  /**
   * Takes customers and saves information as a JSON string.
   * @param items An array of Customer objects.
   */
  async save(items: Customer[] = []) {
    let dataRaw: string = await fs.readFile(this.filePath, "utf8");
    let data: {customers: any[]} = JSON.parse(dataRaw);
    data.customers = items;
    let itemsTxt: string = JSON.stringify(data);
    console.log(itemsTxt)
    await fs.writeFile(this.filePath, itemsTxt);
  }

  /**
   * Iterates through the array of Customers until match is found with the ID.
   * @param customers Array of Customer objects.
   * @param id Customer ID.
   * @returns Index of identified customer in Customer data array.
   */
  findCustomer(customers: Customer[], id: number): number {
    return customers.findIndex((currCustomer) => currCustomer.customerId === id);
  }

  /**
   * Create new customer profile and return customer id.
   * @param email Email of customer.
   * @param firstname First name of customer.
   * @param lastname Family name of customer.
   */
  async createCustomer(email?: String, firstname ?: String, lastname ?: String) {
    email = (email === undefined) ? "anonymous" : email;
    firstname = (firstname === undefined) ? "anonymous" : firstname;
    lastname = (lastname === undefined) ? "anonymous" : lastname;
    let customers: Customer[] = await this.getAll();
    let availableIndex: number = -1;
    if (customers.length !== 0) {
      customers.sort((a, b) => (a.customerId - b.customerId));
      let availableIndex = customers.length;
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].customerId != i) {
          availableIndex = i;
          break;
        }
      }
      let newCustomer: Customer = new Customer(availableIndex, email, firstname, lastname);
      customers.push(newCustomer);
      console.log(customers);
      console.log(availableIndex);
      await this.save(customers);
      return availableIndex;
    } else {
      availableIndex = 0;
      customers = [new Customer(availableIndex, email, firstname, lastname)];
      await this.save(customers);
      return availableIndex;
    }
    // console.log(availableIndex);
    // await this.save(customers);
    // return availableIndex;
  }

  /**
   * Updates current basket with new item or updates existing items quantity.
   * @param customerId Customer ID for targeting correct tuple in source data.
   * @param itemId Item ID to identify item position in Basket.
   * @param size
   * @param amount Number of items associated with item ID.
   * @param increment
   */
  async updateShirt(customerId: number, itemId: number, amount: number, increment ?: boolean) {
    increment = (increment === undefined) ? false : true;
    let itemArray: Customer[] = await this.getAll();
    let index: number = this.findCustomer(itemArray, customerId);
    let currBasket = itemArray[index].basket;
    if(increment) {
      let itemIndex: number = currBasket.findIndex(
        currItem => currItem.itemId === itemId 
      );
      let currentAmount = currBasket[itemIndex].amount;
      amount += currentAmount;
    }
    if (index === -1) {
      throw Error("This should never happen :)");
    } else {
      this.updateShirtInBasket(itemArray[index], itemId, amount);
    }
    await this.save(itemArray);
  }

  /**
   * Checks if shirt is in Basket then updates otherwise pushes item to basket with amount.
   * @param foundCustomer Customer info including info on basket content.
   * @param itemId Item ID used to identify shirt to be searched for.
   * @param amount Amount to be set.
   */
  updateShirtInBasket(foundCustomer: Customer, itemId: number, amount: number) {
    let itemIndexInBasket: number = foundCustomer.basket.findIndex(
      currItem => currItem.itemId === itemId 
    );
    if (itemIndexInBasket === -1) {
      foundCustomer.basket.push({ itemId: itemId, amount: amount });
    } else {
      foundCustomer.basket[itemIndexInBasket].amount = amount;
    }
  }

  /**
   * Removes a specific item from a specific customer's Basket.
   * Throws an error if the customer doesn't have a basket or if
   * the item does not exist in the basket.
   * @param customerId The identifier of the customer.
   * @param itemId The identifier of the item.
   */
  async removeShirt(customerId: number, itemId: number) {
    let itemArray: Customer[] = await this.getAll();
    let index: number = this.findCustomer(itemArray, customerId);
    if (index !== -1) {
      let itemIndexInBasket: number = itemArray[index].basket.findIndex(
        (currBasket) => currBasket.itemId === itemId)
      if (itemIndexInBasket !== -1) {
        itemArray[index].basket.splice(itemIndexInBasket, 1);
        await this.save(itemArray);
      }
      else throw new Error(`Item with id: ${itemId} does not exist in basket`)
    }
    else throw new Error(`Customer with id ${customerId} does not exist`)
    
  }

  /**  
   * Adds a list of items to a specific customers basket
   * Throws an error if the customer does not exist
   * @param customerId - the identifier of the customer
   * @param items - the list of items we want to add
   */
  async fillBasket(customerId: number, items: OrderLine[]) {
    let itemArray: Customer[] = await this.getAll();
    let index: number = this.findCustomer(itemArray, customerId);
    if (index !== -1) {
      itemArray[index].basket = []
      itemArray[index].basket = items
      await this.save(itemArray)
    }
    else throw new Error(`Customer with id ${customerId} does not exist`)
  }

  /**
   * Method for getting a customer's information based on customer ID.
   * @param customerId Customer ID
   * @returns The customer's information
   */
  async getCustomer(customerId: number) {
    let basketArray: Customer[] = await this.getAll();
    let index: number = this.findCustomer(basketArray, customerId);
    if (index === -1) {
      throw new Error(`Customer with ID: ${customerId} does not have a basket`);
    } else return basketArray[index];
  }
}
