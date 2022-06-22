export class MatrixModel {

    constructor(
        public muni_id                  : number,
        public id                       : number,
        public event_id                 : number,
        public descriptionRisk          : string,
        public probId                   : number,
        public severId                  : number,
        //this atribute may be is calculated but doest not need enter any value directly in the interface
        public inherentRisk             : number,
        //	this atribute definitly doest not need enter any value directly in the interface
        public calcResidualRisk         : number,
        public toleranceId              : number,
        public internalContollMitigate  : String,
        public riskRemarks              : String,
        //apartir de aca no son necesarios
        public _group_id                    : string,
        public _group_name                  : string,
        public _area_id                     : string,
        public _area_evaluate_name          : string,
        public _event_description           : string,
        public _probabilidad                : number,
        public _severity                    : number,
        public _valor_mitigador             : string,
        public _riesgo_residual             : string,
        public _risk_tolerance_criteria     : string,
        public _message                     : string,
        public _opcionDML                   : number,
        public _selected                    : number,
    ){
        this.muni_id                    =0;
        this.id                         =0;
        this.event_id                    =0;
        this.descriptionRisk            ='';
        this.probId                     =0;
        this.severId                    =0;
        //this atribute may be is calculated but doest not need enter any value directly in the interface
        this.inherentRisk               =0;
        //	this atribute definitly doest not need enter any value directly in the interface
        this.calcResidualRisk           =0;
        this.toleranceId                =0;
        this.internalContollMitigate    ='';
        this.riskRemarks                ='';
        //apartir de aca no son necesarios
        this._group_id                  ='';
        this._group_name                ='';
        this._area_id                   ='';
        this._area_evaluate_name        ='';
        this._event_description         ='';
        this._probabilidad              =0;
        this._severity                  =0;
        this._valor_mitigador           ='';
        this._riesgo_residual           ='';
        this._risk_tolerance_criteria   ='';
        this._message                   ='';
        this._opcionDML                 = 0;
        this._selected                  = 0;
    }
}