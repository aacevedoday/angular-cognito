

/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc login component file contians the angular reactive forms instead of template driven forms
 * and authentication functionality
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";

// Injecting services
import { AuthService } from "../../shared/services";
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/index';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    public cookieService: CookieService,
    private user:User,
  ) { }

  ngOnInit() {

    this.forgotPasswordForm = this.fb.group({
      username: new FormControl(this.user.Username, [Validators.required, Validators.min(9)])
    });

  }


  public OnSubmit():void{
    /**
     * @method AuthService.authenticateCongnito calling the cognito authentication 
     * @param {string} username
     * @param {string} password
     * @return {object} With accesstoken and payload
     */

    this.authService.forgotPassword({ Username: this.forgotPasswordForm.value.username} )
    .subscribe(
      result => { console.log(result) },
      error =>  { console.log(error) }

    );


  }

}
