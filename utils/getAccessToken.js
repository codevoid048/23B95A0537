import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

let cachedAccessToken = null;
let tokenExpiryTime = null;

export const getNewAccessToken = async (req, res) => {
    const now = Date.now();
    if(cachedAccessToken && tokenExpiryTime && now < tokenExpiryTime) {
        console.log("Using Cached Access Token");
        return cachedAccessToken;
    }
    try {
        const email = process.env.EMAIL;
        const name = process.env.NAME;
        const rollNo = process.env.ROLLNO;
        const accessCode = process.env.ACCESS_CODE;
        const clientID = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        const response = await axios.post(`http://20.244.56.144/evaluation-service/auth`, { email, name, rollNo, accessCode, clientID, clientSecret });
        const access_token = response.data.access_token;

        
        console.log("Access Token Fetched Successfully");
        cachedAccessToken = access_token;
        tokenExpiryTime = Date.now() + (response.data.expires_in * 1000);
        return access_token;
    }
    catch (error) {
        console.log("Error Fetching Access Token : ", error);
        //return res.status(400).send("message : Error Fetching Access Token");
    }
}