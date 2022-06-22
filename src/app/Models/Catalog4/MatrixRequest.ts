export class EvaluateMatrixRequest{
    constructor(
        public _muni_id                 : number    =   0,
        public _id                      : number    =   0,
        public _prob_id                 : number    =   0,
        public _sever_id                : number    =   0,
        public _event_desc              : String    =   "",
        public _area_name               : String    =   "",
        public _group_name              : String    =   "",
        public _prob_puntaje            : number    =   0, 
        public _sever_puntaje           : number    =   0,
    ){

    }
}
