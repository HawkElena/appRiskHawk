import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { GLOBAL } from "./global.service";

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    requestHeader = new HttpHeaders(
        {
            "No-Auth": "True"
            , "Content-Type": "application/json; charset=utf-8"
        }
    );
    constructor(private httpClient: HttpClient) { }

    public setRoles(roles: any) {
        localStorage.setItem("roles", JSON.stringify(roles));

    }

    public getRoles(): [] {
        var formatoJson: any = "";
        formatoJson = localStorage.getItem("roles");
        return JSON.parse(formatoJson);
    }

    public setToken(jwtToken: string) {
        localStorage.setItem("jwtToken", jwtToken);
    }

    public getToken(): any {
        return localStorage.getItem("jwtToken");
    }
    public clear() {
        localStorage.clear();

    }

    public isLoggedIn() {

        // if (localStorage.getItem('currentUser') == null) {
        //     this._user.authlogeado = false;
        //     localStorage.setItem('currentUser', JSON.stringify(this._user));
        //   }
        //   return this._user.authlogeado;

        return this.getRoles() && this.getToken();
    }

    public login(loginData: any) {
        console.log(GLOBAL.url_hawkRisk);
        return this.httpClient.post(GLOBAL.url_hawkRisk + 'auth/iniciarSesion', JSON.stringify(loginData), { headers: this.requestHeader });
    }
}
