import { useState, useEffect} from 'react'
import Notification from './components/notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  
//  const [loginVisible, setLoginVisible] = useState(false)

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
      blogService.setToken(user.token)
    }
  }, [])

  const handleMessage = (message, status) => {
    setMessage(message)
    setStatus(status)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const logIn = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      handleMessage('Login successful', 'success')
     // setLoginVisible(false)
    } catch (exception) {
      handleMessage('Wrong username or password', 'error')
    }
  }

  const handleLogOut = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    handleMessage('Logout successful', 'success')
  }

  const addBlog = async (title, author, url) => {
    try {
      await blogService.create({title, author, url})
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      handleMessage(`a new blog ${title} by ${author} added`, 'success')
//      setLoginVisible(false)
    } catch (error) {
      handleMessage('Something went wrong, check form for errors', 'error') 
    }
  }
  //lomakkeen pitää sulkeutua, kun uusi blogi lisätään

  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      const blogsAfter = blogs.filter(blog => blog.id !== id);
      setBlogs(blogsAfter)
      handleMessage(`Blog deleted`, 'success')
    } catch (error) {
      handleMessage('Something went wrong', 'error') 
    }
  }
  //toimii tässä vaiheessa kaikilla käyttäjillä

  const showBlogs = () => {
    return(
    <div>
    <br />
    {blogs.map(blog => <Blog key={blog.id} blog={blog} deleteBlog={() => deleteBlog(blog.id)}/>)}
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