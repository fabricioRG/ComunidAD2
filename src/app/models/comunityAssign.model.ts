import { User } from "../user.model";
import { Comunity } from "./comunity.model";
import { IdComunityAssign } from "./idComunityAssign.model";

export class ComunityAssign{

    idComunityAssign? : IdComunityAssign;
    user? : User;
    comunity? : Comunity;
    tipo? : string;
    fecha_decision? : string;
    estado? : string;
    fechaCreacion? : string;
   
}