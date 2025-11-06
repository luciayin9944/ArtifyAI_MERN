import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(0)
    const [alertMessage, setAlertMessage] = useState('');

    // const backendURL = import.meta.env.VITE_BACKEND_URI
    const backendURL = 'http://localhost:4000';
    const navigate = useNavigate()

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(
                `${backendURL}/api/user/credits`, 
                { headers: { Authorization: `Bearer ${token}` },}
            );
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
        navigate('/')
    }

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(
                `${backendURL}/api/image/generate-image`,
                { prompt },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                loadCreditsData()
                return data.resultImage
            } 
            // else {
            //     loadCreditsData()
            //     // status==== 200
            //     if (data.creditBalance===0) {
            //         setAlertMessage("No credit anymore, please buy it");
            //         setTimeout(() => {
            //             setAlertMessage('');   
            //             navigate("/buy");        
            //         }, 1500);
            //     }
            // }
        } catch (error) {
            console.log(error)
            const status = error?.response?.status;
            const data = error?.response?.data;

            // NO CREDIT, 403
            if (status === 403 && data?.creditBalance === 0) {
            setAlertMessage("No credit anymore, please buy it");
            setTimeout(() => {
                setAlertMessage('');
                navigate('/buy');
            }, 1500);
            return;
            }
        }
    }

    useEffect(()=>{
        if (token) {
            loadCreditsData()
        }
    },[token])

    useEffect(() => {
        if (!alertMessage) return;
        const timer = setTimeout(() => setAlertMessage(''), 2000);
        return () => clearTimeout(timer);
    }, [alertMessage])


    const value = {
        user, setUser, showLogin, setShowLogin, backendURL, 
        token, setToken, credit, setCredit, loadCreditsData, 
        logout, generateImage, alertMessage, setAlertMessage,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
            {alertMessage && (
                <div className="fixed bottom-5 right-5 bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded shadow-md z-50">
                    {alertMessage}
                </div>
            )}
        </AppContext.Provider>
    )
}

export default AppContextProvider
