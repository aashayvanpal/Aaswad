import { Link } from 'react-router-dom'
import './NavigationBar.scss'
import homeImg from '../images/home-icon.png'
import dashboardImg from '../images/dashboard-icon.png'
import itemsImg from '../images/items-icon.png'
import menuImg from '../images/menu-icon.png'
import ordersImg from '../images/orders-icon.png'

export default function NavigationBar({ onClose }) {
    return (
        <div id="Nav-bar" style={onClose ? { display: 'block' } : undefined}>
            <ul className="nav-bar-list">
                <button
                    className="nav-bar-close-btn"
                    onClick={onClose || (() => {
                        document.getElementById("Nav-bar").style.display = "none"
                        const showBtn = document.getElementById("ShowButton")
                        if (showBtn) showBtn.style.display = "block"
                    })}
                >
                    X
                </button>
                <Link
                    to="/"
                    className="Nav-barLink"
                >
                    <li>
                        <img src={homeImg} alt=""
                            className="nav-bar-icon" height="40px" width="40px" />
                        Home</li>
                </Link>
                <Link
                    to="/dashboard"
                    className="Nav-barLink"
                >

                    <li><img src={dashboardImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />
                        Dashboard</li>
                </Link>
                <Link
                    to="/items"
                    className="Nav-barLink"
                >

                    <li><img src={itemsImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />Items</li>
                </Link>
                <Link
                    to="/menu"
                    className="Nav-barLink"
                >

                    <li> <img src={menuImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />Menu</li>
                </Link>

                <Link
                    to="/orders"
                    className="Nav-barLink"
                >

                    <li><img src={ordersImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />Orders</li>
                </Link>

                <Link
                    to="/bulk-orders"
                    className="Nav-barLink"
                >
                    <li><img src={ordersImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />Bulk Orders</li>
                </Link>

                <Link
                    to="/multiOrders"
                    className="Nav-barLink"
                >
                    <li><img src={ordersImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />Multi orders</li>
                </Link>

                <Link
                    to="/eventOrders"
                    className="Nav-barLink"
                >
                    <li><img src={ordersImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />Event orders</li>
                </Link>

                <Link
                    to="/users/add"
                    className="Nav-barLink"
                >
                    <li>Vendors</li>
                </Link>
                <Link
                    to="/users/add"
                    className="Nav-barLink"
                >
                    <li>Labourers</li>
                </Link>
                <Link
                    to="/customers"
                    className="Nav-barLink"
                >
                    <li>Customers</li>
                </Link>
                <Link
                    to="/recipies"
                    className="Nav-barLink"
                >
                    <li>Recipies</li>
                </Link>
                <Link
                    to="/ingredients"
                    className="Nav-barLink"
                >
                    <li>Ingredients</li>
                </Link>
                <Link
                    to="/calender"
                    className="Nav-barLink"
                >
                    <li>Calender</li>
                </Link>
                <Link
                    to="/queries"
                    className="Nav-barLink"
                >
                    <li>Queries</li>
                </Link>
                <Link
                    to="/deals"
                    className="Nav-barLink"
                >
                    <li>Deals</li>
                </Link>
                <Link
                    to="/contacts"
                    className="Nav-barLink"
                >
                    <li>Contacts</li>
                </Link>
                <Link
                    to="/profit-loss"
                    className="Nav-barLink"
                >
                    <li><img src={ordersImg} alt=""
                        className="nav-bar-icon" height="40px" width="40px" />Profit-Loss</li>
                </Link>
            </ul>
        </div>
    )
}