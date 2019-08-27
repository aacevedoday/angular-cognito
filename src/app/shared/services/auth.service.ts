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

  constructor(public http: HttpClient, public cookieService: CookieService) {}
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
    
    // const CogUserPool = new CognitoUserPool(environment.cognitoPool);
    // let userAttributes = CogUserPool.getCurrentUser();
    // if( userAttributes ){
    //   return userAttributes
    // } 
    // return false;
    this.cookieService.set(
      'drupal-session-cognito',
      'eyJraWQiOiJlNUptcHJ6XC9cLzVrOFdJR2I4TytZcGoxWXFkK3VkY2gyanpsejBrZktMYms9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ZDZiM2NiMi01NmY5LTQ0MjctOWIzZC02NzkxMzliZjY1ZjEiLCJjb2duaXRvOmdyb3VwcyI6WyJQb3RlbmNpYWwiXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSIsImF1dGhfdGltZSI6MTU2NjkxOTQzOCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfbU9laVdYVFZYIiwiZXhwIjoxNTY2OTIzMDM4LCJpYXQiOjE1NjY5MTk0MzgsInZlcnNpb24iOjIsImp0aSI6ImNmM2ViZTcxLTFjYjQtNDc4ZS04YTJlLTA4NjAwMTQ1NmFlNCIsImNsaWVudF9pZCI6IjY0ZGhhcXRtZTd1ZG1ia20wYTZsM2NjYjM3IiwidXNlcm5hbWUiOiIxMDEzNjExMzI0In0.vTvoJBw8szU9MCARn43mGq9rqoOR7MDu2CrTX5s54a8jPJ4Zn9HVcIs50W61l1Iq-MxgrcrB7uuw48OTPoR4N8wrmtyT2ruJNA5DDTIuGcOHgRUoMaM8plUR1wPZXM6DenHIwQ_E5DrOkzB99DrV-BTV0qJzsMCZQU0fsvZpRzFfwjWAb1dDkvD1K_rpHUHvaoErfM4m_jQm3Qxa8ZTOxmhzANyXGKlGytaqJxAKMMsbhPtfepDPmqqhP5UzqpQWi3k-VYboQZVnKFMUAzTejmsXXxDVLsjmPncWxIf5RDunM2Nwdeu6zJUhjh2KBzAyX08IOomVOlVZaXROsc7RKg'
      );
    
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('drupal-session-cognito') );
    let response = this.http.get(
        'https://colfuturo.auth.us-west-2.amazoncognito.com/oauth2/userInfo',  
        {headers: headers}
      )
    return response;
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
