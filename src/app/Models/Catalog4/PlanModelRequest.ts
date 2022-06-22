import { PlanPositionModel } from "./PlanPositionModel";

export class EvaluatePlanRequest{
    constructor(
        public	_muni_id            : number,
        public	_startDate          : String,
        public	_endDate            : String,
        public	_controlRecomend    : String,
        public	_riesgo             : String,
        public	_matrixa_id         : number,
        public	_priority_name      : String,
        public _positions           : PlanPositionModel[],
        //apartir de aca no son necesarios
        public _message             : string,
        public _opcionDML           : number,
    ){

    }
}