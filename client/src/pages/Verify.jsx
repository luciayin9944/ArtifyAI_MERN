import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';


const Verify = () => {

    const [searchParams] = useSearchParams()

    const success = searchParams.get("success")
    const transactionId = searchParams.get("transactionId")

    const { backendURL, loadCreditsData, token, setAlertMessage } = useContext(AppContext)

    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {

        try {

            const { data } = await axios.post(
                `${backendURL}/api/user/verify-stripe`,
                { success, transactionId }, 
                { headers: { token } })

            if (data.success) {
                loadCreditsData()
            } else {
                setAlertMessage(data.message)
            }
            navigate("/")
        } catch (error) {
            console.log(error)
            const msg =
                error?.response?.data?.message ||
                error.message ||
                "Verification failed";
            setAlertMessage(msg);
            navigate("/");
        }
    }

    useEffect(() => {
        if (token) {
            verifyStripe()
        }
    }, [token])

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
        </div>
    )
}

export default Verify