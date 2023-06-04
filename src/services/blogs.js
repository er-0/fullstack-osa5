import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(config)
  const response = await axios.post(baseUrl, newBlog, config)
  console.log(response.data, "controllerista")
  return response.data
}

const deleteBlog = async blogToDelete => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogToDelete.id}`, blogToDelete, config)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken, deleteBlog }