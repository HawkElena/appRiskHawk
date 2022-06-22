import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AreaModel } from 'src/app/Models/Catalog2/AreaModel';
import { EventModel } from 'src/app/Models/Catalog3/EventModel';
import { GroupModel } from 'src/app/Models/Catalog1/GroupModel';
import { GLOBAL } from '../global.service';
import { UserAuthService } from '../user-auth-service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  public url!: string;
  public metodo!: string;

  constructor(private http: HttpClient,public userauthService: UserAuthService) {
    console.log('cargando nuestro servicio');
}

private httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8"
        , 'Access-Control-Allow-Origin': '*'
        , 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD' 
        , 'Authorization': 'Bearer ' +  this.userauthService.getToken()
    })
}

getListCatalog(objetoM: any,nameCatalog:String):Observable<any>{
    let body = JSON.stringify(objetoM);
    
    switch (nameCatalog) {
        case "GrupoServicio":
            this.metodo = "GroupArea/groupAreaDML";
            // let grpModel = new GroupModel(0, 0, "", 0, "");
            // grpModel = objetoM;
            // grpModel.muni_id = GLOBAL.muni;
            // body = JSON.stringify(grpModel);
            break;

        case "AreaServicio":
            this.metodo = "AreaEvaluacion/areaEvaluacionDML";
            // let areaModel = new AreaModel(0, 0, "", 0, 0, "");
            // areaModel = objetoM;
            // areaModel.muni_id = GLOBAL.muni;
            // body = JSON.stringify(areaModel);
            break;
        case "EventoServicio":
            this.metodo = "Event/eventDML";
            // let eventModel = new EventModel(0, 0, "", 0, 0, "");
            // eventModel = objetoM;
            // eventModel.muni_id = GLOBAL.muni;
            // body = JSON.stringify(eventModel);
            break;
        case "ProbabilidadServicio":
            this.metodo = "Probability/probabilityDML";
            // let eventModel = new EventModel(0, 0, "", 0, 0, "");
            // eventModel = objetoM;
            // eventModel.muni_id = GLOBAL.muni;
            // body = JSON.stringify(eventModel);
            break;
        case "SeveridadServicio":
            this.metodo = "Severity/severityDML";
            // let eventModel = new EventModel(0, 0, "", 0, 0, "");
            // eventModel = objetoM;
            // eventModel.muni_id = GLOBAL.muni;
            // body = JSON.stringify(eventModel);
            break;
        case "RiskToleranceServicio":
            this.metodo = "RiskTolerance/riskToleranceDML";
            break;
        case "PriorityServicio":
            this.metodo ="Priority/priorityDML";
            break;
        case "PositionServicio":
            this.metodo ="Position/positionDML";
            break;
        default:
            break;
    }
    this.url = GLOBAL.url_hawkRisk + this.metodo;
    return this.http.post(this.url, body, this.httpOptions);

}

// getGroupList(groupArea: GroupModel): Observable<any> {
//     this.metodo = "GroupArea/groupAreaDML";
//     let body = JSON.stringify(groupArea);
//     this.url = GLOBAL.url_hawkRisk+this.metodo;
//     console.log('esta es la variable token = ' + this.userauthService.getToken())
//     return this.http.post(this.url, body, this.httpOptions);
//     // return this.httpClient.post(GLOBAL.url_hawkspital + 'auth/iniciarSesion',JSON.stringify(loginData), {headers: this.requestHeader} );
// }
getGroupListNoPromise(groupArea: GroupModel): Observable<any> {
    this.metodo = "GroupArea/groupAreaDML";    
    let body = JSON.stringify(groupArea);
    this.url = GLOBAL.url_hawkRisk+this.metodo;
    return this.http.post(this.url, body, this.httpOptions).pipe(map(Response  => Response));

}
}