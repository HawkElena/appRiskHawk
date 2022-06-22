import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormControl, Validators,} from '@angular/forms';
import { Router } from '@angular/router';
import { faLock, faOutdent, faSignOut } from '@fortawesome/free-solid-svg-icons';

import { of } from 'rxjs';
import { UserAuthService } from 'src/app/services/user-auth-service';

// import { faLock } from '@fortawesome/free-solid-svg-icons';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public falock = faLock;
  public newUser = false;
  public dataJson ={
    "usernameOrEmail": ''
    ,"password": ''
  };

  submitted = false;
  errorMessage = '';
  isLoggedin:boolean = false;
  isLoginFailed = false;

  loginForm!: FormGroup;
  
  public formErrors: FormErrors = {
    'email': '',
    'password': '',
  };
  
  public RolUserSigned = {
    "RolUserId":0
    ,"RolUserName": ""
  };

  public loading :boolean = false;
  
  constructor(public userauthService: UserAuthService,private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
  });
  }

    // Simple Login
    login() {
    
      if(this.loginForm.valid==true){
        //alert("algo");
        this.loading=false;
        this.dataJson.usernameOrEmail = this.loginForm.controls["userName"].value;
        this.dataJson.password = this.loginForm.controls["password"].value;
              
        // this.userauthService.login(this.dataJson).subscribe((Response) => {
        //   this.isLoggedin= true;
        //   this.router.navigate(['/home']);
        //   this.loading=true;
        //   console.log(Response);
        // },
        // (error)=>{
        //   this.loading=false;
        //   this.isLoggedin= false;      
        //   console.log(error);
        // });
  
        of(this.userauthService.login(this.dataJson).subscribe({
          next: (Reponse: any) => {
            console.log(Reponse)
            this.isLoggedin = true;
            this.router.navigate(['/home']);
            this.loading = true;
            //this.userauthService.setRoles(Reponse.idRolUser);
            this.userauthService.setToken(Reponse.accessToken);

            this.RolUserSigned.RolUserId = Reponse.rolUserId;
            this.RolUserSigned.RolUserName = Reponse.rolUser;

            this.userauthService.setRoles(this.RolUserSigned);
            
            const role = Reponse.rolUserId;
            if (role === 1) {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/user']);
            }
            
          },
          error: (e:any ) => {
              if(e.status == 500){
                alert("Credenciales invalidas...")
              }
          },
          complete: () => {
            this.loading = false}
        })//fin del susbcribe
        );//fin del of        
      }
      
    // show global variable like "port"
  
  
      // this.authService.SignIn(this.loginForm.value['email'], this.loginForm.value['password']);
    }
}
