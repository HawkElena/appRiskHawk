import { PositionModal } from "../Catalog1/PositionModal";

export class PlanModel {

    constructor(
        public muni_id              : number,
        public id                   : number,
        public recomendations       : string,
        public implement_control    : string,
        public priority_id          : number,
        public startdate            : String,
        public enddate              : String,
        public remarks              : String,
        //apartir de aca no son necesarios
        public positions            : [{muni_id:number,resp_position_id:number,evaluation_plan_id:number}],
        public matrix_id            : number,
        public _priority_name       : String,
        public _matrix              : String,
        public _riesgo_residual     : number,
        public _message             : string,
        public _opcionDML           : number,
    ){
        this.muni_id                    =0;
        this.id                         =0;
        this.recomendations       = "";
        this.implement_control    = "";
        this.priority_id          = 0;
        this.startdate            = "";
        this.enddate              = "";
        this.remarks              = "";
        //apartir de aca no son necesarios
        this.matrix_id             = 0;
        this._message                   ='';
        this._opcionDML                 =0;
        this.positions              =[{muni_id:0,resp_position_id:0,evaluation_plan_id:0}];
        // this._matrix               =    '';
    }
}