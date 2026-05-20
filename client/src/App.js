// App version v1.0.7.1 T1
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Header from './components/Header.js'
import Menu from "./components/Menu.js";
import MyOrdersList from "./components/MyOrdersList.js";
import OrderList from "./components/OrderList";
import OrderShow from "./components/order/Show.js";
import MultiOrder from "./components/MultiOrder.js";
import MultiOrderShow from "./components/MultiOrderShow.js";
import OrderPrint from "./components/order/Print.js";
import OrderPrintDelivery from "./components/order/PrintDelivery.js";
import MultiOrderPrintDelivery from "./components/order/MultiOrderPrintDelivery.js";
import MyOrdersShow from "./components/myOrdersShow";
import AddUserData from "./components/AddUserData.js";
import ItemList from "./components/item/List.js";
import ItemEdit from "./components/item/Edit.js";
import ItemShow from "./components/item/Show.js";
import ItemNew from "./components/item/New.js";
import ItemDetailsForm from "./components/ItemDetailsForm.js";
import CustomerRequest from "./components/CustomerRequest.js";
import "./css/app-css.css";
import SignUpForm from "./components/SignUpForm.js";
import UserProfile from "./components/UserProfile.js";
import Contact from "./components/contact/Contact.tsx";
import HomePage from "./components/HomePage.tsx";
import Queries from './components/Queries.js'
import "./css/HomePage/header.css";
import NavigationBar from './components/NavigationBar.js'
import SignupCenterContainer from "./components/SignupCenterContainer.js";
import NotFoundPage from './components/NotFoundPage.js'
import ShowBtn from "./assets/ShowBtn.js";
import { appVersion } from './config/main.client.js'
import MultiDateOrders from "./components/MultiDateOrders.js";
import DisplayCustomers from "./components/customer/DisplayCustomers.js";
import AddCustomerForm from "./components/customer/AddCustomerForm.js";
import ViewCustomer from './components/customer/ViewCustomer.js'
import Ingredients from "./components/ingredients";
import EventOrders from "./components/eventOrders/index.js";
import EventOrdersList from "./components/eventOrders/list";
import Contacts from "./components/contacts";
import BusinessAnalyzer from "./components/businessAnalyzer/index.js";

function App() {
  return (
    <div className="app">
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Playball&display=swap" rel="stylesheet" />

      <div style={{ width: '100%' }}>
        <BrowserRouter>
          <div className="align">
            <div className="content-showcase">
              <Routes>

                    <Route path="/" element={<HomePage />} />

                    <Route path="/dashboard" element={
                      <><Header /><h1 style={{ backgroundColor: "green" }}>Dashboard:</h1><Dashboard /></>
                    } />

                    <Route path="/myOrders" element={
                      <div style={{ height: "100vh" }}>
                        <Header />
                        <MyOrdersList />
                      </div>
                    } />

                    <Route path="/menu" element={<><Header /><Menu /></>} />

                    <Route path="/Cart" element={
                      <><Header /><h1 style={{ backgroundColor: "green" }}>Cart:</h1></>
                    } />

                    <Route path="/customers" element={<><Header /><DisplayCustomers /></>} />
                    <Route path="/customers/add" element={<><Header /><AddCustomerForm /></>} />
                    <Route path="/customers/edit/:id" element={<><Header /><AddCustomerForm /></>} />
                    <Route path="/customers/:id" element={<><Header /><ViewCustomer /></>} />

                    <Route path="/ingredients" element={<><Header /><Ingredients /></>} />

                    <Route path="/users/add" element={<AddUserData />} />

                    <Route path="/request" element={<><Header /><CustomerRequest /></>} />
                    <Route path="/requestEventOrder" element={<><Header /><CustomerRequest type="eventOrder" /></>} />

                    <Route path="/items" element={
                      <><Header /><ShowBtn /><div style={{ width: "100%", display: "flex" }}><NavigationBar /><ItemList /></div></>
                    } />
                    <Route path="/items/add" element={<><Header /><ItemNew /></>} />
                    <Route path="/items/edit/:id" element={<><Header /><ItemEdit /></>} />
                    <Route path="/items/show/:id" element={<><Header /><ItemShow /></>} />
                    <Route path="/items/add/adddetails" element={<><Header /><h1>Listing Details :</h1><ItemDetailsForm /></>} />

                    <Route path="/Calender" element={<><Header /><h1>Calender :</h1></>} />

                    <Route path="/orders" element={<><Header /><OrderList /></>} />
                    <Route path="/bulk-orders" element={<><Header /><MultiDateOrders /></>} />
                    <Route path="/orders/:id/print" element={<OrderPrint />} />
                    <Route path="/orders/:id/printDelivery" element={<OrderPrintDelivery />} />
                    <Route path="/orders/:id" element={<><Header /><OrderShow /></>} />

                    <Route path="/multiOrders/:id/printDelivery" element={<MultiOrderPrintDelivery />} />
                    <Route path="/multiOrders/:id" element={<><Header /><MultiOrderShow /></>} />
                    <Route path="/multiOrders" element={<><Header /><MultiOrder /></>} />

                    <Route path="/myOrders/show/:id" element={<><Header /><MyOrdersShow /></>} />
                    <Route path="/myOrders/feedback/:id" element={<><Header /><MyOrdersShow /></>} />

                    <Route path="/Register" element={
                      <>
                        <Header />
                        <div className="SignUpCard">
                          <h1 style={{ fontSize: "36px", textAlign: "center" }}>Sign Up</h1>
                          <SignUpForm />
                        </div>
                      </>
                    } />

                    <Route path="/Signin" element={
                      <div style={{ height: "100vh" }}><Header /><SignupCenterContainer /></div>
                    } />

                    <Route path="/contact" element={<><Header /><Contact /></>} />

                    <Route path="/settings" element={
                      <div style={{ height: "100vh" }}>
                        <Header />
                        <div style={{ textAlign: "center" }}>
                          <h1>Settings:</h1>
                          <h1>App Version : {appVersion}</h1>
                          <h1>Created By : Aashay S Vanpal</h1>
                          <h1>Contact : 9743419673 for any issues in app</h1>
                        </div>
                      </div>
                    } />

                    <Route path="/profile" element={<><Header /><UserProfile /></>} />
                    <Route path="/contacts" element={<><Header /><Contacts /></>} />

                    <Route path="/aboutus" element={
                      <>
                        <Header />
                        <h1 style={{ backgroundColor: "gold", textAlign: "center" }}>About us Page</h1>
                        <h2 style={{ color: "green" }}>This page is still under maintenance, please wait for the website to be functional soon...</h2>
                      </>
                    } />

                    <Route path="/deals" element={
                      <>
                        <h1 style={{ backgroundColor: "gold", textAlign: "center" }}>Deals Page</h1>
                        <h2 style={{ color: "green" }}>This page is still under maintenance, please wait for the website to be functional soon...</h2>
                      </>
                    } />

                    <Route path="/queries" element={<><Header /><Queries /></>} />

                    <Route path="/eventOrders/:id/customer" element={<><Header /><OrderShow type="eventOrder" /></>} />
                    <Route path="/eventOrders/:id" element={<><Header /><EventOrdersList /></>} />
                    <Route path="/eventOrders" element={<><Header /><EventOrders /></>} />

                    <Route path="/profit-loss" element={<><Header /><BusinessAnalyzer /></>} />

                    <Route path="*" element={<><Header /><NotFoundPage /></>} />

              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
