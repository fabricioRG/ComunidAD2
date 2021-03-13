import { User } from "../user.model";
import { Course } from "./course.model";

export class Comunity {
    id?: string;
    course?: Course;
    user?: User;
    nombre?: string;
    descripcion?: string;
}