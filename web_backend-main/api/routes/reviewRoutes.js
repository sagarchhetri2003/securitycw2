// const reviewController = require("../controllers/review.controller");
// const { verifyUser } = require("../middlewares/authMiddlerware");

// const router = require("express").Router()

// router.post('/', verifyUser, reviewController.addUpdateReview)

// router.get('/:product', reviewController.getProductReviews)


// module.exports = router


const reviewController = require("../controllers/review.controller");
const { verifyUser } = require("../middlewares/authMiddlerware");

const router = require("express").Router()

router.post('/', verifyUser, reviewController.addUpdateReview)

router.get('/:property', reviewController.getPropertyReviews)


module.exports = router