import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(0)

    const backendURL = import.meta.env.VITE_BACKEND_URI

    const loadCreditsData = async () => {
        try {
            const {data} = await axios.get(
                backendURL+'/api/user/credits', 
                {headers: {token}}
            )
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if (token) {
            loadCreditsData()
        }
    },[token])


    const value = {
        user, setUser, showLogin, setShowLogin, backendURL, token, setToken, credit, setCredit, loadCreditsData, logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
