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
    console.log(this.router)
    // let cookieToken = this.cookieService.get('Drupal.visitor.drupal-session-cognito');
    // console.log(cookieToken);
    // const CogUserPool = new CognitoUserPool(environment.cognitoPool);
    // let userAttributes = CogUserPool.getCurrentUser();
    // if( userAttributes ){
    //   return userAttributes
    // } 
    // return false;
    this.cookieService.set(
      'Drupal.visitor.drupal-session-cognito',
      'eyJraWQiOiJlNUptcHJ6XC9cLzVrOFdJR2I4TytZcGoxWXFkK3VkY2gyanpsejBrZktMYms9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ZDZiM2NiMi01NmY5LTQ0MjctOWIzZC02NzkxMzliZjY1ZjEiLCJjb2duaXRvOmdyb3VwcyI6WyJQb3RlbmNpYWwiXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSIsImF1dGhfdGltZSI6MTU2NjkxOTQzOCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfbU9laVdYVFZYIiwiZXhwIjoxNTY2OTIzMDM4LCJpYXQiOjE1NjY5MTk0MzgsInZlcnNpb24iOjIsImp0aSI6ImNmM2ViZTcxLTFjYjQtNDc4ZS04YTJlLTA4NjAwMTQ1NmFlNCIsImNsaWVudF9pZCI6IjY0ZGhhcXRtZTd1ZG1ia20wYTZsM2NjYjM3IiwidXNlcm5hbWUiOiIxMDEzNjExMzI0In0.vTvoJBw8szU9MCARn43mGq9rqoOR7MDu2CrTX5s54a8jPJ4Zn9HVcIs50W61l1Iq-MxgrcrB7uuw48OTPoR4N8wrmtyT2ruJNA5DDTIuGcOHgRUoMaM8plUR1wPZXM6DenHIwQ_E5DrOkzB99DrV-BTV0qJzsMCZQU0fsvZpRzFfwjWAb1dDkvD1K_rpHUHvaoErfM4m_jQm3Qxa8ZTOxmhzANyXGKlGytaqJxAKMMsbhPtfepDPmqqhP5UzqpQWi3k-VYboQZVnKFMUAzTejmsXXxDVLsjmPncWxIf5RDunM2Nwdeu6zJUhjh2KBzAyX08IOomVOlVZaXROsc7RKg'
      );

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + 'eyJraWQiOiJlNUptcHJ6XC9cLzVrOFdJR2I4TytZcGoxWXFkK3VkY2gyanpsejBrZktMYms9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4ZDZiM2NiMi01NmY5LTQ0MjctOWIzZC02NzkxMzliZjY1ZjEiLCJjb2duaXRvOmdyb3VwcyI6WyJQb3RlbmNpYWwiXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE1NjY5Mzc2MjgsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX21PZWlXWFRWWCIsImV4cCI6MTU2Njk0MTIyOCwiaWF0IjoxNTY2OTM3NjI4LCJ2ZXJzaW9uIjoyLCJqdGkiOiJmOTFlYzQzYi0xYjI3LTQyYjYtYWNjMi02NjViZDU1YmUxMGYiLCJjbGllbnRfaWQiOiI2NGRoYXF0bWU3dWRtYmttMGE2bDNjY2IzNyIsInVzZXJuYW1lIjoiMTAxMzYxMTMyNCJ9.olxQJvBtJwkNEUTI5KLxbYxZJB2S58q_Lx3e-6vjeQ3dD06jZgi-psn-dy2uR2wtLpLuUV4DvqyqSR_bCyw2oDfBoxWAeWITKX6gGF6mHUo3K1kc1BG2dGzrK0Su9QG_7Kqs1FD5ivT0T_2t_stj9XEkNUlhFmqyR5_EF2ET7qj4VMAEKiFkPQnIr8hsowZF5e73ZOxTHLrCQBEl3E6LAj1BLHl9cbZSP-lUi6RvkmZfcCCI_CLQPY5I0ayV9jP72ZVoGntJ3xhN4XtZ8MrqVOnzva6-ZMwUP_oVbTBWnJoGmtmEEA6IEZErjRj_-XTWbMAre7RAXmI6YeBI3H5RjQ' );
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
