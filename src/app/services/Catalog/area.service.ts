import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AreaModel } from 'src/app/Models/Catalog2/AreaModel';
import { GLOBAL } from '../global.service';
import { UserAuthService } from '../user-auth-service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
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
getGroupList(areaM: AreaModel): Observable<any> {
    this.metodo = "AreaEvaluacion/areaEvaluacionDML";
    let body = JSON.stringify(areaM);
    this.url = GLOBAL.url_hawkRisk+this.metodo;
    console.log('esta es la variable token = ' + this.userauthService.getToken())
    return this.http.post(this.url, body, this.httpOptions);
    // return this.httpClient.post(GLOBAL.url_hawkspital + 'auth/iniciarSesion',JSON.stringify(loginData), {headers: this.requestHeader} );
}
getGroupListNoPromise(areaM: AreaModel): Observable<any> {
    this.metodo = "AreaEvaluacion/areaEvaluacionDML";    
    let body = JSON.stringify(areaM);
    this.url = GLOBAL.url_hawkRisk+this.metodo;
    return this.http.post(this.url, body, this.httpOptions).pipe(map(Response  => Response));

}}