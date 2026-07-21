import {useState} from 'react'
import {useAuth} from './context/AuthContext'
import SessionForm from './components/SessionForm'
import SessionList from './components/SessionList'
import LoginForm from './components/LoginForm'

function App() {

const {user, logout, loading} = useAuth()
const[sessions, setSessions] = useState([])

const handleSessionAdded = (newSession) =>{
  setSessions([newSession, ...sessions])
}

if (loading) return null

if(!user){
  return <LoginForm/>
}

 return (
 <div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
    <h1>BeatLog</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span style={{ color: '#1db954', fontSize: '0.9rem' }}>
        ● {user.username}
      </span>
      <button onClick={logout}>Logout</button>
    </div>
  </div>

  <SessionForm onSessionAdded={handleSessionAdded} />
  <SessionList sessions={sessions} setSessions={setSessions} />
</div>
 )
}

export default App
