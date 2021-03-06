/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc Router File, defines the routes in this files based on component and its configurations
 */
import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login";
import { HomeComponent } from "./components/home";
import { HomeTwoComponent } from "./components/home-two";

import { LogoutComponent } from "./components/logout";
import { UpdateComponent } from "./components/update";
import { PasswordComponent } from "./components/password";
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';



//import { ScolcienciasComponent } from "./components/scolciencias";
import { AuthGuard } from "./shared/services";
// Defining the routes and exporting as a constant so that cannot be altered by any other
export const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  { path: "departamentos", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "scolciencias", component: HomeTwoComponent, canActivate: [AuthGuard] },
  { path: "user/update", component: UpdateComponent, canActivate: [AuthGuard] },
  { path: "user/password", component: PasswordComponent, canActivate: [AuthGuard] },
  { path: "user/change-password", component: ChangePasswordComponent, canActivate: [AuthGuard]},
  { path: "forgot-password", component: ForgotPasswordComponent},
  { path: "user/logout", component: LogoutComponent, canActivate: [AuthGuard] },

];
