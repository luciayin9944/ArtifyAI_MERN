import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

// API to register user
export const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password){
            return res.status(400).json({ success: false, message: 'Missing details' });
        }

        email = email.trim().toLowerCase();

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email already registered. Please login instead.'
        });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email, 
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save()
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.status(201).json({success:true, token, user:{name:user.name}})

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: error.message})
    }
}

// API to login user
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email})

        if (!user) {
            return res.status(404).json({success: false, message: "User does not exist, please signup." })
        } 

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.status(200).json({success:true, token, user:{name:user.name}})
        } else {
            return res.status(401).json({success:false, message:'Wrong password.'})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({success:false, message: error.message})
    }
}


export const userCredits = async (req, res) => {
  try {
    const userId = req.userId; 
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    const user = await userModel.findById(userId).select('creditBalance name');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};




// export const userCredits = async (req, res) => {
//     try {
//         const {userId} = req.body
//         const user = await userModel.findById(userId)
//         res.status(200).json({
//             success:true,
//             credits: user.creditBalance,
//             user: {name: user.name}
//         })
//     } catch (error) {
//         console.log(error.message)
//         res.status(500).json({success:false, message: error.message})
//     }
// }



