// App version v1.0.5.7 T8 Home page CSS mobile view changes
// Check version-notes.txt for version updates

import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard.js";
import Header from './components/Header.js'
import Menu from "./components/ItemList";
import MyOrdersList from "./components/MyOrdersList.js";
import OrderList from "./components/OrderList";
import OrderShow from "./components/order/Show.js";
import OrderPrint from "./components/order/Print.js";

import MyOrdersShow from "./components/myOrdersShow.js";

import AddUserData from "./components/AddUserData.js";
// import Calender from './GUI/Calender.js';
import ItemList from "./components/item/List.js";
import ItemEdit from "./components/item/Edit.js";
import ItemShow from "./components/item/Show.js";
// import ItemForm from './components/item/Form.js';
import ItemNew from "./components/item/New.js";
import ItemDetailsForm from "./components/ItemDetailsForm.js";

import CustomerRequest from "./components/CustomerRequest.js";

import "./css/app-css.css";
// import ItemCard from './components/ItemCard';
import SignUpForm from "./components/SignUpForm.js";

import UserProfile from "./components/UserProfile.js";
import Contact from "./components/contact/Contact.js";
// import Footer from './components/Footer.js'
import HomePage from "./components/HomePage.js";
// import Qurries from './components/Qurries.js'
import "./css/HomePage/header.css";
// make header as a component
import { Container, Row, Col } from "reactstrap";
import SignupCenterContainer from "./components/SignupCenterContainer.js";
import NotFoundPage from './components/NotFoundPage.js'

function App() {
  return (
    <div className="app">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        crossOrigin="anonymous"
      ></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playball&display=swap"
        rel="stylesheet"
      ></link>
      <script
        src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossOrigin="anonymous"
      ></script>

      <Container fluid>
        <Row>
          <Col style={{ paddingRight: "0px", paddingLeft: "0px" }}>
            <BrowserRouter>

              <div className="align">
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

                <div className="content-showcase">
                  <Switch>
                    <Route exact path="/">
                      <HomePage />
                    </Route>
                    <Route path="/dashboard">
                      <Header />
                      <h1 style={{ backgroundColor: "green" }}>Dashboard:</h1>
                      <Dashboard />
                    </Route>

                    <Route exact path="/myOrders">
                      <Header />
                      <h1 style={{ textAlign: "center" }}>Your order history:</h1>
                      <br />
                      <MyOrdersList />
                    </Route>

                    <Route exact path="/menu">
                      {/* Render ItemCard for a different view (conditional rendering) */}
                      {/* show button only for admin */}

                      {/*                     
                    <h1 className="Link-Navigations">
                      <span id="Link"><Link to="/">Home</Link></span>
                      <span id="Link"><Link to="/Menu">Menu</Link></span>
                      <span id="Link"><Link to="/Cart">Cart</Link></span>
                    </h1> */}
                      {/* <Header /> */}
                      <Menu />
                      {/* <ItemCard /> */}
                    </Route>

                    <Route path="/Cart">
                      <Header />
                      {/* Must show current cart details */}
                      <h1 style={{ backgroundColor: "green" }}>Cart:</h1>
                    </Route>

                    <Route path="/users/add">
                      <h1>Add User :</h1>
                    </Route>

                    <Route
                      exact
                      path="/users/add"
                      render={() => <AddUserData />}
                    />

                    {/* <Route exact path="/Transport/add" >
                       <h1>Add Transport</h1>
                    {/* <AddTransport /> */}

                    {/* </Route> */}
                    {/*           
                    <Route exact path="/vendor/add" >
                     <h1>Add Vendor</h1>
                         <AddVendor /> */}

                    {/* </Route>  */}

                    <Route path="/request">
                      <Header />
                      <CustomerRequest />
                    </Route>

                    <Route exact={true} path="/items">
                      <button
                        id="ShowButton"
                        onClick={() => {
                          var navBarElement = document.getElementById("Nav-bar");
                          navBarElement.style.display = "block";

                          var showElement = document.getElementById("ShowButton");
                          showElement.style.display = "none";
                        }}
                      >
                        Show
                      </button>
                      <Header />
                      <ItemList />
                    </Route>

                    <Route exact={true} path="/items/add">
                      <Header />
                      <ItemNew />
                    </Route>

                    <Route path={"/items/edit/:id"}>
                      <ItemEdit />
                    </Route>

                    <Route path="/items/show/:id">
                      <Header />
                      <ItemShow />
                    </Route>

                    <Route path="/items/add/adddetails">
                      <Header />
                      <h1>Listing Details :</h1>
                      <ItemDetailsForm />
                    </Route>

                    {/* <Route path="/orders/add" >
            <h1>Add Orders :</h1>
          </Route> */}

                    <Route path="/Calender">
                      <Header />
                      <h1>Calender : </h1>
                      {/* <Calender  /> */}
                    </Route>

                    <Route exact path="/orders">
                      <Header />
                      <OrderList />
                    </Route>

                    <Route exact path="/orders/:id">
                      <Header />
                      <OrderShow />
                    </Route>
                    <Route
                      exact
                      path="/orders/:id/print"
                    >
                      <Header />
                      <OrderPrint />
                    </Route>

                    <Route path="/myOrders/show/:id">
                      <Header />
                      <MyOrdersShow />
                    </Route>

                    <Route path="/Register">
                      <Header />
                      <div className="SignUpCard">
                        <h1 style={{ fontSize: "36px", textAlign: "center" }}>
                          {" "}
                          Sign Up{" "}
                        </h1>
                        <SignUpForm />
                      </div>
                    </Route>

                    <Route path="/Signin">
                      <Header />
                      <SignupCenterContainer />
                    </Route>

                    <Route path="/contactus">
                      <Header />
                      <Contact />
                    </Route>

                    <Route path="/settings">
                      <Header />
                      <h1 style={{ backgroundColor: "blue" }}>Settings:</h1>
                      <h1 style={{}}>App Version : v1.0.5.7 T8</h1>
                      <h1 style={{}}>Created By : Aashay S Vanpal</h1>
                    </Route>

                    <Route exact path="/profile">
                      <Header />
                      <h1 style={{ backgroundColor: "green" }}>Your Profile:</h1>
                      <UserProfile />
                    </Route>

                    <Route path="/aboutus">
                      <Header />

                      <h1
                        style={{ backgroundColor: "gold", textAlign: "center" }}
                      >
                        About us Page
                      </h1>
                      <h2 style={{ color: "green" }}>
                        This page is still under maintenance please wait for the
                        website to be functional soon ...
                      </h2>
                    </Route>

                    <Route path="/deals">
                      <h1
                        style={{ backgroundColor: "gold", textAlign: "center" }}
                      >
                        Deals Page
                      </h1>
                      <h2 style={{ color: "green" }}>
                        This page is still under maintenance please wait for the
                        website to be functional soon ...
                      </h2>
                    </Route>

                    <Route path="/qurries">
                      <Header />
                      <h1 style={{ backgroundColor: "blue" }}>Qurries Page</h1>
                    </Route>

                    <Route path="*">
                      <Header />
                      <NotFoundPage />
                    </Route>
                  </Switch>
                </div>
              </div>
            </BrowserRouter>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
