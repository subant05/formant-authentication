import fetch from 'node-fetch';
import moment from 'moment';
import dotenv from 'dotenv'
import process from 'process';

dotenv.config()

const requestTokens = async () => {
  const response = await fetch(`${process.env.FORMANT_API_URL}/v1/admin/auth/login`, {
      method: "Post",
      body:JSON.stringify({
          "email": process.env.FORMANT_EMAIL
          , "password": process.env.FORMANT_PASSWORD
          , "tokenExpirationSeconds": 604800
      }),
      headers:{
          "Content-Type":"application/json"
      }
      
  });

  const credentials =  await response.json();
  process.env['FORMANT_REFRESH_TOKEN'] = credentials.authentication.refreshToken;
  process.env['FORMANT_REFRESH_TOKEN_EXPIRATION'] = moment().add(604800,"s").utc().valueOf();

  return true;

}

const connect = async ()=>{
    let success = false;

    try{
        if(moment().utc().valueOf() < process.env['FORMANT_REFRESH_TOKEN_EXPIRATION']){
            success = true;

        } else {
            success = await requestTokens();

        }
    } catch(e){
        console.log("MODULE: formant-authentication message: ", e.message);
        console.log("MODULE: formant-authentication stack: ", e.stack);

        success = false;

    } finally {
        return success;
    }
}

const expressModule  = async (req, res, next) => {
    try {
        const connected = await connect();

        if (!connected){
                res.status(401);
                res.send(`401 Unauthorized: Unable to log into Formant.`);
        } else
            next();

    } catch (e) {
        console.log("MODULE: formant-authentication message: ", e.message);
        console.log("MODULE: formant-authentication stack: ", e.stack);

        res.status(503);
        res.send(`503 Server Error.`);
    }
}

export {connect, expressModule}