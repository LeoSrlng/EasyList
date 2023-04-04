import {generateToken, verifyToken} from './token.js'

const isLogged = async (req,res) => {
    const userData = await verifyToken(req.body.token)
    if(userData){
        const token = await generateToken(userData)
        res.json({response:true, logged:userData.user, admin:userData.admin, infoUser:userData.infoUser, token})
    } else {
        res.json({response:false})
    }
};

export default isLogged;