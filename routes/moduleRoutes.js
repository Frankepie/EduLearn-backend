const express =
  require("express");

const router =
  express.Router();


const {
  createModule,
  getCourseModules,
  updateModule,
  deleteModule
} =
  require(
    "../controllers/moduleController"
  );


const protect =
  require(
    "../middleware/authMiddleware"
  );


const instructorOnly =
  require(
    "../middleware/instructorMiddleware"
  );


/*
  GET COURSE MODULES

  GET /api/modules/course/:courseId
*/

router.get(
  "/course/:courseId",
  protect,
  getCourseModules
);


/*
  CREATE MODULE

  POST /api/modules
*/

router.post(
  "/",
  protect,
  instructorOnly,
  createModule
);


/*
  UPDATE MODULE

  PUT /api/modules/:id
*/

router.put(
  "/:id",
  protect,
  instructorOnly,
  updateModule
);


/*
  DELETE MODULE

  DELETE /api/modules/:id
*/

router.delete(
  "/:id",
  protect,
  instructorOnly,
  deleteModule
);


module.exports =
  router;