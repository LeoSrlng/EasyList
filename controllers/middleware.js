import parseurl from 'parseurl';
import {verifyToken} from './token.js'

const ADMIN = 'admin'
const USER = 'user'
const PUBLIC = 'public'

const protectedPath = (pathname) => {
    const adminPath = ['addRecette', 'verifAddRecette', 'editRecette', 'showEditRecette', 'admin', 'deleteRecette'];
    
    const userPath = ['userPath'];
    
    const protectedAdmin = adminPath.includes(pathname)
    const protectedUser = userPath.includes(pathname)
    let type = protectedAdmin ? ADMIN : protectedUser ? USER : PUBLIC
    
    return type
}

const accesAutorized = (pathname,userData) => {
    const typePath = protectedPath(pathname)
    
    const adminAcess = (userData && userData.admin) ? typePath === ADMIN : false
    const userAcess = (userData && userData.user) ? typePath === USER : false
    const publicAcess = typePath === PUBLIC 
    
    return (publicAcess || adminAcess || userAcess) ? true : false 

}

const middleware = async (req, res, next) => {
    const pathname = parseurl(req).pathname.split('/')[2];
    const headersAuth =  req.headers['authorization']
    const token = headersAuth ? headersAuth.split(' ')[1] : null
    const userData = await verifyToken(token)
    const acces = accesAutorized(pathname,userData)
    const response = {response:false, msg:'acces refuser'}
    
    return acces ? next() : res.json(response)
    
}

export default middleware