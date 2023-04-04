import React from 'react';
import axios from "axios"
import { BASE_URL, BASE_IMG } from './config_front/API.js'
import { NavLink } from 'react-router-dom'
import { Majuscule } from "./config_front/toUppercase.js"
import { ReducerContext } from "./reducer/reducer.js";

function Home() {
    
    const [state, dispatch] = React.useContext(ReducerContext)
    
    const [recette, setRecette] = React.useState([])
    
    const [token, setToken] = React.useState('')
    const [userID, setUserId] = React.useState(state.userInfo.id)
    
    const [entreFav, setEntreFav] = React.useState([])
    const [imgAvantEntre, setImgAvantEntre] = React.useState(0)
    const [imgActuelEntre, setImgActuelEntre] = React.useState(0)
    const [imgApresEntre, setImgApresEntre] = React.useState(1)
    
    const [platFav, setPlatFav] = React.useState([])
    const [imgAvantPlat, setImgAvantPlat] = React.useState(0)
    const [imgActuelPlat, setImgActuelPlat] = React.useState(0)
    const [imgApresPlat, setImgApresPlat] = React.useState(1)
    
    const [dessertFav, setDessertFav] = React.useState([])
    const [imgAvantDessert, setImgAvantDessert] = React.useState(0)
    const [imgActuelDessert, setImgActuelDessert] = React.useState(0)
    const [imgApresDessert, setImgApresDessert] = React.useState(1)
    
    React.useEffect(() => {
        
        setToken(localStorage.getItem("jwtToken"))
        
        if (userID) {
            
            axios.get(`${BASE_URL}/userhome`,{
                params: {
                    userID
                }
            })
            .then((res) => {
                // si tout ce passe bien :
                setEntreFav(res.data.entre)
                setPlatFav(res.data.plat)
                setDessertFav(res.data.dessert)
                setImgAvantEntre(res.data.newLenghtEntre - 1)
                setImgAvantPlat(res.data.newLenghtPlat - 1)
                setImgAvantDessert(res.data.newLenghtDessert - 1)
            })
            .catch((err) => {
                console.log(err);
            })
            
        } else {
            
            axios.get(`${BASE_URL}/commonhome`)
            .then((res) => {
                // si tout ce passe bien :
                setRecette(res.data.cdc)
            })
            .catch((err) => {
                console.log(err);
            })
            
        }
        
    },[]);
    
    React.useEffect(() => {
        
        axios.post(`${BASE_URL}/isLogged`,{
            token
        })
        .then((res) => {
            
          if (res.data.token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
          }
          setUserId(res.data.infoUser.id)
        })
        .catch((err) => {
          console.log(err)
        })
        
    }, [token]);
    
    React.useEffect(() => {
        
        axios.get(`${BASE_URL}/userhome`,{
                params: {
                    userID
                }
            })
            .then((res) => {
                // si tout ce passe bien :
                setEntreFav(res.data.entre)
                setPlatFav(res.data.plat)
                setDessertFav(res.data.dessert)
                setImgAvantEntre(res.data.newLenghtEntre - 1)
                setImgAvantPlat(res.data.newLenghtPlat - 1)
                setImgAvantDessert(res.data.newLenghtDessert - 1)
            })
            .catch((err) => {
                console.log(err);
            })
            
    },[userID]);
    
    const scrollLeftEntre = (e) => {
        e.preventDefault();
        console.log(imgAvantEntre)
        console.log(imgActuelEntre)
        console.log(imgApresEntre)
        
        setImgApresEntre(imgActuelEntre)
        setImgActuelEntre(imgAvantEntre)
        
        if (imgAvantEntre === 0) {
            setImgAvantEntre(entreFav.length - 1)
        } else {
            setImgAvantEntre(imgAvantEntre - 1)
        }
    }
    
    const scrollRightEntre = (e) => {
        e.preventDefault();
        
        setImgAvantEntre(imgActuelEntre)
        setImgActuelEntre(imgApresEntre)
        
        if (imgApresEntre >= (entreFav.length -1)) {
            setImgApresEntre(0);
        } else {
            setImgApresEntre(imgApresEntre + 1);
        }
    }
    
    const scrollLeftPlat = (e) => {
        e.preventDefault();
        
        setImgApresPlat(imgActuelPlat)
        setImgActuelPlat(imgAvantPlat)
        
        if (imgAvantPlat === 0) {
            setImgAvantPlat(platFav.length - 1)
        } else {
            setImgAvantPlat(imgAvantPlat - 1)
        }
    }
    
    const scrollRightPlat = (e) => {
        e.preventDefault();
        
        setImgAvantPlat(imgActuelPlat)
        setImgActuelPlat(imgApresPlat)
        
        if (imgApresPlat >= (platFav.length -1)) {
            setImgApresPlat(0);
        } else {
            setImgApresPlat(imgApresPlat + 1);
        }
    }
    
    const scrollLeftDessert = (e) => {
        e.preventDefault();
        
        setImgApresDessert(imgActuelDessert)
        setImgActuelDessert(imgAvantDessert)
        
        if (imgAvantDessert === 0) {
            setImgAvantDessert(dessertFav.length - 1)
        } else {
            setImgAvantDessert(imgAvantDessert - 1)
        }
    }
    
    const scrollRightDessert = (e) => {
        e.preventDefault();
        
        setImgAvantDessert(imgActuelDessert)
        setImgActuelDessert(imgApresDessert)
        
        if (imgApresDessert >= (dessertFav.length -1)) {
            setImgApresDessert(0);
        } else {
            setImgApresDessert(imgApresDessert + 1);
        }
    }
    
    // créé un composent pour le menu caroussel //
    
    return (
        <React.Fragment>
            <section className="entete">
                <h2 className='home-title'>Bienvenue sur Easy List {state.userInfo.prenom}...</h2>
            </section>
            {state.logUser & entreFav.length >= 1 & platFav.length >= 1 & dessertFav.length >= 1 ?
                <section className="container grid-context">
                    <h2  className="grid_titre txt-grid">Vos Favoris..</h2>
                    <div className="grid1 txt-grid">
                        <h3 className="responsive-size-grid">Les Entrées:</h3>
                    </div>
                    <div className="grid1-fav dimension-grid">
                        <div className="galleryView">
                            <div className="galleryContainer">
                                <div className="leftView">
                                    <img alt="image entre d'avant" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${entreFav[imgAvantEntre].image}`} />
                                </div>
                                <button aria-label="btn-nav-left" className="navLeft navBtns" onClick={scrollLeftEntre}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path className="svg" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512s256-114.6 256-256zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/>
                                    </svg>
                                </button>
                                <NavLink aria-label="btn-chemin-entre" className="linkTag" to={"/detailsRecette/" + entreFav[imgActuelEntre].id}>
                                    <div className="mainView">
                                        <img alt="image entre actuel" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${entreFav[imgActuelEntre].image}`} />
                                        <h2 className="hover-fav">{entreFav[imgActuelEntre].titre}</h2>
                                    </div>
                                </NavLink>
                                <div className="rightView">
                                    <img alt="image entre d'apres" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${entreFav[imgApresEntre].image}`} />
                                </div>
                                <button aria-label="btn-nav-right" className="navRight navBtns" onClick={scrollRightEntre}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path className="svg" d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid4 txt-grid">
                        <h3 className="responsive-size-grid">Les Plats:</h3>
                    </div>
                    <div className="grid4-fav dimension-grid">
                        <div className="galleryView">
                            <div className="galleryContainer">
                                <div className="leftView">
                                    <img alt="image plat d'avant" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${platFav[imgAvantPlat].image}`} />
                                </div>
                                <button aria-label="btn-nav-left" className="navLeft navBtns" onClick={scrollLeftPlat}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path className="svg" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512s256-114.6 256-256zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/>
                                    </svg>
                                </button>
                                <NavLink aria-label="btn-chemin-plat" className="linkTag" to={"/detailsRecette/" + platFav[imgActuelPlat].id}>
                                    <div className="mainView">
                                        <img alt="image plat actuel" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${platFav[imgActuelPlat].image}`} />
                                        <h2 className="hover-fav">{platFav[imgActuelPlat].titre}</h2>
                                    </div>
                                </NavLink>
                                <div className="rightView">
                                    <img alt="image plat d'apres" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${platFav[imgApresPlat].image}`} />
                                </div>
                                <button aria-label="btn-nav-right" className="navRight navBtns" onClick={scrollRightPlat}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path className="svg" d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid7 txt-grid">
                        <h3 className="responsive-size-grid">Les Desserts:</h3>
                    </div>
                    <div className="grid7-fav dimension-grid">
                        
                        <div className="galleryView">
                            <div className="galleryContainer">
                                <div className="leftView">
                                    <img alt="image dessert d'avant" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${dessertFav[imgAvantDessert].image}`} />
                                </div>
                                <button aria-label="btn-nav-left" className="navLeft navBtns" onClick={scrollLeftDessert}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path className="svg" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512s256-114.6 256-256zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/>
                                    </svg>
                                </button>
                                <NavLink aria-label="btn-chemin-dessert" className="linkTag" to={"/detailsRecette/" + dessertFav[imgActuelDessert].id}>
                                    <div className="mainView">
                                        <img alt="image dessert actuel" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${dessertFav[imgActuelDessert].image}`} />
                                        <h2 className="hover-fav">{dessertFav[imgActuelDessert].titre}</h2>
                                    </div>
                                </NavLink>
                                <div className="rightView">
                                    <img alt="image deesert d'apres" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${dessertFav[imgApresDessert].image}`} />
                                </div>
                                <button aria-label="btn-nav-right" className="navRight navBtns" onClick={scrollRightDessert}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path className="svg" d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </section>
            : !state.logUser & recette.length > 1 ?
                <section className="container grid-context">
                    <h2  className="grid_titre txt-grid">Les Coups de Coeur..</h2>
                    <div className="grid1 txt-grid">
                        <h3 className="responsive-size-grid">Les Entrées:</h3>
                    </div>
                    <div className="grid2 dimension-grid">
                        <img alt="image premiere entre" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${recette[0].image}`}/>
                        <NavLink className="txt-grid hover" to={"/detailsRecette/" + recette[0].id}>{Majuscule(recette[0].titre)}</NavLink>
                    </div>
                    <div className="grid3 dimension-grid">
                        <img alt="image deuxieme entre" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${recette[1].image}`}/>
                        <NavLink className="txt-grid hover" to={"/detailsRecette/" + recette[1].id}>{Majuscule(recette[1].titre)}</NavLink>
                    </div>
                    <div className="grid4 txt-grid">
                        <h3 className="responsive-size-grid">Les Plats:</h3>
                    </div>
                    <div className="grid5 dimension-grid">
                        <img alt="image premier plat" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${recette[2].image}`}/>
                        <NavLink className="txt-grid hover" to={"/detailsRecette/" + recette[2].id}>{Majuscule(recette[2].titre)}</NavLink>
                    </div>
                    <div className="grid6 dimension-grid">
                        <img alt="image deuxieme plat" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${recette[3].image}`}/>
                        <NavLink className="txt-grid hover" to={"/detailsRecette/" + recette[3].id}>{Majuscule(recette[3].titre)}</NavLink>
                    </div>
                    <div className="grid7 txt-grid">
                        <h3 className="responsive-size-grid">Les Desserts:</h3>
                    </div>
                    <div className="grid8 dimension-grid">
                        <img alt="image premier dessert" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${recette[4].image}`}/>
                        <NavLink className="txt-grid hover" to={"/detailsRecette/" + recette[4].id}>{Majuscule(recette[4].titre)}</NavLink>
                    </div>
                    <div className="grid9 dimension-grid">
                        <img alt="image deuxieme dessert" className="img-favoris" src={`${BASE_IMG}/img_Recettes/${recette[5].image}`}/>
                        <NavLink className="txt-grid hover" to={"/detailsRecette/" + recette[5].id}>{Majuscule(recette[5].titre)}</NavLink>
                    </div>
                </section>
            :
                <React.Fragment></React.Fragment>
            }
        </React.Fragment>
    )
}

export default Home