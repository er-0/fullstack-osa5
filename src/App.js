import { useState, useEffect, useRef } from 'react'
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

  const blogFormRef = useRef()

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

  const addBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService.create(blog)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      handleMessage(`a new blog ${blog.title} by ${blog.author} added`, 'success')
    } catch (error) {
      handleMessage('Something went wrong, check form for errors', 'error')
    }
  }

  const addLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    await blogService.update(updatedBlog)
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog.id)
        const blogsAfter = blogs.filter(b => b.id !== blog.id)
        setBlogs(blogsAfter)
        handleMessage('Blog deleted', 'success')
      } catch (error) {
        handleMessage('Something went wrong', 'error')
      }
    }
  }

  const showBlogs = () => {
    return(
      <div>
        <br />
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} user={user} blog={blog} deleteBlog={() => deleteBlog(blog)} addLike={() => addLike(blog)}/>
          )
        }
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
    <Togglable buttonLabel="add blog" ref={blogFormRef}>
      <BlogForm addBlog={addBlog} />
    </Togglable>
      }
      {user && showBlogs()}
    </div>
  )
}

export default App