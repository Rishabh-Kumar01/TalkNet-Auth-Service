const {express} = require('../../utils/imports.util');
const authRoutes = require('./auth.route');

const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;
