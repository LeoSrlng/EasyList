import express from "express"

import { commonHomeController, userHomeController } from '../controllers/home.js'
import recettesController from '../controllers/recettes.js'
import { detailsRecetteController, likeRecetteController, dislikeRecetteController } from '../controllers/detailsRecette.js'
import isLogged from '../controllers/isLogged.js'
import registerSUBController from '../controllers/register.js'
import connectSUBController from '../controllers/connect.js'
import { adminController, deleteRecetteController} from '../controllers/admin.js'
import { addRecetteController, verifAddRecetteController, removeDoublon } from '../controllers/addRecette.js'
import { editRecetteController, showEditRecetteController } from '../controllers/editRecette.js'
import { suggRecetteController, verifSuggRecetteController} from '../controllers/suggestion.js'
import showsuggRecetteController from "../controllers/showSuggestion.js"
import { editSuggestionsController, showEditSuggestionsController } from '../controllers/editSuggestions.js'

const router = express.Router()

router.get('/api/commonhome', commonHomeController)
router.get('/api/userhome', userHomeController)

router.get('/api/test', removeDoublon)

router.post('/api/register', registerSUBController)

router.post('/api/connect', connectSUBController)

router.post('/api/isLogged', isLogged)

router.get('/api/recettes', recettesController)

router.post('/api/suggRecette', suggRecetteController)
router.get('/api/verifSuggRecette', verifSuggRecetteController)

router.get('/api/showSuggRecette', showsuggRecetteController)

router.get('/api/detailsRecette/:id', detailsRecetteController)
router.post('/api/likeRecette/:id', likeRecetteController)
router.post('/api/dislikeRecette/:id', dislikeRecetteController)

router.get('/api/admin', adminController)
router.post('/api/deleteRecette', deleteRecetteController)

router.get('/api/showEditRecette/:id', showEditRecetteController)
router.post('/api/editRecette/:id', editRecetteController)

router.post('/api/addRecette', addRecetteController)
router.get('/api/verifAddRecette', verifAddRecetteController)

router.get('/api/showEditSuggestions/:id', showEditSuggestionsController)
router.post('/api/editSuggestions/:id', editSuggestionsController)

export default router