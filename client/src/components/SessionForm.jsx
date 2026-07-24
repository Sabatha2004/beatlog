import {useState} from 'react' 
//accesses, tracks and updates data
import axios from 'axios'
//facilitates and protects communication between the client and server
import {useAuth} from '../context/AuthContext'

function SessionForm({onSessionAdded}){
    const API_URL = import.meta.env.VITE_API_URL
    const {token} = useAuth()
    const [formData, setFormData] = useState({

        title: '',
        bpm: '',
        songKey: '',
        mood: '',
        notes: '',
        link: ''

    })//object

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post(
                `${API_URL}/api/sessions`,

                formData,
                {headers: {Authorization: `Bearer ${token}`}}
            )

            onSessionAdded(response.data)
            setFormData({title: '', bpm: '', songKey: '', mood:''
                , notes: '', link: ''})
        } catch (err){
            console.error(err)
        }
    }//handleSubmit

    return (
        <form onSubmit={handleSubmit}>
            <input name="title" placeholder='Title' value={formData.title} onChange={handleChange} required />
            <input name="bpm" placeholder="BPM" value={formData.bpm} onChange={handleChange}/>
            <input name="songKey" placeholder="songKey" value={formData.songKey} onChange={handleChange} />
            <input name="mood" placeholder="Mood" value={formData.mood} onChange={handleChange} />
            <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
            <input name="link" placeholder="Link" value={formData.link} onChange={handleChange} />
            <button type="submit">Log Session</button>
        </form>
    )//return

}//function

export default SessionForm 