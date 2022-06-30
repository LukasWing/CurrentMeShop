import { faP } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Image from 'react-bootstrap/Image';
import cryptowoman from '../img/FP1.1.CryptoWoman.png';
import cryptoman from '../img/FP1.2.CryptoMan.png';

import { useHistory } from "react-router-dom";

export const FrontPage = () => {
    const navigation = useHistory(); 
    const handleImageClick = (category:string) => {
        navigation.push(`/overview/${category}`)
    }
    return (
        <>
            <Container className="pb-5" style={{ paddingTop: '50px' }}>
                <Row>
                    <Col className="d-md-block d-sm-none" xs={0} md={4} >
                        <div className="orange_Side">
                            <Image className="HP1_L" src="/images/frontpage/FP1.1.CryptoWoman.png" alt="CryptoWoman" />
                        </div>
                    </Col>
                    <Col xs={12} md={4} className="pr-2 pl-2">

                        <div className="centerthem">
                            <h1 className="titleOne">CurrentMe</h1>
                            <div className="underLineOne"></div>
                        </div>
                        <div className="site_description">
                            <p><span className="golden_boi">NFT</span> Brand Clothing</p>
                            <p>The Latest <span className="golden_boi">Trends</span></p>
                            <p>The Best <span className="golden_boi">Crypto</span> Fashion</p>
                        </div>
                        <Row className="justify-content-center">
                            <Button variant={"primary"} onClick={() => handleImageClick("true")} className="btn btn-primary">Top Deals</Button>
                        </Row>
                    </Col>
                    <Col className="d-md-block d-sm-none" xs={0} md={4}>
                        <div className="grey_Side">
                            <Image className="HP1_R" src="/images/frontpage/FP1.2.CryptoMan.png" alt="CryptoMan" />
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container className="pt-5">
                <Row>
                    <Col className="d-none d-sm-block" xs={12} md={6}>
        
                        <h1 className="titleTwo">Pay with Crypto</h1>
                        <div className="underLineTwo"></div>
                        <div className="pt-5">
                            <p className="Home_Two_line1">Never feel <span className="golden_boi">restricted</span> by</p>
                            <p className="Home_Two_line2">the <span className="golden_boi">crypto</span> you’ve made</p>
                            <p className="Home_Two_line3">All crypto is <span className="golden_boi">accepted</span> here</p>
                        </div>
                    </Col>
                    <Col xs={0} md={6}>
                        <Image width={"100%"} src="/images/frontpage/FP2.0.CoinPic.png" alt="coinbase" />
                    </Col>
                </Row>
            </Container>
        
            <Container style={{ paddingTop: '100px', marginBottom: '40px' }}>
                <div className="fourth_text_banner">
                    <div className="titleFour_Container">
                        <h1 className="titleFour">Top Brands</h1>
                        <div className="underLineFour"></div>
                    </div>
                </div>
                </Container>
                <Container>
                    <Row>
                    <Col xs={12} md={4}><Image onClick={() => handleImageClick("Shiba")}  className="expand" width={"100%"} src="/images/frontpage/FP4.1.Doge.png" alt="Doge Man" /></Col>
                    <Col xs={12} md={4}><Image onClick={() => handleImageClick("Ripple")} className="expand" width={"100%"} src="/images/frontpage/FP4.2.Ripple.png" alt="Ripple Advert" /></Col>
                    <Col xs={12} md={4}><Image onClick={() => handleImageClick("Ethereum")} className="expand" width={"100%"} src="/images/frontpage/FP4.3.Ethe.png" alt="Etheruem Ad" /></Col>
                    </ Row>
                    <Row><Col className="p-3 d-none d-md-block"></Col></Row>
                    <Row>
                    {/* Add Hyperlink to Stonk Guy */}
                    <Col xs={12} md={4}><a href="https://coinmarketcap.com/"><Image className="expand" width={"100%"} src="/images/frontpage/FP4.4.Stonks.png" alt="Stonks Man" /></a></Col>
                    <Col xs={12} md={4}><Image onClick={() => handleImageClick("Bitcoin")} className="expand" width={"100%"} src="/images/frontpage/FP4.5.BitCoin.png" alt="BitCoin Page" /></Col>
                    <Col xs={12} md={4}><Image onClick={() => handleImageClick("Solana")} className="expand" width={"100%"} src="/images/frontpage/FP4.6.Solana.png" alt="Solana Page" /></Col>
                    </ Row>
                <Row><Col className="p-5"></Col></Row>  
                </ Container>
            </>
    )
}
