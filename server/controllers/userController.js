import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import transactionModel from "../models/transactionModel.js";
import Stripe from 'stripe';

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

        date = Date.now();
        const transactionData = {
          userId, plan, amount, credits, date
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


// Payment API to add credits ( Stripe )
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const paymentStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { planId } = req.body;
    const { origin } = req.headers

    if (!userId || !planId) {
      return res.status(400).json({success:false, message:'Missing details'})
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let credits, plan, amount, date

    switch (planId) {
      case 'Basic':
        plan = 'Basic'
        credits = 100
        amount = 10
        break;

      case 'Advanced':
        plan = 'Advanced'
        credits = 500
        amount = 50
        break;

      case 'Business':
        plan = 'Business'
        credits = 5000
        amount = 250
        break;
    }

    date = Date.now();

    const transactionData = {
      userId, plan, amount, credits, date
    }

    const newTransaction = await transactionModel.create(transactionData)

    const currency = process.env.CURRENCY.toLocaleLowerCase()

    // Creating line items to for Stripe
    const line_items = [{
        price_data: {
            currency,
            product_data: {
                name: "Credit Purchase"
            },
            unit_amount: transactionData.amount * 100
        },
        quantity: 1
    }]

    const session = await stripeInstance.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&transactionId=${newTransaction._id}`,
        cancel_url: `${origin}/verify?success=false&transactionId=${newTransaction._id}`,
        line_items: line_items,
        mode: 'payment',
    })
    res.status(201).json({ success: true, session_url: session.url });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}


// API Controller function to verify stripe payment
export const verifyStripe = async (req, res) => {
    try {
        const { transactionId, success } = req.body

        // Checking for payment status
        if (success === 'true') {
            const transactionData = await transactionModel.findById(transactionId)
            if (transactionData.payment) {
                return res.status(400).json({ success: false, message: 'Payment Already Verified' })
            }

            // Adding Credits in user data
            const userData = await userModel.findById(transactionData.userId)
            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            // Marking the payment true 
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

            res.status(200).json({ success: true, message: "Credits Added" });
        }
        else {
            res.status(400).json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


