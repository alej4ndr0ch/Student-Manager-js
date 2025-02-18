import Course from './courses.model.js';
import Teacher from '../teachers/teacher.model.js';
import Student from '../students/student.model.js';
import { response, request } from 'express';


export const register = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (req.teacher.role !== 'TEACHER_ROLE') {
            return res.status(403).json({ 
                msg: 'Solo los maestros pueden crear cursos' 
            });
        }

        const newCourse = await Course.create({
            name,
            description,
            teacher: req.teacher._id,
        });

        return res.status(201).json({
            msg: 'Curso creado exitosamente',
            course: newCourse
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            msg: 'Error al crear curso',
            error 
        });
    }
};


export const getCoursesByTeacher = async (req = request, res = response) => {
    try {
        const courses = await Course.find({ teacher: req.teacher._id });
        return res.status(200).json({ 
            success: true, 
            courses 
        });
    } catch (error) {
        return res.status(500).json({ 
            msg: 'Error, no se ha podido listar los cursos', 
            error 
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(403).json({
                 msg: 'No estas autorizado para actualizar el curso' 
            });
        }

        course.name = name || course.name;
        course.description = description || course.description;
        await course.save();

        return res.status(200).json({ 
            msg: 'El curso se ha actualizado correctamente', 
            course 
        });
    } catch (error) {
        return res.status(500).json({ 
            msg: 'Error, no se ha podido actualizar el curso', 
            error 
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course || course.teacher.toString() !== req.teacher._id.toString()) {
            return res.status(403).json({ 
                msg: 'No estas autorizado para eliminar un curso' 
            });
        }

        await Student.updateMany({ courses: id }, 
        { $pull: { courses: id } });
        await Course.findByIdAndDelete(id);

        return res.status(200).json({ 
            msg: 'El curso ha sido eliminado correctamente' 
        });
    } catch (error) {
        res.status(500).json({ 
            msg: 'Error, no se ha podido eliminar el curso', 
            error 
        });
    }
};


export const assignStudentToCourse = async (req, res) => {
    try {
        if (!req.student || req.student.role !== 'STUDENT_ROLE') {
            return res.status(403).json({ 
                msg: 'Solo los estudiantes pueden asignarse a cursos' 
            });
        }

        const { courseId } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ 
                msg: 'Curso no encontrado' 
            });
        }

        const student = await Student.findById(req.student._id);
        if (!student) {
            return res.status(404).json({ msg: 'Estudiante no encontrado' });
        }

        if (!Array.isArray(student.courses)) {
            student.courses = [];
        }

        if (!Array.isArray(course.students)) {
            course.students = [];
        }

        if (course.students.includes(student._id)) {
            return res.status(400).json({ 
                msg: 'Ya estás asignado a este curso' 
            });
        }

        if (student.courses.length >= 3) {
            return res.status(400).json({
                msg: 'Solo puedes estar en un máximo de 3 cursos' 
            });
        }

        course.students.push(student._id);
        await course.save();

        student.courses.push(course._id);
        await student.save();

        return res.status(200).json({ 
            msg: 'Estudiante asignado al curso correctamente', 
            course 
        });
    } catch (error) {
        return res.status(500).json({ 
            msg: "Error, no se pudo asignar estudiante", 
            error: error.message 
        });
    }
};


export const getStudentCourses = async (req, res) => {
    try {
        if (req.student.role !== 'STUDENT_ROLE') {
            return res.status(403).json({
                msg: 'No esta autorizado poder editarlo' 
            });
        }

        const student = await Student.findById(req.student._id).populate('courses');
        
        return res.status(200).json({ 
            success: true, 
            courses: student.courses 
        });
    } catch (error) {
        res.status(500).json({ 
            msg: 'Error al obtener cursos', 
            error 
        });
    }
};
