import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';




@Injectable({
  providedIn: 'root'
})
export class OdbcService {

  private base = 'https://www.colfuturo.org/odbc-api/odbc-api.php';

  constructor(private http: Http) {}


  getOdbcInfo( value: Number ): Observable<any> {
    return this.http.get(this.base + '?identification=' + value )
      .map( response => response.json() );
  }
}
