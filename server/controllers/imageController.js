import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"


// API to generate Image
export const generateImage = async (req, res) => {
    try {
        const userId = req.userId; 
        const { prompt } = req.body || {};

        const user = await userModel.findById(userId)

        if (!user || !prompt) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }

        if (user.creditBalance <= 0) {
            return res.status(403).json({
                success: false,
                message: 'No credit',
                creditBalance: user.creditBalance
            })
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers:{
                ...formData.getHeaders(),
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        })

        // Convertion of arrayBuffer to base64
        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`

        // Deduction of user credit 
        const updated = await userModel.findByIdAndUpdate(
            user._id, 
            { creditBalance: user.creditBalance - 1 },
            { new: true }
        )

        // Sending Response
        res.status(201).json({ 
            success: true, 
            message: "Image generated", 
            creditBalance: updated.creditBalance, 
            resultImage, 
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}