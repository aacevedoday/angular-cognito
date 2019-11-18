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



//import { ScolcienciasComponent } from "./components/scolciencias";
import { AuthGuard } from "./shared/services";
// Defining the routes and exporting as a constant so that cannot be altered by any other
export const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  { path: "scolciencias", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "departamentos", component: HomeTwoComponent, canActivate: [AuthGuard] },
  { path: "user/update", component: UpdateComponent, canActivate: [AuthGuard] },
  { path: "user/password", component: PasswordComponent, canActivate: [AuthGuard] },
  { path: "user/logout", component: LogoutComponent, canActivate: [AuthGuard] },

];
