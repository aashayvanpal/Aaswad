import React from 'react'
import MessageForm from './Form.js'
import Footer from '../Footer.js'
import division from '../../images/division.png'
import location from '../../images/map-location.png'
import mapImg from '../../images/map-image.png'
import whatsAppImg from '../../images/whatsApp-image.png'
import gmailImg from '../../images/Email-icon.png'
import '../../css/Contact.css'

const ContactUs = () => {
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

                <img src={division} alt="divisionImage" id='division' />
                <MessageForm />
            </div>

            <div id="location-container">
                <h1 style={{ "textAlign": "center" }}>Our Location</h1>
                {/* <img src={location} alt="" style={{ "display": "block", "width": "100%", "marginLeft": "auto", "marginRight": "auto" }} /> */}

                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.9414729208432!2d77.57857370734024!3d13.031624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17c22c67e5d5%3A0xb78ebc83bd03aa60!2s33%2C%203rd%20Main%20Rd%2C%20Geddalahalli%2C%20KEB%20Layout%2C%20GMR%20Layout%2C%20Bengaluru%2C%20Karnataka%20560094%2C%20India!5e0!3m2!1sen!2sus!4v1679814589260!5m2!1sen!2sus"
                    width="100%"
                    height="600"
                    style={{ border: "3px solid black", borderRadius: "10px" }}
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>


            <Footer />
        </div>
    )
}
export default ContactUs