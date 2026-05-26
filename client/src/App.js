// App version v1.0.7.1 T1
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './components/Header.js'
import MainLayout from "./components/MainLayout.js";
import "./css/app-css.scss";
import "./css/HomePage/header.scss";
import { appVersion } from './config/main.client.js'

// Eagerly loaded (small, always needed on first paint)
import HomePage from "./components/HomePage.tsx";

// Lazy-loaded route components
const Dashboard = lazy(() => import("./components/Dashboard"));
const Menu = lazy(() => import("./components/Menu.js"));
const MyOrdersList = lazy(() => import("./components/MyOrdersList.js"));
const OrderList = lazy(() => import("./components/OrderList"));
const OrderShow = lazy(() => import("./components/order/Show.js"));
const MultiOrder = lazy(() => import("./components/MultiOrder.js"));
const MultiOrderShow = lazy(() => import("./components/MultiOrderShow.js"));
const OrderPrint = lazy(() => import("./components/order/Print.js"));
const OrderPrintDelivery = lazy(() => import("./components/order/PrintDelivery.js"));
const MultiOrderPrintDelivery = lazy(() => import("./components/order/MultiOrderPrintDelivery.js"));
const MyOrdersShow = lazy(() => import("./components/myOrdersShow"));
const AddUserData = lazy(() => import("./components/AddUserData.js"));
const ItemList = lazy(() => import("./components/item/List.js"));
const ItemEdit = lazy(() => import("./components/item/Edit.js"));
const ItemShow = lazy(() => import("./components/item/Show.js"));
const ItemNew = lazy(() => import("./components/item/New.js"));
const ItemDetailsForm = lazy(() => import("./components/ItemDetailsForm.js"));
const CustomerRequest = lazy(() => import("./components/CustomerRequest.js"));
const SignUpForm = lazy(() => import("./components/SignUpForm.js"));
const UserProfile = lazy(() => import("./components/UserProfile.js"));
const Contact = lazy(() => import("./components/contact/Contact.tsx"));
const Queries = lazy(() => import('./components/Queries.js'));
const SignupCenterContainer = lazy(() => import("./components/SignupCenterContainer.js"));
const NotFoundPage = lazy(() => import('./components/NotFoundPage.js'));
const MultiDateOrders = lazy(() => import("./components/MultiDateOrders.js"));
const DisplayCustomers = lazy(() => import("./components/customer/DisplayCustomers.js"));
const AddCustomerForm = lazy(() => import("./components/customer/AddCustomerForm.js"));
const ViewCustomer = lazy(() => import('./components/customer/ViewCustomer.js'));
const Ingredients = lazy(() => import("./components/ingredients"));
const EventOrders = lazy(() => import("./components/eventOrders/index.js"));
const EventOrdersList = lazy(() => import("./components/eventOrders/list"));
const Contacts = lazy(() => import("./components/contacts"));
const BusinessAnalyzer = lazy(() => import("./components/businessAnalyzer/index.js"));
const SettingsPage = lazy(() => import("./components/SettingsPage.js"));

function App() {
  return (
    <div className="app">
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Playball&display=swap" rel="stylesheet" />

      <div style={{ width: '100%' }}>
        <BrowserRouter>
          <div className="align">
            <div className="content-showcase">
              <Suspense fallback={null}>
                <Routes>

                  {/* Public / customer-facing routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/request" element={<CustomerRequest />} />
                  <Route path="/requestEventOrder" element={<CustomerRequest type="eventOrder" />} />
                  <Route path="/contact" element={<><Header /><Contact /></>} />
                  <Route path="/Register" element={
                    <>
                      <Header />
                      <div className="SignUpCard">
                        <h1 style={{ fontSize: "1.65rem", textAlign: "center" }}>Sign Up</h1>
                        <SignUpForm />
                      </div>
                    </>
                  } />
                  <Route path="/Signin" element={
                    <div style={{ height: "100vh" }}><Header /><SignupCenterContainer /></div>
                  } />

                  {/* Customer order pages */}
                  <Route path="/myOrders" element={
                    <div style={{ height: "100vh" }}>
                      <Header />
                      <MyOrdersList />
                    </div>
                  } />
                  <Route path="/myOrders/show/:id" element={<><Header /><MyOrdersShow /></>} />
                  <Route path="/myOrders/feedback/:id" element={<><Header /><MyOrdersShow /></>} />

                  {/* Print pages — no layout */}
                  <Route path="/orders/:id/print" element={<OrderPrint />} />
                  <Route path="/orders/:id/printDelivery" element={<OrderPrintDelivery />} />
                  <Route path="/multiOrders/:id/printDelivery" element={<MultiOrderPrintDelivery />} />

                  {/* Special */}
                  <Route path="/users/add" element={<AddUserData />} />

                  {/* Admin pages — shared MainLayout (Header + collapsible sidebar) */}
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={
                      <><h1 style={{ backgroundColor: "green" }}>Dashboard:</h1><Dashboard /></>
                    } />

                    <Route path="/Cart" element={
                      <h1 style={{ backgroundColor: "green" }}>Cart:</h1>
                    } />

                    <Route path="/customers" element={<DisplayCustomers />} />
                    <Route path="/customers/add" element={<AddCustomerForm />} />
                    <Route path="/customers/edit/:id" element={<AddCustomerForm />} />
                    <Route path="/customers/:id" element={<ViewCustomer />} />

                    <Route path="/ingredients" element={<Ingredients />} />

                    <Route path="/items" element={<ItemList />} />
                    <Route path="/items/add" element={<ItemNew />} />
                    <Route path="/items/edit/:id" element={<ItemEdit />} />
                    <Route path="/items/show/:id" element={<ItemShow />} />
                    <Route path="/items/add/adddetails" element={<><h1>Listing Details :</h1><ItemDetailsForm /></>} />

                    <Route path="/Calender" element={<h1>Calender :</h1>} />

                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/bulk-orders" element={<MultiDateOrders />} />
                    <Route path="/orders/:id" element={<OrderShow />} />

                    <Route path="/multiOrders/:id" element={<MultiOrderShow />} />
                    <Route path="/multiOrders" element={<MultiOrder />} />

                    <Route path="/queries" element={<Queries />} />

                    <Route path="/eventOrders/:id/customer" element={<OrderShow type="eventOrder" />} />
                    <Route path="/eventOrders/:id" element={<EventOrdersList />} />
                    <Route path="/eventOrders" element={<EventOrders />} />

                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/profit-loss" element={<BusinessAnalyzer />} />

                    <Route path="/settings" element={<SettingsPage />} />

                    <Route path="/profile" element={<UserProfile />} />

                    <Route path="/aboutus" element={
                      <>
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
                  </Route>

                  <Route path="*" element={<><Header /><NotFoundPage /></>} />

                </Routes>
              </Suspense>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
