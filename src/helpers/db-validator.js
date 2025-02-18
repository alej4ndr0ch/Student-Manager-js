import Student from '../students/student.model.js';
import Teacher from '../teachers/teacher.model.js';
import Curso from '../courses/courses.model.js';

export const existenteEmailStudent = async (email = ' ') => {

    const existeEmail = await Student.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existenteEmailTeacher = async (email = ' ') => {

    const existeEmail = await Teacher.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeTeacherById = async (id = '') => {
    
    const existeTeacher = await Teacher.findById(id);

    if (!existeTeacher) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeCursoById = async (id = '') => {
    
    const existeCurso = await Curso.findById(id);

    if (!existeCurso) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeStudentById = async (id = '') => {
    
    const existeStudent = await Student.findById(id);

    if (!existeStudent) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}