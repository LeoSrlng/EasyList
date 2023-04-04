import { BASE_IMG } from './config_front/API.js'

function Footer() {
        
    return (
        <footer>
        <a aria-label="btn-toTop" className="btn-toTop" href="#top">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path className="svg" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM377 271c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-87-87-87 87c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 167c9.4-9.4 24.6-9.4 33.9 0L377 271z"/>
            </svg>
        </a>
            <h2 className="footer-title">Participants à la création du site</h2>
            
            <div className="wrap-footer">
                <div className="wrap-footer-id">
                    <img className="img-footer" src={`${BASE_IMG}/photo de moi.jpg`} alt="developpeur du site" />
                    <h3 className="footer-txt-id">Léo Sarlange</h3>
                    <p className="footer-txt-id">Developpeur en formation à la 3W Academy</p>
                </div>
                <div className="wrap-footer-id">
                    <img className="img-footer" src={`${BASE_IMG}/Juan-lobo.jpg`} alt="Fournisseur de recettes" />
                    <h3 className="footer-txt-id">Jean-Loup Salmon</h3>
                    <p className="footer-txt-id">Fournisseur de recettes</p>
                </div>
                <div className="wrap-footer-id">
                    <img className="img-footer" src={`${BASE_IMG}/maman.jpg`} alt="Fournisseuse de recettes" />
                    <h3 className="footer-txt-id">Caroline Gautier</h3>
                    <p className="footer-txt-id">Fournisseuse de recettes</p>
                </div>
            </div>
            
        </footer>
    )
}

export default Footer