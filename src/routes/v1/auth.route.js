const {express} = require('../../utils/imports.util');
const { AuthController } = require('../../controllers/index.controller');
const { AuthMiddleware } = require('../../middlewares/index.middleware');

const router = express.Router();
const authController = new AuthController();

router.post('/signup', 
    AuthMiddleware.validateSignupData,
    authController.signup.bind(authController)
);
  
router.post('/login', 
    AuthMiddleware.validateLoginData,
    authController.login.bind(authController)
);
router.get('/google', AuthMiddleware.googleAuth);
router.get('/google/callback', AuthMiddleware.googleAuth, authController.googleCallback.bind(authController));
router.get('/facebook', AuthMiddleware.facebookAuth);
router.get('/facebook/callback', AuthMiddleware.facebookAuth, authController.facebookCallback.bind(authController));

module.exports = router;