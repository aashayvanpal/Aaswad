import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import Footer from '../components/Footer.js'
import Carousel from './Carousel.js'
import orderfood from '../images/landing-page-images/order-food.svg'
import cook from '../images/landing-page-images/cook.svg'
import deliver from '../images/landing-page-images/deliver.svg'
// import right from '../images/landing-page-images/right.svg'
// import left from '../images/landing-page-images/left.svg'
import designLeft from '../images/landing-page-images/left-design.png'
import vegImage from '../images/landing-page-images/Veg-image.png'
import Header from './Header.js'
import '../css/app-css.css'

// making responsive: 
// problem with footer
// Can add recent events
export default function HomePage(props) {
    return (
        <Container fluid key={props.pageId}>
            <Row>
                <Col style={{ "paddingRight": "0px", "paddingLeft": "0px" }}>
                    <Header />

                    <div className="homepage" >
                        <Carousel />

                        <div style={{ "position": "relative" }}>
                            <img src={designLeft} alt="designleft" id="designLeft" />
                            <div className="Center-content"
                            >
                                <div className="center-align">
                                    <h1 className="h1-heading" id="txt1">Home is where,</h1>
                                    <h1 className="h1-heading" id="txt2">I'm with food</h1>
                                    <Link to='/SignIn' id="OrderNow">ORDER NOW !</Link>
                                </div>
                                <div id="vegImg-placement">
                                    <img id="vegImg" src={vegImage} alt="veg-img" />
                                    <h3 style={{ "textAlign": "center", "marginBottom": "250px" }}>Pure Vegetarian</h3>
                                </div>
                            </div >
                        </div >


                        <div>
                            <div style={{
                                "position": "relative",
                            }}>
                                <h1 id='mini-heading'>Benefits and Features</h1>
                                <div className="container">
                                    <div className="realCard">
                                        <img alt="orderfood-img" src={orderfood} />
                                        <div className="card1">
                                            <h2 >ORDER YOUR FOOD</h2>
                                            <h5><span>Fully Customized </span>delicacies according to your taste</h5>
                                        </div>
                                    </div>

                                    <div className="realCard">
                                        <img alt="deliver-img" src={deliver} />
                                        <div className="card2">
                                            <h2>DELIVER  OR  PICKUP</h2>
                                            <h5>Services that we provide depend on the type of event and are <span> fullfilled according to your convenience</span></h5>
                                        </div>
                                    </div>

                                    <div className="realCard">
                                        <img alt="cook-img" src={cook} />
                                        <div className="card1">
                                            <h2 >DELICIOUS RECIPIE</h2>
                                            <h5>Homely, hygenic and tasty food is superwised by our expert chef
                                                <span> Varsha Vanpal</span></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </Col>
            </Row>
        </Container >

    )
}