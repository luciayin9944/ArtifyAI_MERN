# ArtifyAI_MERN

This is a full-stack AI image generation application built with the MERN stack (MongoDB, Express, React, Node.js). Users can create high-quality, AI-generated images from text prompts using advanced image generation APIs. The app features secure authentication, credit-based usage tracking, and Stripe-powered payment integration for purchasing image credits.




## 🔐 Features
-	AI Image Generation – Generate high-quality, realistic, or stylized images from custom text prompts using advanced AI API.
-	User Authentication – Secure sign-up and login system with encrypted passwords and JWT-based authorization.
-	Credit System – Each user has a credit balance; one credit is deducted per image generated.
-	Stripe Payment Integration – Purchase additional credits safely through Stripe’s checkout system.
-	MongoDB Data Storage – User, transaction, and credit data stored and managed efficiently in MongoDB Atlas.
-	Error Handling & Alerts – User-friendly alerts for invalid prompts, missing credits, or failed payments.
-	Responsive UI – Modern, minimal, and fully responsive interface built with React and Tailwind CSS.


## 🛠️ Setup

### Prerequisite: 
1. Create MongoDB database <MERN_ArtifyAI>
2. Resgister APIs
- https://clipdrop.co/apis/docs/text-to-image#text-to-image-api  
- https://docs.stripe.com/keys


### Setup backend/.env
```bash
    MONGO_URI=<your_mongo_uri>

    CLIPDROP_API=<YOUR_API_KEY>

    STRIPE_SECRET_KEY=<your_secret_key>
    CURRENCY=USD

    JWT_SECRET=jwt_secret
    FRONTEND_URL=http://localhost:5174
```

### Run the Backend
```bash
    cd backend
    npm install
    npm run start
```

### Run the Frontend
```bash
    cd frontend
    npm install
    npm run dev