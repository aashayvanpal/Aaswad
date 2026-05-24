import React, { useEffect, useState } from "react"
import axios from "../config/axios.js"
import "../css/LoginDetails/Signin.scss"
import { Link } from "react-router-dom"
import { getUserDetails } from '../assets/user-functions.js'
const SignInForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    getUserDetails()
      .then(() => {
        console.log("Already logged in, redirecting to /menu")
        window.location.href = '/menu'
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("inside handle submit button clicked!")

    const user = { email, password }

    try {
      axios.post("/login", user)
        .then(response => {
          if (response.data.errors) {
            console.log("Validation Error:", response.data.errors)
            window.alert("Validation Error: " + response.data.message)
          } else if (typeof response.data === "object") {
            console.log("token:", response.data.token)
            localStorage.setItem("token", response.data.token)
            window.location.href = '/menu'
          } else {
            window.alert(response.data)
          }
        })
    } catch (e) {
      alert("There is an error in log in: " + e)
    }
  }

  return (
    <div className="signin-wrapper">
      <div className="SignUpCard">
        <div>
          <h1 className="signin-title">Sign In</h1>
          <form onSubmit={handleSubmit}>
            <input
              id="inputEmail"
              placeholder="Email"
              name="email"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <br />
            <input
              id="inputPassword"
              type="password"
              placeholder="Password"
              name="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
            <br />
            <div className="signin-submit-row">
              <input type="submit" value="Log In" id="logIn" />
            </div>
          </form>
          <h3 id="already-have-account">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </h3>
        </div>
      </div>
    </div>
  )
}

export default SignInForm
