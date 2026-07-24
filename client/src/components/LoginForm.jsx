import {useState} from 'react'
import axios from 'axios'
import {useAuth} from '../context/AuthContext'

function LoginForm(){
    const API_URL = import.meta.env.VITE_API_URL
    const {login} = useAuth()
    const [isRegistering, setIsRegistering] = useState(false)
    const [formData, setFormData] = useState({username: '',email: '', password:''})
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            if(isRegistering){

                await axios.post(`${API_URL}/api/auth/register`, formData)

            const loginResponse = await axios.post(`${API_URL}/api/auth/login`,{
                email: formData.email,
                password: formData.password
            })

            login(loginResponse.data.user, loginResponse.data.token)

            } else {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                formData,
                {headers: {Authorization: `Bearer ${token}`}}
            )

            login(response.data.user, response.data.token)
            }

        } catch (err){
            setError(isRegistering ? 'Registration failed. Email may already exist.': 'Invalid email or password')
        }
    }

    return(

        <div style={{

            display: 'flex',

            flexDirection: 'column',

            alignItems: 'center',
            /* Centers the login card horizontally on the screen */

            justifyContent: 'center',
            /*Centers the login card vertically on the screen */

            minHeight: '100vh', 
            /*forces the container to take up the full height
            of the browser screen*/
        
            textAlign: 'center'

        }}>
            <div style={{

                width: '100%',
                maxWidth: '400px',
                padding: '20px',
                boxSizing: 'border-box'
            
        }}>

            <div style= {{marginBottom: '2rem'}}>
           
            <h1 style ={{color: '#1db954', fontSize: '2.5rem', letterSpacing: '2px', marginBottom: '0.5rem'}}>
            BeatLog
            </h1>

            <p style ={{color: 'aaaaaa', fontSize:'1rem', lineHeight:'1.6'}}> 
            A stem haven for producers. Log details about instrumentals (Genre, BPM etc.)  
            and share links to yours or others' creative output.
            </p>

            </div>


            <h2>{isRegistering ? 'Create an Account': 'Login to BeatLog'}</h2>
            
            {error && <p style={{color: '#ff4444'}} > {error}</p>}

            <form onSubmit={handleSubmit} style={{
                display: 'flex',

                flexDirection: 'column',
                 /* Stacks the input fields neatly on top of each
            other inside the form */

                gap: '15px'    
                /* Adds clean, even spacing between your inputs
                and the button without messy margins*/

            }}>
                {isRegistering && (

                    <input
                    name = "username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    />
                )}

                <input 
                name = "email"
                type = "email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{padding: '10px', fontSize: '16px'}}
                />

            <input 
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{padding: '10px', fontSize: '16px'}}
            />
            <button type="submit" style={{padding: '10px', cursor: 'pointer'}}>{isRegistering ? 'Register' :'Login'}</button>
           <p
                onClick={() => {setIsRegistering(!isRegistering); setError(null)}}
                style ={{color: '#1db954', cursor:'pointer',fontSize: '0.85rem', textAlign: 'center' }}
           >
            {isRegistering ? 'Already have an account? Login': "Don't have an account? Register"}
           </p>   
            </form>
        </div>
    </div>
    
    )

}//function

export default LoginForm