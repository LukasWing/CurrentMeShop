import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import { OrderLine } from "./common/interfaces";
import { Shirt } from "./common/Shirt";
import { useHistory } from "react-router-dom";
import { Modal, ModalBody, Col, Row, Button } from "react-bootstrap";
import { Customer } from "./common/Customer";

interface ICart {
  customer: Customer,
  deleteItem: (id:number)=>void,
  items: Shirt[];
};
interface ICartItem{
  amount: number,
  shirt: Shirt,
  deleteItem: (id:number)=>void
}

interface ICheckout {
  customer: Customer;
  items: Shirt[];
  clearBasket: () => void;
}

export function getShirtById(id: number, items: Shirt[]): Shirt {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id == id) {
      return items[i];
    }
  }
  return new Shirt("", "", "", "", "", 999, 999999, false);
}
export const Cart = (props: ICart & {clearBasket: () => void}) => {
  return (
    <Container>
      <Row>
        <CartList
          customer={props.customer}
          items={props.items}
          deleteItem={props.deleteItem}
        />
        <CartCheckout
          customer={props.customer}
          items={props.items}
          clearBasket={props.clearBasket}
        />
      </Row>
    </Container>
  );
};

const CartItem = (cartItemProps: ICartItem) => {
  let shirt:Shirt = cartItemProps.shirt;
  let amount:number = cartItemProps.amount;
  const navigator = useHistory();
  const removeItem = (): void => {
    cartItemProps.deleteItem(shirt.id);
  };

  const handleImageClick = () => {
		navigator.push(`/productpage/${shirt.id}`);
	}
  
  return (
    <div>
      <Row>
      <Col xs={4}>
          <img src={shirt.image} onClick={handleImageClick} className="img-fluid" />
      </Col>
      <Col xs={6}>
        <h6>{shirt.itemName}</h6>
        <h6>Size: {shirt.size}</h6>
        <h6>Amount: {amount}</h6>
          <Button type="danger" className="btn btn-danger" onClick={removeItem}>
            Remove Item
          </Button>
        </Col>
        <Col xs={2}>
          <h6 className="itemPrice"> ${shirt.price * amount} </h6>
        </Col>
      </Row>
      <hr></hr>
    </div>
  );
};

const CartList = (props:ICart) => {
  let items: Shirt[] = props.items;
  let deleteItem: (id:number)=>void = props.deleteItem;
  const [orderlines, setOrderlines] = useState<OrderLine[]>(props.customer.basket);
  useEffect(()=> {
    setOrderlines(props.customer.basket);
  },[props])

  function allItems(order: any): number {
    let itemsum = 0;
    for (let i = 0; i < order.length; i++) {
      itemsum += order[i].amount;
    }
    return itemsum;
  }
  let totalItems: number = allItems(orderlines);
  return (
    <Col xs={12} md={8}>
      <Row>
        <Col xs={8} sm={9}>
          <h1>Shopping Cart</h1>
        </Col>
        <Col xs={4} sm={3}>
          <h6 id="totalItems" style={{ paddingTop: "20px" }}>
            Total items: {totalItems}
          </h6>
        </Col>
      </Row>
      <hr></hr>
      {orderlines.map(order => {
        let amount: number = order.amount;
        let shirt: Shirt = getShirtById(order.itemId, items);
        return <CartItem 
          key={order.itemId} 
          shirt={shirt} 
          amount={amount} 
          deleteItem={deleteItem} 
        />;
      })}
    </Col>
  );
};

const CartCheckout = (props:ICheckout) => {
  const [popShow, setPopShow] = useState(false);
  let items:Shirt[] = props.items;
  const [basket, setBasket] = useState<OrderLine[]>(props.customer.basket);
  useEffect(()=>{
    setBasket(props.customer.basket)
  },[props])

  const checkOut = () => {
    console.log("co called");
    props.clearBasket();
    setPopShow(true);
  }

  const calcTotal = () => {
    let totalprice: number = 0;
    for (let i = 0; i < basket.length; i++) {
      let item: Shirt = getShirtById(basket[i].itemId,items);
      let price: number = item.price;
      let amount: number = basket[i].amount;
      totalprice += price * amount;
    }
    return totalprice;
  }

  let totalPrice: number = calcTotal();

  return (

    <>
    <Modal
				size="sm"
				show={popShow}
				onHide={() => setPopShow(false)}
				aria-labelledby="example-modal-sizes-title-sm"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">
						Checkout
					</Modal.Title>
				</Modal.Header>
				<ModalBody>
					Thanks for shopping {props.customer.firstname}, you will be redirected to payment options. If nothing happens, it might be because this function is not implemented yet
				</ModalBody>
			</Modal>

    <Col xs={12} md={4} style={{ marginTop: "32px" }}>
      <p>Order summary:</p>
      <hr style={{ margin: 0 }} />
      <Row>
        <Col xs={7} sm={5} style={{ textAlign: "left" }}>
          Item total price:
        </Col>
        <Col xs={5} sm={7} style={{ textAlign: "right" }}>
          <p>${totalPrice}</p>
        </Col>
      </Row>
      <Row>
        <Col xs={5} sm={7} style={{ textAlign: "left" }}>
          Delivery:
        </Col>
        <Col xs={5} sm={5} style={{ textAlign: "right" }}>
          <p>$10</p>
        </Col>
      </Row>
      <Row>
        <Col xs={7} sm={7} style={{ textAlign: "left" }}>
          Taxes:
        </Col>
        <Col xs={5} sm={5} style={{ textAlign: "right" }}>
          <p>$10</p>
        </Col>
      </Row>
      <hr style={{ margin: 0 }} />
      <Row>
        <Col xs={7} sm={7}>Total:</Col>
        <Col xs={5} sm={5} style={{ textAlign: "right" }}>${totalPrice + 10 + 10}</Col>
      </Row>
      <br />
      <Button variant={"primary"} onClick={()=>checkOut()} >
        Proceed to checkout
      </Button>
      <p style={{marginBottom:"200px"}}></p>
    </Col>
    </>
  );
};
