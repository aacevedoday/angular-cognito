import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';




@Injectable({
  providedIn: 'root'
})
export class OdbcService {

  private base:string = 'https://www.colfuturo.org/odbc-api/odbc-api.php';

  constructor(private http:Http) {}


  getOdbcInfo( value:number ): Observable<any>{
    return this.http.post(this.base, {identification: value})
      .map( response => response.json()  );
  }
}
