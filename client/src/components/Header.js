import { useEffect } from 'react'
import anime from 'animejs'
import logo from '../images/aaswad-logo.svg'
import UserOptions from "./UserOptions.js"
import { Link } from "react-router-dom"

export default function Header() {
    useEffect(() => {
        anime({ targets: '#header-logo', translateX: [-200, 0], easing: 'easeInOutSine', opacity: [0, 1], delay: 0 })
        anime({ targets: '.linkEnquiry', translateY: [-200, -10], easing: 'easeInOutSine', opacity: [0, 1], delay: 500 })
    }, [])

    return (
        <div className="header">
            <Link to="/">
                <img src={logo} id="header-logo" alt="logo" />
            </Link>
            <div className="header-link-container">
                <div style={{ display: 'flex' }}>
                    <Link to="/SignIn" className="linkEnquiry">Order Now !</Link>
                    <Link to="/contact" className="linkEnquiry">Contact Us</Link>
                </div>
                <UserOptions />
            </div>
        </div>
    )
}
