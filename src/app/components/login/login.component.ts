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
  public ConfirmPasswordForm: FormGroup;
  public singUpForm: FormGroup;
  public messages: String;
  public confirmRegistrationForm :  FormGroup;

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
      username: new FormControl('', [Validators.required, Validators.min(9)])
    });


    this.ConfirmPasswordForm = this.fb.group({
      code: new FormControl('', [Validators.required, Validators.min(6)]),
      newPassword: new FormControl('', [Validators.required, Validators.min(9)]),
      confirmNewPassword: new FormControl('', [Validators.required, Validators.min(9)])
    });

    this.singUpForm = this.fb.group({
      Username: new FormControl('', [Validators.required, Validators.min(9)]),
      Password: new FormControl('',[Validators.required, Validators.min(9)]),
      ConfirmPassword: new FormControl('',[Validators.required, Validators.min(9)]),
      Email:    new FormControl('',[Validators.required, Validators.email]),
      Name:    new FormControl('',[Validators.required, Validators.min(3), Validators.max(20)]),
      Family_name:    new FormControl('',[Validators.required, Validators.min(3), Validators.max(20)]),
    })

    this.confirmRegistrationForm = this.fb.group({
      code: new FormControl('', [Validators.required, Validators.min(6)]),
    })
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
          if( typeof error.code != 'undefined'){
            switch (error.code) {
              case 'PasswordResetRequiredException':
                this.authService.forgotPassword( {Username: this.loginForm.value.username } )
                  .subscribe( 
                    response => {
                      console.log(response);
                    }, 
                    error => {
                      console.log(error);
                    } )
                $('#ModalCahngePassword').modal('toggle');
                break;
              case 'NotAuthorizedException':
                  alert('Usuario y contraseña invalidos.');
                break;
            
              default:
                  alert('En estos momentos el servicio no esta disponible, intentelo mas tarde.');
                break;
            }
          }
        });
  }


  public OnSubmitForgotPassword(): void {

    this.authService.forgotPassword({ Username: this.forgotPasswordForm.value.username} )
    .subscribe(
      response => {
        this.messages = this.traslate(response.Destination);
        $('#ModalForgotPassword').modal('toggle');
        $('#ModalCahngePassword').modal('toggle');
      },
      error => { 
        this.messages = this.traslate(error.message);
      }
    );
  }

  public OnSubmitConfirmPassword(): void {
    this.authService.confirmPassword(
        {
          code: this.ConfirmPasswordForm.value.code,
          Username: (this.forgotPasswordForm.value.username) ? this.forgotPasswordForm.value.username:this.loginForm.value.username,
          newPassword: this.ConfirmPasswordForm.value.newPassword
        }
      )
    .subscribe(
      response => {
        console.log(response);
        $('#ModalCahngePassword').modal('toggle');
      },
      error => { console.log(error); }
    );

  }

  public OnSubmitRegister(): void {

    this.authService.singUp({
      Username : this.singUpForm.value.Username,
      Email: this.singUpForm.value.Email,
      Password: this.singUpForm.value.Password,
      Name : this.singUpForm.value.Name,
      Family_name: this.singUpForm.value.Family_name
    }).subscribe(
      response => {
        $('#ModalRegister').modal('toggle');
        $('#ModalConfirmRegistration').modal('toggle');
      },
      error => { 
        alert('En estos momentos el sistema no se encuentra disponible, inténtelo mas tarde.')
      }
    )
  }

  public OnSubmitConfirmRegistration(){
    this.authService.confirmRegistration({
      code: this.confirmRegistrationForm.value.code,
      Username: this.singUpForm.value.Username
    }).subscribe(
      response => {
        console.log(response)
        $('#ModalConfirmRegistration').modal('toggle');
        alert('Por favor inicia sesion.')
      },
      err => {
        console.log(err)
        alert('En estos momentos el sistema no se encuentra disponible, inténtelo mas tarde.')
      }
    )
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


  private traslate(value: string): String {
    switch(value){
      case 'Attempt limit exceeded, please try after some time.':
        return 'Numero de intentos maximos permitidos excedido, por favor intentelo mas tarde.'
        
      case 'Username/client id combination not found.':
        return 'Usuario invalido.'
    }
    return value;
  }
}
