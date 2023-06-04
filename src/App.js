import { useState, useEffect} from 'react'
import Notification from './components/notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleMessage = (message, status) => {
    setMessage(message)
    setStatus(status)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const logIn = async (userObject) => {
    await console.log('login', userObject)
    try {
      window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(userObject)
      ) 
      await blogService
        .setToken(userObject.token)
      console.log(userObject, "toimi nyt")
      setUser(userObject)
      handleMessage('Login successful', 'success')
      setLoginVisible(false)
    } catch (exception) {
      handleMessage('Wrong username or password', 'error') //tämä ei toimi!
    }
  }

  const handleLogOut = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    handleMessage('Logout successful', 'success')
  }

  const addBlog = (blogObject) => {
    console.log(blogObject)
    try {
      blogService
        .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        })
      handleMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`, 'success')
      setLoginVisible(false)
    } catch (error) {
      handleMessage('Something went wrong, check form for errors', 'error') 
      //tämä ei toimi, pos. viesti näytetään vaikkei virheellistä blogia lisätäkään listaan
    }
  }

  

  const showBlogs = () => {
    return(
    <div>
    <br />
    {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )}

  const showHeader = () => (
    <div>
    <h1>blogs</h1>
    {user.name} logged in <button onClick={handleLogOut}>log out</button>
    </div>
  )


  return (
    <div>
    <Notification message={message} status={status} />
    {!user && <LoginForm logIn={logIn}/>
    }
    {user && showHeader()}
    <br />
    {user &&
    <Togglable buttonLabel="add blog">
      <BlogForm addNewBlog={addBlog} user={user}/>
    </Togglable>
    }
    {user && showBlogs()}
    </div>
  )
}

export default App