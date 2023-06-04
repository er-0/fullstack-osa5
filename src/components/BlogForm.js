import { useState } from 'react'

const BlogForm = ({addNewBlog, user}) => {
    
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  
  const addBlog = async (event) => {
    event.preventDefault()
    addNewBlog(title, author, url, user)
  }
  
  return (
  <div>
    <h2>create new</h2>
  <form onSubmit={addBlog}>
    title:
    <input 
      type="text"
      value={title} 
      name="Blog title"
      onChange={({ target }) => setTitle(target.value)}/> <br />
    author:
    <input 
      type="text"
      value={author} 
      name="Blog author"
      onChange={({ target }) => setAuthor(target.value)}/> <br />
    url:
    <input 
      type="text"
      value={url} 
      name="Blog url"
      onChange={({ target }) => setUrl(target.value)}/> <br />
    <button type="submit">add blog</button>
  </form>
  </div>
)
}

export default BlogForm