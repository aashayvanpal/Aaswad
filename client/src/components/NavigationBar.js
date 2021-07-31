import { Link } from 'react-router-dom'
export default function NavigationBar() {
    return (
        <div id="Nav-bar">
            <ul style={{ listStyleType: "none" }}>
                <button
                    style={{
                        marginLeft: "109px",
                        background: "#0e235f",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        var navBarElement = document.getElementById("Nav-bar");
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
                    style={{ textDecoration: "none" }}
                >
                    <li>Home</li>
                </Link>
                <Link
                    to="/dashboard"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Dashboard</li>
                </Link>
                <Link
                    to="/items"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Items</li>
                </Link>
                <Link
                    to="/menu"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Menu</li>
                </Link>

                <Link
                    to="/orders"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Orders</li>
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
                    to="/users/add"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Customers</li>
                </Link>
                <Link
                    to="/users/add"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Recipies</li>
                </Link>
                <Link
                    to="/calender"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Calender</li>
                </Link>
                <Link
                    to="/qurries"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Qurries</li>
                </Link>
                <Link
                    to="/deals"
                    className="Nav-barLink"
                    style={{ textDecoration: "none" }}
                >
                    <li>Deals</li>
                </Link>
            </ul>
        </div>
    )
}