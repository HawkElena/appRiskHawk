export class RiskToleranceModel{
    constructor(
        public muni_id                  : number    =   0,
        public id                       : number    =   0,
        public description              : string    =   "",
        public min                      : number    =   0,
        public max                      : number    =   0,
        public criteria                 : string    =   "",
        public priority_id              : number    =   0,
        public _opcionDML               : number    =   0,
        public _message                 : string    =   "",  
    ){

    }

}
