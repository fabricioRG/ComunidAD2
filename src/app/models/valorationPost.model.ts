import { User } from "../user.model";
import { CommunityPost } from "./comunityPost.model";

export class ValorationPost{

    id?:number;
    communityPost? : CommunityPost
    user? : User;
    valoration? : string;
}