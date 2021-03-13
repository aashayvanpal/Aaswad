import React from 'react'
import axios from 'axios'
import './App.css'

export default class App extends React.Component {

  state = {
    title: '',
    body: '',
    posts: [],
    items: []
  }

  handleChange = ({ target }) => {
    const { name, value } = target
    this.setState({ [name]: value })
  }

  getBlogData = () => {
    axios.get('/api')
      .then((response) => {
        this.setState({
          posts: response.data,
        })
        console.log("Blog data has been recieved")
        console.log(response.data)

      })
      .catch(() => {
        alert('could not get the data!')
      })
  }

  getItemData = () => {
    axios.get('/api/items')
      .then((response) => {
        this.setState({
          items:response.data
        })
        console.log("Item data has been recieved")
        console.log(response.data)

      })
      .catch(() => {
        alert('could not get the data!')
      })
  }

  submit = (event) => {
    event.preventDefault()

    const payload = {
      title: this.state.title,
      body: this.state.body
    }

    axios({
      url: '/api/save',
      data: payload,
      method: 'POST'
    })
      .then(() => {
        console.log("data has been sent to the server")
        this.resetUserInputs()
        this.getBlogData()

      })
      .catch(() => {
        console.log("error in sending the data")

      })

  }

  resetUserInputs = () => {
    this.setState({
      title: '',
      body: ''
    })
  }

  displayBlogPosts(posts) {

    if (!posts.length) return null

    return posts.map((post, index) => (
      <div key={index} className="blog-post_display">
        <h3>{index + 1}. {post.title}</h3>
        <p>{post.body}</p>
      </div>
    ))
  }

  displayItems(items){
    if (!items.length) return null

    return items.map((item, index) => (
      <div key={index} className="item_display">
        <h3>{index + 1}. {item.name}</h3>
        <p>{item.price}</p>
      </div>
    ))
  }

  componentDidMount() {
    this.getBlogData()
    this.getItemData()
  }

  render() {
    // console.log('state:', this.state)
    return (
      <div className="app">
        <h2>Aaswad Caterers App </h2>
        <form onSubmit={this.submit}>
          <div className="form-input">
            <input
              type="text"
              name="title"
              value={this.state.title}
              placeholder="title"
              onChange={this.handleChange}
            />
          </div>
          <div className="form-input">
            <textarea
              name="body"
              placeholder="body"
              cols="30" rows="10"
              value={this.state.body}
              onChange={this.handleChange}>

            </textarea>
          </div>
          <button>Submit</button>
        </form>
        <div className="blog-post">
          blogs
          {this.displayBlogPosts(this.state.posts)}
        </div>
        <div>
          no items
          {this.displayItems(this.state.items)}
        </div>
      </div>
    )
  }
}