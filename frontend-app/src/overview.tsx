import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Card, Col, Container, Dropdown, DropdownButton, Modal, Row} from "react-bootstrap";
import {Shirt} from "./common/Shirt";
import {useHistory, useParams} from "react-router-dom";
import CSS from "csstype";

export interface ICat {
	color: string[];
	size: string[];
	currency: string[];
	topDeal: string[];
}

interface IOverview {
	items: Shirt[];
	incrementItem: (itemID: number) => void;
}

interface IFilterButton {
	categoryName: string;
	category: string;
	categoryValues: string[];
	setItemsOverviewState: (catVal: string) => void;
}

// Functional component
export const Overview = ({items, incrementItem}: IOverview) => {
	// Filtered items state
	const [filteredItems, setFilteredItems] = useState<Shirt[]>(items);

	// Filter values
	let {categoryValue} = useParams<{ categoryValue: string }>();

	useEffect(() => {
		console.log("categoryValue: " + categoryValue);
		handleUpdateFilter(categoryValue)
	}, [categoryValue]);

	// Handler for updating the filter object's relevant property
	const handleUpdateFilter = (filterValueInput: string) => {
		setFilteredItems(items);
		if (filterValueInput !== "") {
			setFilteredItems(items.filter((shirt: Shirt) => {
				for (const value of Object.values(shirt)) {
					if (value.toString().toLowerCase() === filterValueInput.toString().toLowerCase()) {
						return true;
					}
				}
			}));
		} else {
			setFilterValues([]);
		}
	};

	const [filterValues, setFilterValues] = useState<string[]>([]);

	const handleFilterButtonUpdate = (input: string) => {
		setFilterValues(prevState => {
			let tmp: string[] = prevState;
			tmp.push(input);
			return tmp;
		});
		for (let i = 0; i < filterValues.length; i++) {
			setFilteredItems(filteredItems.filter((shirt: Shirt) => {
				for (const value of Object.values(shirt)) {
					if (value.toString().toLowerCase() === filterValues[i].toString().toLowerCase()) {
						return true;
					}
				}
			}))
		}
	};

	const categoryData: ICat = { // TODO Hardcoded => Dynamic or get from backend
		color: ["Black", "Blue", "White"],
		size: ["S", "M", "L"],
		currency: ["Bitcoin", "Bitconnect", "Ethereum", "Ripple", "Sandcoin", "Shiba", "Solana", "Terra Luna"],
		topDeal: ["true", "false"]
	};

	return (
		<Container>
			<br/>
			<Row>
				{/* Filter button group */}
				<Container>
					{/* Reset filter */}
					<Button onClick={() => handleUpdateFilter("")}>All</Button>
					{/* Filterbuttons */}
					<FilterButton categoryName={"Color"} category={"color"} categoryValues={categoryData.color}
								  setItemsOverviewState={handleFilterButtonUpdate}></FilterButton>
					<FilterButton categoryName={"Size"} category={"size"} categoryValues={categoryData.size}
								  setItemsOverviewState={handleFilterButtonUpdate}></FilterButton>
					<FilterButton categoryName={"Currency"} category={"currency"}
								  categoryValues={categoryData.currency}
								  setItemsOverviewState={handleFilterButtonUpdate}></FilterButton>
					<FilterButton categoryName={"Top deal"} category={"topDeal"}
								  categoryValues={categoryData.topDeal}
								  setItemsOverviewState={handleFilterButtonUpdate}></FilterButton>
				</Container>
			</Row>
			<br/>
			<Row>
				{filteredItems.map((shirt: Shirt) => (
					<Col xs={12} md={4}>
						<ItemCard shirt={shirt} incrementItem={incrementItem}></ItemCard>
					</Col>
				))}
			</Row>
		</Container>
	);
};

const styleCard: CSS.Properties = {
	marginBottom: "1em",
};

const styleImage: CSS.Properties = {
	objectFit: "scale-down",
};

interface IItemCard {
	shirt: Shirt;
	incrementItem: (itemID: number) => void;
}

const ItemCard = ({shirt, incrementItem}: IItemCard) => {

	const navigator = useHistory();

	const handleImageClick = () => {
		navigator.push(`/productpage/${shirt.id}`);
	}

	const [smShow, setSmShow] = useState(false);

	const handleAddToBasket = () => {
		incrementItem(shirt.id);
		setSmShow(true);
	}

	return (
		<>
			<Modal
				size="sm"
				show={smShow}
				onHide={() => setSmShow(false)}
				aria-labelledby="example-modal-sizes-title-sm"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">
						Added to basket
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{shirt.itemName}
				</Modal.Body>
			</Modal>

			<Card className="" style={styleCard}>
				<Card.Img style={styleImage} variant="top" src={shirt.image} onClick={handleImageClick}/>
				<Card.Body>
					<Container>
						<Row>
							<Col xs={5}>{shirt.itemName}</Col>
							<Col xs={2}>{shirt.size}</Col>
							<Col xs={5} className={"text-right"}>${shirt.price}</Col>
						</Row>
					</Container>
				</Card.Body>
				<Button onClick={handleAddToBasket}>
					Add
				</Button>
			</Card>
		</>
	);
};

const FilterButton = ({categoryName, category, categoryValues, setItemsOverviewState}: IFilterButton) => {

	const handleClick = (element: string) => {
		setItemsOverviewState(element);
	}
	return (
		<DropdownButton
			as={ButtonGroup}
			key={category}
			id={`dropdown-variants-${category}`}
			variant={category.toLowerCase()}
			title={categoryName}
		>
			{categoryValues.sort().map(element => (
				<Dropdown.Item key={element.toString()}
							   onClick={() => handleClick(element)}>{element.toString()}</Dropdown.Item>
			))}
		</DropdownButton>);
};