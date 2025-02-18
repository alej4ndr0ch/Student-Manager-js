import { Schema, model } from "mongoose"

const CoursesSchema = Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String,
        required : true
    },
    teacher: { 
        type: Schema.Types.ObjectId, 
        ref: 'Teacher', 
        required: true 
    },
    students: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Student' 
    }]
}, {
    timestamps: true,
    versionKey: false
})

CoursesSchema.methods.toJSON = function () {
    const { __v, password, _id, ...courses } = this.toObject();
    courses.uid = _id;
    return courses;
}

export default model('Courses', CoursesSchema);