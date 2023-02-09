import { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import CategoryController from "../controllers/CategoryController";
import OrderController from "../controllers/OrderController";
import ProductsController from "../controllers/ProductsController";
import SuplierController from "../controllers/SuplierController";
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
router.get('/category/list', CategoryController.categoryList)
router.post('/category/add', Auth.private, CategoryController.addCategory) // auth
router.delete('/category/delete', Auth.private, CategoryController.categoryDelete) //auth

//SUPLIER /////////////////////////////////////
router.get('/suplier/list', SuplierController.suplierList)
router.post('/suplier/add', Auth.private, SuplierController.addSuplier) // auth
router.delete('/suplier/delete', Auth.private, SuplierController.suplierDelete) //auth

//PRODUCTS ////////////////////////////////////
router.get('/products/list', ProductsController.productsList)
router.post('/products/add', Auth.private, ProductsController.addProduct) // auth
router.delete('/products/delete', Auth.private, ProductsController.productDelete) //auth

// ORDER /////////////////////////////////////
router.get('/order/list', OrderController.orderList)
router.get('/order/item/:id', OrderController.orderItem)
router.post('/order/add', Auth.private, OrderController.addOrder) // auth
router.post('/order/check', OrderController.addCheck)
router.put('/order/finish',Auth.private, OrderController.finish ) //auth


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
