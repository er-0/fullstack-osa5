import { useState } from "react"
import loginService from '../services/login'

const LoginForm = ({logIn}) =>  {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const loginEvent = async (event) => {
      try{
        event.preventDefault()
        var user = await loginService.login({username, password})
        logIn({username: user.username, name: user.name, token: user.token})
      } catch {
        console.error('Validation failed')
      }
    }
      
    return (
    <div>
    <h3>log in to application</h3>
    <form onSubmit={loginEvent}>
      <div>
        username
          <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </div>
    )
    }

export default LoginForm