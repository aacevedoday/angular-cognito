/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc Home compoent having information about user
 */
import { Component, OnInit } from "@angular/core";
import { AuthService } from "./../../shared/services";
import { Router } from "@angular/router";
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public UserDetails: any;
  constructor(public authService: AuthService, public router: Router, public ngProgress: NgProgress) {}
  ngOnInit() {
    this.getUserDetails();
  }
  /**
   * @method getUserDetails Get the logged in user info
   * @return {Object} userdetails
   */
  public getUserDetails(): void {
    this.ngProgress.start();
    this.authService.userAttributes().subscribe(
        (response) => { 
          this.UserDetails = []
          Object.keys(response).map((key) => {
            this.UserDetails.push( [ key, response[key] ])  
          })
        },
        err => console.log(err),
        ()  => { 
          this.ngProgress.done();
          console.log(this.UserDetails)
         } 
    );
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

  
}
