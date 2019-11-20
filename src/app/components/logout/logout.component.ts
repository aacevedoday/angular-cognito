import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
// Injecting services
import { AuthService } from "../../shared/services";
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/index';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public router: Router,
    public cookieService: CookieService,
    public user: User) { }

  ngOnInit() {
    this.user.AuthToken = null;
    this.authService.userLogout();
    this.router.navigate([""]);
  }

}
