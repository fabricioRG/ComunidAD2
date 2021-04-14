import { User } from "../user.model";
import { CommentPost } from "./commentPost.model";
import { Comunity } from "./comunity.model";

export class CommunityPost {

    id?: number;
    comunity?: Comunity;
    user?: User;
    title?: string;
    message?: string;
    photo?: string;
    state?: string;
    rated?: number;
    createdAt?: string;
    modifiedAt?: string;
    datosFoto?:any;
    commentPost?: CommentPost[]
    nuevoComentario?: string;
    caracteresDeComentario?:number
    valoration?:string;

}