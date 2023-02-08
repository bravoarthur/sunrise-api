import { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import Auth from "../middlewares/Auth";
import AuthValidator from "../validators/AuthValidator";
/*import AdsController from "../controllers/AdsController";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import Auth from "../middlewares/Auth";
import AuthValidator from "../validators/AuthValidator";
import UserValidator from "../validators/UserValidator";*/

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
    res.json({ pong: true });
});

//USER //////////////////////////////////////////
router.get('/user/list', UserController.userList)
router.post('/user/login', AuthValidator.signin, AuthController.signin)
router.post('/user/register', AuthValidator.signup, AuthController.signup)
router.delete('/user/delete', Auth.private, UserController.userDelete )

//CATEGORY /////////////////////////////////////
router.get('/category/list')
router.post('/category/add') // auth
router.delete('./category/delete') //auth

//SUPLIER /////////////////////////////////////
router.get('/suplier/list')
router.post('/suplier/add') // auth
router.delete('./suplier/delete') //auth

//PRODUCTS ////////////////////////////////////
router.get('/products/list')
router.post('/products/add') // auth
router.delete('./products/delete') //auth

// ORDER /////////////////////////////////////
router.get('/order/list')
router.post('/order/add') // auth
router.post('/order/check')
router.put('./order/delete') //auth

/*
router.get("/states", UserController.getStates);

router.post("/user/signin", AuthValidator.signin, AuthController.signin); //login
router.post("/user/signup", AuthValidator.signup, AuthController.signup); //register

router.get("/user/me", Auth.private, UserController.info); //user info
router.put(
    "/user/me",
    UserValidator.editAction,
    Auth.private,
    UserController.editAction
);

router.get("/categories", AdsController.getCategories); //ads CRUD
router.post("/ad/add", Auth.private, AdsController.addAction);
router.get("/ad/list", AdsController.getList);
router.get("/ad/item", AdsController.getItem);

router.post("/ad/:id", Auth.private, AdsController.editAction);
*/
export default router;
