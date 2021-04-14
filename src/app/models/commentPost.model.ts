import { User } from "../user.model";
import { CommunityPost } from "./comunityPost.model";

export class CommentPost{

    comunityPost? : CommunityPost
    createdAt?: string
    descripcion? : string
    id?: number
    stateComment?: string
    user?: User
}