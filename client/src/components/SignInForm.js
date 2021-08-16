import React from "react";
import axios from "../config/axios.js";
import { withRouter } from "react-router";
import "../css/LoginDetails/Signin.css";
import { Link } from "react-router-dom";
import { getUserDetails } from '../assets/user-functions.js'
import ReactAnime from 'react-animejs'
const { Anime } = ReactAnime

class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isCaterer: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("inside handle submit button clicked!");

    console.log("Signin data :", this.state);
    // post request to create new user

    const user = {
      email: this.state.email,
      password: this.state.password,
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
          this.props.history.push("/menu");
        } else {
          window.alert(response.data);
        }
      }
    });

    // alert('account logged in successfully')
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCheckboxChange = () => {
    console.log("this.state.isCaterer before:", this.state.isCaterer);
    let change = !this.state.isCaterer;
    console.log("change:", change);
    this.setState({ isCaterer: change });
    console.log("this.state.isCaterer after:", this.state.isCaterer);
  };

  componentDidMount() {
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

  }

  render() {
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

            <form onSubmit={this.handleSubmit}>
              <input
                id="inputEmail"
                placeholder="Email"
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
              <br />
              <input
                id="inputPassword"
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
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
}
export default withRouter(SignInForm);
