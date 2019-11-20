/**
 * @author DineshRachumalla
 * @date 18-05-2018
 * @desc Angular service where authentication functionality is executed
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { Observable, Subject } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {Router} from "@angular/router"
import * as JWT from 'jwt-decode';



// Importing Cognito SDK features
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails
} from "amazon-cognito-identity-js"; 

@Injectable()
export class AuthService {
  private _accessToken: string = "";
  private _userloggedIn: boolean = false;
  private _userDetails: any = {};
  private _user: any = {};

  constructor(public http: HttpClient, public cookieService: CookieService, private router: Router) {}
  /**
   * @method authenticationCognito Login to Amanzon Cognito with provided parameters
   * @param {object} data
   * @return {Object} Observable
   * @desc Converted the general call backs with the help of Observable so that the response will
   * be notified
   */
  authenticateCongnito(data): Observable<any> {
    // Defining an rxjs subject so as to emit after recieving the response
    let authResult = new Subject<any>();
    // Add the User details to amazon cognito sdk
    const CogAuthData = new AuthenticationDetails(data);
    // Create a user pool with cliend id and secret key
    const CogUserPool = new CognitoUserPool(environment.cognitoPool);
    // Instantiate an cognito user with details and pool information
    const CogUser = new CognitoUser({
      Username: data.Username,
      Pool: CogUserPool
    });
    
    // Authenticate the cognito user with information
    CogUser.authenticateUser(CogAuthData, {
      onSuccess: result => {
        // on success send it to subject so that it will emit the success
        authResult.next(result);
      },
      onFailure: err => {
        // on failure send it to suvject so that will emit the error
        authResult.error(err);
      }
    });
    // Handling the final Observable 
    return authResult.asObservable();
  }

  /**
   * @method authenticationCognito Login to Amanzon Cognito with provided parameters
   * @param {object} data
   * @return {Object} Observable
   * @desc Converted the general call backs with the help of Observable so that the response will
   * be notified
   */
  userAttributes(): any {
    const CogUserPool = new CognitoUserPool(environment.cognitoPool);
    let userAttributes = CogUserPool.getCurrentUser();
    if(userAttributes){
      let attributes = userAttributes.getSession( (error, session) => {
          if(error){ console.log(error); return false }
          let sessionIdInfo = JWT(session.getIdToken().jwtToken);
          return sessionIdInfo;
        })
      return attributes;
    }
    return false;
  }

  userIsLogin(): boolean{
    const CogUserPool = new CognitoUserPool(environment.cognitoPool);
    if(CogUserPool.getCurrentUser()){
      return true;
    }
    return false;
  }

  userUpdateAttributes(): any{
    var attributeList = [];
    var attribute = {
        Name : 'custom:Ciudad', 
        Value : 'bogotá, Colombia'
    };
    var Userattribute = new CognitoUserAttribute(attribute);
    attributeList.push(Userattribute);
    this._user.updateAttributes(attributeList, function(err, result) {
      if (err) {
          alert(err);
          console.log(err);
          return;
      }
      console.log('call result: ' + result);
    });
    
  }

  forgotPassword( data ): any {

    // Defining an rxjs subject so as to emit after recieving the response
    let forgotResult = new Subject<any>();
    // Add the User details to amazon cognito sdk
    const CogAuthData = new AuthenticationDetails(data);
    // Create a user pool with cliend id and secret key
    const CogUserPool = new CognitoUserPool(environment.cognitoPool);
    // Instantiate an cognito user with details and pool information
    const CogUser = new CognitoUser({
      Username: data.Username,
      Pool: CogUserPool
    });

      // Authenticate the cognito user with information
    CogUser.forgotPassword( {
      onSuccess: result => {
        // on success send it to subject so that it will emit the success
        forgotResult.next(result);
      },
      onFailure: err => {
        // on failure send it to suvject so that will emit the error
        forgotResult.error(err);
      }
      });
      // Handling the final Observable 
    return forgotResult.asObservable();
  }


  userLogout(): any {
    const CogUserPool = new CognitoUserPool(environment.cognitoPool);
    let userAttributes = CogUserPool.getCurrentUser();
    userAttributes.signOut();
    return true;
  }
  // Set accesstoken data
  set accessToken(value: string) {
    this._accessToken = value;
  }
  // set Logged in user data
  set userLoggedIn(value: boolean) {
    this._userloggedIn = value;
  }
  // get user Logged in data
  get userLoggedIn(): boolean {
    return this._userloggedIn;
  }
  // set user details
  set UserDetails(value: any) {
    this._userDetails = value;
  }
  // set user Details
  get UserDetails(): any {
    return this._userDetails;
  }

  
}
