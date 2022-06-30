import React, { useState, useEffect } from "react";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import ProductPage from "./productpage";
import { Auth } from "./auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCameraRetro,
  faEnvelope,
  faGhost,
  faMapMarker,
  faMessage,
  faPhone,
  faShoppingCart,
  faSignOut,
  faUser,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Cart } from "./cart";
import { FrontPage } from "./frontpage";
import { Overview } from "./overview";
import { Customer } from "./common/Customer";
import { OrderLine } from "./common/interfaces";

const App = function () {
  const dummyCustomer: Customer = new Customer(
    Number.MAX_SAFE_INTEGER,
    "John",
    "Doe",
    "removedBasket@shouldbeblank.dk",
    []
  );

  const checkLoggedIn = () => {
    let logInBool: string | null = localStorage.getItem("loggedInStatus");
    let parsedBool: boolean =
      logInBool !== null ? JSON.parse(logInBool) : false;
    return parsedBool;
  };
  const createCus = (cus: Customer) =>
    new Customer(
      customer.customerId,
      customer.email,
      customer.firstname,
      customer.lastname,
      customer.basket
    );

  const [loggedIn, setLoggedIn] = useState(checkLoggedIn);
  const [userId, setUserId] = useState(Number.MAX_SAFE_INTEGER);
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState<Customer>(dummyCustomer);
  const [firstname, setFirstname] = useState(dummyCustomer.firstname);

  useEffect(() => {
    let customer: string | null = localStorage.getItem("customer");
    let customerInfo: Customer =
      customer !== null ? JSON.parse(customer) : dummyCustomer;
    let mappedCustomer: Customer = new Customer(
      customerInfo.customerId,
      customerInfo.email,
      customerInfo.firstname,
      customerInfo.lastname,
      customerInfo.basket
    );
    setCustomer(mappedCustomer);
    fetchItems(); // Fetch the items
    // fetchBasket(mappedCustomer.customerId);
  }, []);

  useEffect(() => {
    console.log("App cus");
    console.log(customer);
    localStorage.setItem("customer", JSON.stringify(customer));
    repopulateBasket();
    setFirstname(customer.firstname);
  }, [customer]);

  useEffect(() => {
    localStorage.setItem("loggedInStatus", JSON.stringify(loggedIn));
  }, [loggedIn]);

  useEffect(() => {
    fetchCustomer(userId);
  }, [userId]);

  const incrementItem = (itemId: number) => {
    let index = customer.findItem(itemId);
    if (index === -1) {
      customer.basket.push({ itemId: itemId, amount: 1 });
    } else {
      customer.basket[index].amount++;
    }
    setCustomer(createCus(customer));
  };
  let clearBasket = () => {
    customer.basket = [];
    setCustomer(createCus(customer));
  };
  let deleteItem = (id: number) => {
    let index = customer.findItem(id);
    if (index === -1) {
      console.log("Item doesn't exist?");
    } else {
      customer.basket.splice(index, 1);
    }
    console.log("Customer from del");
    console.log(customer);

    setCustomer(createCus(customer));
  };

  /**
   * Function that overwrites the customer basket in the WebApi with the customer.basket state
   */
  const repopulateBasket = async () => {
    let basket: OrderLine[] = customer.basket;
    let basketObject = { items: basket };
    try {
      let response = await fetch(
        `http://localhost:3000/customers/${userId}/basket`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify(basketObject),
        }
      );
      let res: Promise<[]> = await response.json();
    } catch (error: any) {
      // ignore
    }
  };

  const fetchItems = async () => {
    try {
      let response = await fetch("http://localhost:3000/products/", {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      let res: Promise<[]> = await response.json();
      let itemsRes = await res;
      setItems(itemsRes);
    } catch (error: any) {
      console.log("Error occcured in trying to make fetch");
      console.log(error.message);
    }
  };

  const fetchCustomer = async (userId: number) => {
    try {
      let response = await fetch(`http://localhost:3000/customers/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      let res: Promise<Customer> = await response.json();
      // console.log(await res);
      let customerInfo1: Customer = await res;
      let newCustomer = new Customer(
        customerInfo1.customerId,
        customerInfo1.email,
        customerInfo1.firstname,
        customerInfo1.lastname,
        customerInfo1.basket
      );

      setCustomer(newCustomer);
      setLoggedIn(true);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  function getAmount(orders: OrderLine[]): number {
    let amount: number = 0;
    orders.forEach((line) => {
      amount += line.amount;
    });
    return amount;
  }

  let basketAmount: number = getAmount(customer.basket);

  return (
    <BrowserRouter>
      <NavBar
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        firstname={customer.firstname}
        basketSize={basketAmount}
      />
      <Route path="/auth">
        <Auth setLoggedIn={setLoggedIn} setUserId={setUserId} />
      </Route>
      <Switch>
        <Route path="/cart">
          <Cart
            clearBasket={clearBasket}
            deleteItem={deleteItem}
            customer={customer}
            items={items}
          />
        </Route>
        <Route path="/productpage/:id">
          <ProductPage shirts={items} incrementItem={incrementItem} />
        </Route>
        <Route path="/overview/:categoryValue">
          <Overview items={items} incrementItem={incrementItem} />
        </Route>
        <Route path="/">
          <FrontPage />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

interface INav {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  firstname: String;
  basketSize: number;
}

/**
 * The collapsable navbar on top
 */
const NavBar = function ({
  loggedIn,
  setLoggedIn,
  firstname,
  basketSize,
}: INav) {
  const history = useHistory();

  const logOut = () => {
    setLoggedIn(false);
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };

  return (
    <Navbar bg="dark" variant="dark" sticky="top" expand="md">
      <Container>
        <OurBrand />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Container>
            <Nav className="me-auto">
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/overview/true"
              >
                Top Deals
              </NavLink>
              <OverviewLink currency={"bitcoin"} />
              <OverviewLink currency={"bitconnect"} />
              <OverviewLink currency={"ethereum"} />
              <OverviewLink currency={"shiba"} />
              <OverviewLink currency={"ripple"} />
              <OverviewLink currency={"dogecoin"} />
              {/* Spacings */}
              <div className="d-none d-lg-inline pl-5 pr-5"></div>
              <div className="d-none d-lg-inline pl-5 pr-5"></div>
              <div className="d-none d-lg-inline pl-5 pr-5"></div>
              <div className="pl-5 pr-4"></div>
              <NavLink className="nav-link" to="/cart">
                    <FontAwesomeIcon icon={faShoppingCart} /> {basketSize}
              </NavLink>
              <NavLink className="nav-link" to="/auth">
                {!loggedIn ? (
                  <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                ) : (
                  <div>
                    <FontAwesomeIcon
                      onClick={logOut}
                      icon={faSignOut}
                    ></FontAwesomeIcon>
                    {firstname}
                  </div>
                )}
              </NavLink>
            </Nav>
          </Container>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
/** Our clickable logo component*/
const OurBrand = function () {
  return (
    <NavLink to="/">
      <Navbar.Brand>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="white"
          className="bi bi-exclude"
          viewBox="0 0 20 20"
        >
          <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm12 2H5a1 1 0 0 0-1 1v7h7a1 1 0 0 0 1-1V4z" />
        </svg>
      </Navbar.Brand>
    </NavLink>
  );
};

const OverviewLink = ({ currency }: { currency: string }) => {
  let uppercased = currency[0].toUpperCase() + currency.slice(1);
  return (
    <NavLink
      className="nav-link"
      activeClassName="active"
      to={`/overview/${currency}`}
    >
      {uppercased}
    </NavLink>
  );
};
const Footer = function () {
  interface ITextIcon {
    id: number;
    text: String;
    icon: IconDefinition;
  }
  let leftPairs: ITextIcon[] = [
    { id: 1, text: "+45 12 34 56 78", icon: faPhone },
    { id: 2, text: "info@currentMe.com", icon: faEnvelope },
    { id: 3, text: "2300 KBH S", icon: faMapMarker },
  ];
  let rightPairs: ITextIcon[] = [
    { id: 1, text: "CurrentMe Facebook", icon: faMessage },
    { id: 2, text: "CurrentMe Instagram", icon: faCameraRetro },
    { id: 3, text: "CurrentMe SnapChat", icon: faGhost },
  ];
  return (
    <Container fluid={true} className="bg-dark text-white-50  p-3">
      <Row>
        <Col xs={12} md={6} className="pb-3">
          <Row>
            <h3 className="col-12 text-center">Contact info</h3>
            {leftPairs.map(pair => (
              <FooterPair key={pair.id} text={pair.text} icon={pair.icon} />
            ))}
          </Row>
        </Col>
        <Col xs={12} md={6} className="pb-3">
          <Row>
            <h3 className="col-12 text-center">Social media</h3>
            {rightPairs.map(pair => (
              <FooterPair key={pair.id} text={pair.text} icon={pair.icon} />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
const FooterPair = function ({
  text,
  icon,
}: {
  text: String;
  icon: IconDefinition;
}) {
  return (
    <>
      <Col xs={8}>{text}</Col>
      <Col xs={1} className="offset-3">
        <FontAwesomeIcon icon={icon} />
      </Col>
    </>
  );
};
export default App;
