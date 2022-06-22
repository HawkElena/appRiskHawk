import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MatrixModel } from '../Models/Catalog4/MatrixModel';
import { GLOBAL } from './global.service';
import { UserAuthService } from './user-auth-service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
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
getMatrixList(matrix: any,esBusqueda: boolean): Observable<any> {
    switch (esBusqueda) {
        case true:
            this.metodo = "ListarEvaluationMatrix/listarEvaluationMatrix";        
            break;
        case false:
            this.metodo = "ListarEvaluationMatrix/EvaluationMatrixDML";
            break;
        default:
            break;
    }
    
    let body = JSON.stringify(matrix);
    this.url = GLOBAL.url_hawkRisk+this.metodo;
    console.log('esta es la variable token = ' + this.userauthService.getToken())
    return this.http.post(this.url, body, this.httpOptions);
    // return this.httpClient.post(GLOBAL.url_hawkspital + 'auth/iniciarSesion',JSON.stringify(loginData), {headers: this.requestHeader} );
}

getPlanList(plan: any,esBusqueda: boolean): Observable<any> {
    switch (esBusqueda) {
        case true:
            this.metodo = "ListarEvaluationPlan/listarEvaluationPlan";        
            break;
        case false:
            this.metodo = "ListarEvaluationPlan/EvaluationPlanDML";
            break;
        default:
            break;
    }
    
    let body = JSON.stringify(plan);
    this.url = GLOBAL.url_hawkRisk+this.metodo;
    console.log('esta es la variable token = ' + this.userauthService.getToken())
    return this.http.post(this.url, body, this.httpOptions);
    // return this.httpClient.post(GLOBAL.url_hawkspital + 'auth/iniciarSesion',JSON.stringify(loginData), {headers: this.requestHeader} );
}

getMatrixNoPromise(matrix: MatrixModel): Observable<any> {
    this.metodo = "ListarEvaluationMatrix/listarEvaluationMatrix";
    
    let body = JSON.stringify(matrix);
    this.url = GLOBAL.url_hawkRisk+this.metodo;
    return this.http.post(this.url, body, this.httpOptions).pipe(map(Response  => Response));

}}
