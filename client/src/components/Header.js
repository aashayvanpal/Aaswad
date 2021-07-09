// import '../css/headerpage.css'
import logo from '../images/aaswad-logo.svg'
import UserOptions from "./UserOptions.js";
import { Link } from "react-router-dom";
import ReactAnime from 'react-animejs'
const { Anime, stagger } = ReactAnime

export default function Header() {
    return (
        <div className="header">
            {/* Important Dont render User-button icon if user is not logged in (conditional rendering)*/}
            {/* Make Order Now! a button and fancy looking */}
            <Anime
                initial={[
                    {
                        targets: "#header-logo",
                        translateX: [-200, 0],
                        easing: "easeInOutSine",
                        opacity: [0, 1],
                        delay: 0
                    }
                ]}
            >
                <Link to="/">
                    <img src={logo} id="header-logo" alt="logo" />
                </Link>
            </Anime>
            <div className="header-link-container">
                <Anime
                    style={{ "display": "flex" }}
                    initial={[
                        {
                            targets: ".linkEnquiry",
                            translateY: [-200, -10],
                            easing: "easeInOutSine",
                            opacity: [0, 1],
                            delay: 500
                        }
                    ]}
                >
                    <Link to="/SignIn" className="linkEnquiry">
                        Order Now !
                    </Link>
                    <Link to="/contactus" className="linkEnquiry">
                        Contact Us
                    </Link>
                </Anime>
                <UserOptions />
            </div>

        </div>
    )
}