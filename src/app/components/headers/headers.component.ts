import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { GLOBAL } from 'src/app/services/global.service';
import { UserAuthService } from 'src/app/services/user-auth-service';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  public faSignIn = faSignIn;
  public faSignOut= faSignOut;
  public tituloApp : string = GLOBAL.strNameCompany;
  constructor(
              private UserAuthService: UserAuthService, 
              private router:Router) { }

  ngOnInit(): void {
  }

  public isLoggedIn(){
    return this.UserAuthService.isLoggedIn();
  }

  public logout(){
     this.UserAuthService.clear();
    //this.router.navigate(['/home']);
  }
}
