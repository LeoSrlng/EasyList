import Home from "../Home.jsx";
import Recettes from "../Recettes.jsx";
import DetailsRecette from "../DetailsRecette.jsx";
import SuggestionRecettes from "../SuggestionRecettes.jsx";
import Loggin from "../Loggin/Loggin.jsx";
import Deco from "../Loggin/Deco.jsx";
import Admin from "../Admin.jsx";
import AddRecette from "../AddRecette.jsx";
import ShowEditRecette from "../EditRecette.jsx";
import ShowSuggestions from "../showSuggestions.jsx";
import ShowDetailSuggestions from "../showDetailSuggestions.jsx";
import Erreur from "../Erreur.jsx";

export const routes = [
    { path:'/', element:<Home /> },
    { path:'/recettes', element:<Recettes /> },
    { path:'/detailsRecette/:postId', element:<DetailsRecette /> },
    { path:'/suggestionRecettes', element:<SuggestionRecettes /> },
    { path:'/loggin', element:<Loggin /> },
    { path:'/deco', element:<Deco /> },
    { path:'/admin', element:<Admin /> },
    { path:'/addRecette', element:<AddRecette /> },
    { path:'/showEditRecette/:postId', element:<ShowEditRecette /> },
    { path:'/showSuggestions', element:<ShowSuggestions /> },
    { path:'/showDetailSuggestions/:postId', element:<ShowDetailSuggestions /> },
    { path:'/*', element:<Erreur /> }
]

// route reservé aux personnes connecter
export const userPath = [
    "/deco", '/suggestionRecettes'
]

// route resservé aux personnes connecter en admin
export const adminPath = [
    "/admin", '/addRecette', "/showEditRecette/:postId"
]