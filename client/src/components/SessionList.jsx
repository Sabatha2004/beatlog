import {useEffect, useState} from 'react'
import axios from 'axios'
import {useAuth} from '../context/AuthContext'

function SessionList({sessions, setSessions}) {
    const {token} = useAuth()
    const[loading, setLoading] =  useState(true)

    useEffect(() => {

        const fetchSessions = async () => {

            try{
                const response = await axios.get('http://localhost:5000/api/sessions')
                setSessions(response.data),

                {headers: {Authorziation: `Bearer ${token}`}}

            } catch(err){
                console.error(err)
            } finally{
                setLoading(false)
            }
        }

        fetchSessions()

    }, [])

    const handleDelete = async (id) => {

        try {
            await axios.delete('http://localhost:5000/api/sessions/${id}')
            setSessions(sessions.filter(session => session.id !==id)),
            //remember: "filter" creates a brand new array
            
            { headers: {Authorziation: `Bearer ${token}`}}

        }catch(err){
            console.error(err)
        }//try catch 
    }//handleDelete

    if(loading) return <p>Loading sessions...</p>
    if(sessions.length===0)return <p>No sessions logged yet. Make some beats</p>

    return(
        <ul>
            {sessions.map(session => (
                <li key={session.id}>
                <h3>{session.title}</h3>
                <p>BPM: {session.bpm} | Key: {session.songKey} | Mood: {session.mood}</p>
                <p>{session.notes}</p>
                {session.link && <a href={session.link} targert="_blank" rel="noreferrer">Listen</a>}
                <button onClick={() => handleDelete(session.id)}>Delete</button>
                </li>
            ))}
        </ul>
    )//return 

}//SessionList

export default SessionList

