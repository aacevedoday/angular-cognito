/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc login component file contians the angular reactive forms instead of template driven forms
 * and authentication functionality
 */
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
// Injecting services
import { AuthService } from "../../shared/services";
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/index';

declare var $: any;

@Component({
  selector: "app-login",
  styleUrls: ["./login.component.scss"],
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public groupAllow: String;
  public forgotPasswordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    public cookieService: CookieService,
    private user:User,
  ) {}
 
  ngOnInit() {
    
    if(this.authService.userIsLogin()){
      this.router.navigate(["scolciencias"]);
    }

    this.startBackstretch();
    this.createLoginForm();
    this.groupAllow = 'colcienciasBeneficiario';

    

  }
  /**
   * @method createLogigForm creating an angular reactive form field with validations
   */
  private createLoginForm(): void {
    
    this.loginForm = this.fb.group({
      username: new FormControl(this.user.Username ,[Validators.required, Validators.min(5)]),
      password: new FormControl(this.user.Password,[Validators.required])
    });


    this.forgotPasswordForm = this.fb.group({
      username: new FormControl(this.user.Username, [Validators.required, Validators.min(9)])
    });
  } 


  get username() {return this.loginForm.get('username')}

  get password() {return this.loginForm.get('password')}


  public OnSubmit(): void {
    /**
     * @method AuthService.authenticateCongnito calling the cognito authentication 
     * @param {string} username
     * @param {string} password
     * @return {object} With accesstoken and payload
     */
    this.authService
      .authenticateCongnito({
        Username: this.loginForm.value.username,
        Password: this.loginForm.value.password
      })
      .subscribe(
        result => {
          // verify the result having the accessToken and payload information
          
          if (result && result.accessToken) {
            this.authService.userLoggedIn = true;
            this.user.set();
            this.user.AuthToken = result.idToken.jwtToken;
            const allowed =  1;//this.user.Groups.indexOf(this.groupAllow)
            if ( allowed >= 0 ) {
              // Route to home screen after success
              if ( this.user.selectHome() ) {
                this.router.navigate( [ 'departamentos' ] );
              } else {
                this.router.navigate( ['scolciencias'] );
              }
            }
          } 
          
        },
        error => {
          console.log(error);
          alert('Usuario o contraseña incorrectos');
        });
  }


  public startBackstretch(){
    var path="assets/";
    $.backstretch([
      path+"img/gbe_2.jpg",
      path+"img/gbe_3.jpg",
      path+"img/gbe_1.jpg"
      ],{
        fade: 750,
        duration: 4000
      });
  }

  
}
