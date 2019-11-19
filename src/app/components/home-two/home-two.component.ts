/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc Home compoent having information about user
 */

import { Component, OnInit } from "@angular/core";
import { AuthService } from "./../../shared/services";
import { Router } from "@angular/router";
import { NgProgress } from 'ngx-progressbar';
import { FormControl,  FormGroup  } from '@angular/forms';
import { User } from '../../models';
declare var $: any;


@Component({
  selector: 'app-home-two',
  templateUrl: './home-two.component.html',
  styleUrls: ['./home-two.component.scss']
})
export class HomeTwoComponent implements OnInit {

  public UserDetails: any;
  public form: FormGroup;
  constructor(public authService: AuthService, public router: Router, public ngProgress: NgProgress, public user:User) {}
  
  ngOnInit() {
    $('.carouselExampleIndicators').carousel()
    this.createForm();
    this.disableBackstretch();
    this.getUserDetails();
    console.log(this.user)
  }
  /**
   * @method getUserDetails Get the logged in user info
   * @return {Object} userdetails
   */
  public getUserDetails(): void {
    this.ngProgress.start();
    this.ngProgress.done();
  }
  /**
   * @method logout Logout user
   *
   */
  public logout(): void {
    // Clear the user details on logout and make userlogged in to false
    this.authService.userLoggedIn = false;
    this.authService.UserDetails = {};
    this.authService.accessToken = null;
    // Route to sign
    this.authService.userLogout();
    this.router.navigate([""]);
  }

  public disableBackstretch(){
    $('.backstretch').remove();
  }


  public createForm() {
    
    this.form = new FormGroup ({
      asunto: new FormControl(),
      mensaje: new FormControl()
    });

  }

}
