import { useState } from 'react'

const Blog = ({blog}) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
  <div style={blogStyle} onClick={toggleVisibility}>
    {blog.title} {blog.author} 
    <div style={showWhenVisible}>
      {blog.url} <br/>
      likes {blog.likes} <br/>
      {blog.user.name}
      <button onClick={() => console.log("painoin deletenappia")}>delete</button>
    </div>
  </div>  
  )
  }
  

export default Blog