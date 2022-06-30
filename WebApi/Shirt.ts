export class Shirt {
    id: number;
    itemName: string;
    color: string;
    size: string;
    currency: string;
    image: string;
    price: number;
    topDeal: boolean;
    constructor(itemName: string, color: string, size: string, currency: string, image: string, price: number, id: number, topDeal: boolean) {
        this.id = id;
        this.itemName = itemName;
        this.color = color;
        this.size = size;
        this.currency = currency;
        this.image = image;
        this.price = price;
        this.topDeal = topDeal;
    }
    
    /**
     * Function to find the categories used for sorting
     * @returns the Object of most important fields found from a shirt
     */
    mostImp(): Object {
        return {
            id: this.id,
            itemName: this.itemName,
            size: this.size,
            image: this.image,
            currency: this.currency,
            color: this.color,
            price: this.price,
            topDeal: this.topDeal
        };
    }
}