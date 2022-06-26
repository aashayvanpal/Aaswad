import React, { useEffect, useState } from "react";
import axios from "../config/axios.js";
import { withRouter, browserHistory } from "react-router";
import { createBrowserHistory } from 'history'
import "../css/LoginDetails/Signin.css";
import { Link } from "react-router-dom";
import { getUserDetails } from '../assets/user-functions.js'
import ReactAnime from 'react-animejs'
const { Anime } = ReactAnime

const SignInForm = (props) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isCaterer, setIsCaterer] = useState(false)

  useEffect(() => {
    getUserDetails()
      .then(res => {
        console.log("user data inside component did mount :", res)
        console.log("Redirect user to /menu")
        // this.setState({
        //     username: res.username,
        //     userType: res.userType,
        //     email: res.email,
        //     phonenumber: res.phonenumber

        // })
        window.location.href = '/menu'

      })
    // .catch(err => {
    //   console.log(err)
    //   window.alert('Please login ,you will be redirected')
    //   window.location.href = '/signin'
    // })

  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("inside handle submit button clicked!");

    // console.log("Signin data :", this.state);
    // post request to create new user

    const user = {
      email: email,
      password: password,
    };

    axios.post("/login", user).then((response) => {
      if (response.data.errors) {
        console.log("Validation Error : ", response.data.errors);
        window.alert(response.data.message);
      } else {
        console.log("typeof(response.data)", typeof response.data);
        if (typeof response.data == "object") {
          console.log("complete response", response);
          console.log("token is :", response.data.token);
          localStorage.setItem("token", response.data.token);
          // props.history.push("/menu");
          // createBrowserHistory.push("/menu");
          window.location.href = '/menu'
        } else {
          window.alert(response.data);
        }
      }
    });

    // alert('account logged in successfully')
  };

  const handleCheckboxChange = () => {
    console.log("this.state.isCaterer before:", isCaterer);
    let change = !isCaterer;
    console.log("change:", change);
    this.setState({ isCaterer: change });
    console.log("this.state.isCaterer after:", isCaterer);
  };

  return (
    <Anime
      initial={[
        {
          targets: ".SignUpCard",
          easing: "easeInOutSine",
          opacity: [0, 1],
          delay: 100
        }
      ]}
      style={{ "margin": "10px" }}
    >
      <div className="SignUpCard">
        <div>
          <h1 style={{ fontSize: "36px", textAlign: "center" }}> Sign In </h1>

          <form onSubmit={handleSubmit}>
            <input
              id="inputEmail"
              placeholder="Email"
              name="email"
              onChange={(e) => { setEmail(e.target.value) }}
              value={email}
            />
            <br />
            <input
              id="inputPassword"
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => { setPassword(e.target.value) }}
              value={password}
            />
            <br />
            <div
              style={{
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "flex",
                  width: "238px",
                }}
              >
                {/* <input type="checkbox"
                              id="caterer"
                              name="isCaterer"
                              onChange={this.handleCheckboxChange} checked={this.state.isCaterer}
                              style={{
                              }} />
                          <label style={{

                              "fontSize": "32px",
                              "marginLeft": "30px",
                          }} htmlFor="caterer" > I am Caterer</label>
                          <br /> */}
              </div>
              <div
                style={{
                  position: "relative",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "flex",
                  width: "100%",
                }}
              >
                <input type="submit" value="Log In" id="logIn" />
              </div>
            </div>
          </form>
          <h3 id="already-have-account">
            Don't have an account ? <Link to="/register">Sign Up</Link>
          </h3>
        </div>
      </div>
    </Anime>
  );

}
export default SignInForm