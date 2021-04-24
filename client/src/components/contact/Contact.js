import React from 'react'
import MessageForm from './Form.js'
import Footer from '../Footer.js'
import division from '../../images/division.png'
import location from '../../images/map-location.png'
import mapImg from '../../images/map-image.png'
import whatsAppImg from '../../images/whatsApp-image.png'
import gmailImg from '../../images/Email-icon.png'
import '../../css/Contact.css'

export default class ContactUs extends React.Component {
    render() {
        return (
            <div>
                <div id="ContactUs-div">
                    <h1>Contact Us</h1>
                </div>
                <div id="getInTouch-div">
                    <h1>Get in Touch</h1>
                </div>

                <div id="contact-container">
                    <div id="contact-details">
                        <h2>Contact Details</h2>
                        <div>
                            <div style={{ "display": "flex" }}>
                                <img src={mapImg} alt="" width="60px" height="60px" style={{ "margin": "20px" }} />
                                <h1>#34 Soundarya, 1st Main ,            4th Cross, GMR Layout , Geddalahalli, Sanjaynagar, Bangalore -560094</h1>
                            </div>
                            <p style={{ "textAlign": "center", "fontSize": "22px" }}>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/33,+3rd+Main+Rd,+Geddalahalli,+KEB+Layout,+GMR+Layout,+Bengaluru,+Karnataka+560094/@13.0316457,77.5764478,17z/data=!3m1!4b1!4m5!3m4!1s0x3bae17c22c50239b:0x9595acf3f2c457cc!8m2!3d13.0316405!4d77.5786365">Get Directions</a>
                            </p>

                        </div>

                        <div style={{ "display": "flex" }}>

                            <img src={whatsAppImg} alt="" width="60px" height="60px" style={{ "margin": "20px" }} />
                            <h1 style={{
                                "marginTop": "30px"
                            }}>+91 9743419673</h1>
                        </div>

                        <div style={{ "display": "flex" }}>
                            <img src={gmailImg} alt="" width="60px" height="60px" style={{ "margin": "20px" }} />
                            <h1 style={{
                                "marginTop": "30px"
                            }}>varsha.vanpal@gamil.com</h1>
                        </div>
                    </div>

                    <img src={division} alt="division-image" id='division' />
                    <MessageForm />
                </div>

                <div id="location-container">
                    <h1 style={{ "textAlign": "center" }}>Our Location</h1>
                    <img src={location} alt="" style={{ "display": "block", "width": "100%", "marginLeft": "auto", "marginRight": "auto" }} />
                </div>
                <Footer />
            </div>
        )
    }
}

