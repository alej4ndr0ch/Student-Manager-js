import { Router } from "express";
import { check } from "express-validator";
import { register, getCoursesByTeacher, updateCourse, deleteCourse, assignStudentToCourse, getStudentCourses } from "./courses.controller.js";
import { existeCursoById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarTeacherJWT, validarStudentJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/register',
    [
        validarTeacherJWT,
        check('name', 'El nombre del curso es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatoria').not().isEmpty(),
        validarCampos
    ],
    register
);

router.get(
    '/',
    validarTeacherJWT,
    getCoursesByTeacher
);

router.put(
    '/:id',
    [
        validarTeacherJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCursoById),
        check('name', 'El nombre del curso es obligatorio').optional().not().isEmpty(),
        check('description', 'La descripción es obligatoria').optional().not().isEmpty(),
        validarCampos
    ],
    updateCourse
);

router.delete(
    '/:id',
    [
        validarTeacherJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCursoById),
        validarCampos
    ],
    deleteCourse
);

router.post(
    '/assign',
    [
        validarStudentJWT,
        check('courseId', 'No es un ID válido').isMongoId(),
        check('courseId').custom(existeCursoById),
        validarCampos
    ],
    assignStudentToCourse
);

router.get(
    '/student',
    validarStudentJWT,
    getStudentCourses
);

export default router;
