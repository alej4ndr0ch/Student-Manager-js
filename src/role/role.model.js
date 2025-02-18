import { Schema, model } from "mongoose";

const RoleSchema = Schema({
    role: {
        type: String,
        required: [ true, "El role es obligatorio" ],
        enum: {
            values: ["STUDENT_ROLE", "TEACHER_ROLE"],
        }
    }
});

export default model('Role', RoleSchema);