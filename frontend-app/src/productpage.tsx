import { useState, useEffect, FC } from 'react';
import { Button, FormControl, Modal, Row, Col, Container} from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import { Size } from '../src/common/interfaces';
import { Shirt } from './common/Shirt';
import { useParams } from 'react-router-dom';
import { getShirtById } from './cart';

interface ShirtData {
    itemName: string,
    price: number,
    incrementItem: (id:number)=>void,
    itemId:number,
    items:Shirt[]
}

interface IProductPage{
    shirts:Shirt[],
    incrementItem: (id:number)=>void
}

const ProductPage = (props:IProductPage) => {
    let {id} = useParams<{id: string}>();
    let itemId:number=Number.parseInt(id)
    let {categoryValue} = useParams<{ categoryValue: string }>();
    let shirts:Shirt[]=props.shirts;
    let shirt: Shirt = getShirtById(itemId, props.shirts);
    return (
    <Container fluid className="marginTop">
        <Row> 
            <Col>
                <ShirtImage imagePath={shirt.image}/>
            </Col>
            <Col>
                <ShirtSettings items={shirts} itemId={shirt.id} incrementItem={props.incrementItem} itemName={shirt.itemName} price={shirt.price}/>
            </Col>
        </Row>
    </Container>
    )
}

const ShirtImage = ({imagePath} : {imagePath: string}) => {
    return (
        <img className="productPageImage" src={imagePath}></img>
    )
}

const ShirtSettings: FC<ShirtData> = (props : ShirtData) => {
    function findIdBySize(shirts:Shirt[],currentShirtId:number,searchSize:string):number {
        let currentShirt=getShirtById(currentShirtId,shirts);
        let name:string = currentShirt.itemName;
        let image:string = currentShirt.image;
        let size:string = searchSize;
        for (let i = 0; i < shirts.length; i++) {
            if (shirts[i].itemName===name && shirts[i].image===image && shirts[i].size===size) {
                return shirts[i].id;
            }
        }
        return currentShirt.id; 
    }
    function findSize(sizeNumber:number):string {
        let sizeNum=sizeNumber;
        if (sizeNum==0) {
            return "S";
        }
        if (sizeNum==1) {
            return "M";
        } 
        else {
            return "L";
        }
        
    }
    let curShirt:Shirt= getShirtById(props.itemId, props.items);
    function getEnum(size:string):Size {
        if (size==="S") {
            return Size.S
        }
        if (size==="M") {
            return Size.M
        }
        else {
        return Size.L
        }
    }
    let initialSize:Size = getEnum(curShirt.size);
    const [size, setSize] = useState<Size>(initialSize);
    let sized:string=findSize(size.valueOf());
    let sizeId:number = findIdBySize(props.items, props.itemId, sized);



    return (
        <Container margin-top={5}>
            <Row>
                <h2>{props.itemName}</h2>
            </Row>
            <Row>
                <p>{props.price} $</p>
            </Row>
            <Row>
                <p>Material: 100% organic high quality cotton*</p>
            </Row>
            <Row>
                <p>Made in the USA**</p>
            </Row>
            <Row>
                <p>Eligible for free shipping</p>
            </Row>
            <Row>
                <Form.Group className="productForm">
                    <Form.Control as="select" defaultValue={size} onChange={(e) => setSize(+e.target.value)}> 
                        <option value={Size.S}>S</option>
                        <option value={Size.M}>M</option>
                        <option value={Size.L}>L</option>
                    </Form.Control>
                </Form.Group>
            </Row>
            <Row>
                <Button className="productButton" onClick={()=>{props.incrementItem(sizeId)}} variant="secondary">Add to Cart</Button> 
            </Row>
            <Row style={{paddingTop:'100px'}}>
                <p><small>*Not confirmed</small></p>
            </Row>
            <Row >
                <p><small>**Cotton from China, colored in India, produced in Vietnam and packaged in the great USA</small></p>
            </Row>
        </Container>
    )
}


export default ProductPage

