import { Link } from 'react-router-dom'
import homeImg from '../images/home-icon.png'
import dashboardImg from '../images/dashboard-icon.png'
import itemsImg from '../images/items-icon.png'
import menuImg from '../images/menu-icon.png'
import ordersImg from '../images/orders-icon.png'

export default function NavigationBar() {
    return (
        <div id="Nav-bar">
            <ul style={{ listStyleImage: 'none', margin: '0px', padding: '0px' }}>
                <button
                    style={{
                        marginLeft: "160px",
                        background: "#04045f",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        borderRadius: "20px",
                        fontWeight: 'bold'
                    }}
                    onClick={() => {
                        var navBarElement = document.getElementById("Nav-bar");
                        // navBarElement.style.width = "0%";
                        navBarElement.style.display = "none";

                        var showElement = document.getElementById("ShowButton");
                        showElement.style.display = "block";
                    }}
                >
                    X
                </button>
                <Link
                    to="/"
                    className="Nav-barLink"
                    style={{
                        textDecoration: "none",
                    }}
                >
                    <li>
                        <img src={homeImg} alt=""
                            style={{
                                filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                            }} height="40px" width="40px" />
                        Home</li>
                </Link>
                <Link
                    to="/dashboard"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >

                    <li><img src={dashboardImg} alt=""
                        style={{
                            filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                        }} height="40px" width="40px" />
                        Dashboard</li>
                </Link>
                <Link
                    to="/items"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >

                    <li><img src={itemsImg} alt=""
                        style={{
                            filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                        }} height="40px" width="40px" />Items</li>
                </Link>
                <Link
                    to="/menu"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >

                    <li> <img src={menuImg} alt=""
                        style={{
                            filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                        }} height="40px" width="40px" />Menu</li>
                </Link>

                <Link
                    to="/orders"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >

                    <li><img src={ordersImg} alt=""
                        style={{
                            filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                        }} height="40px" width="40px" />Orders</li>
                </Link>

                <Link
                    to="/bulk-orders"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li><img src={ordersImg} alt=""
                        style={{
                            filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                        }} height="40px" width="40px" />Bulk Orders</li>
                </Link>

                <Link
                    to="/multiOrders"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li><img src={ordersImg} alt=""
                        style={{
                            filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                        }} height="40px" width="40px" />Multi orders</li>
                </Link>

                <Link
                    to="/eventOrders"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li><img src={ordersImg} alt=""
                        style={{
                            filter: 'invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
                        }} height="40px" width="40px" />Event orders</li>
                </Link>

                <Link
                    to="/users/add"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Vendors</li>
                </Link>
                <Link
                    to="/users/add"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Labourers</li>
                </Link>
                <Link
                    to="/customers"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Customers</li>
                </Link>
                <Link
                    to="/recipies"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Recipies</li>
                </Link>
                <Link
                    to="/ingredients"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Ingredients</li>
                </Link>
                <Link
                    to="/calender"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Calender</li>
                </Link>
                <Link
                    to="/queries"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Queries</li>
                </Link>
                <Link
                    to="/deals"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Deals</li>
                </Link>
                <Link
                    to="/contacts"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Contacts</li>
                </Link>
            </ul>
        </div>
    )
}