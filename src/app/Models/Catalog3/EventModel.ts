export class EventModel {

    constructor(
        public muni_id                  : number    =   0,
        public id                       : number    =   0,
        public name                     : string    =   "",
        public evaluate_id              : number    =   0,
        public _opcionDML               : number    =   0,
        public _message                 : string    =   "",        
    )
    {
        // this.muni_id                    =   0;
        // this.id                         =   0;
        // this.name                       =   "";
        // this._opcionDML                 =   0;
        // this._message                   =   "";
    }
}