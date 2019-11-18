import { Injectable } from '@angular/core';

import { AuthService } from '../shared/services';
import { OdbcService } from '../shared/services';

@Injectable()
export class User {

    private username: number;
    private password: string;
    private name: string;
    private family_name: string;
    private groups: any;
    private PGP_PAT_NOMBRE: any;
    private skin: any;
    private color: any;
    private PGP_CLAFE_URL_LOGO_APLICACION: any;
    private PER_NUMERO_DOCUMENTO: any;
    private PGP_PROM_NOMBRE_CORTO: any;

    constructor(private authService:AuthService, private odbc:OdbcService){
        this.set();
    }

    set(){
        const currentUser = this.authService.userAttributes();
        if ( currentUser ) {
            this.username = currentUser["cognito:username"];
            this.name = currentUser["name"];
            this.family_name = currentUser["family_name"];
            this.groups = currentUser["cognito:groups"];
            this.odbc.getOdbcInfo(this.username).subscribe (
                (data) => { 
                    console.log( data );
                    if ( data ) {
                        this.PGP_PAT_NOMBRE = data.PGP_PAT_NOMBRE;
                        this.skin = data.skin;
                        this.color = data.color;
                        this.PGP_CLAFE_URL_LOGO_APLICACION = data.PGP_CLAFE_URL_LOGO_APLICACION;
                        this.PER_NUMERO_DOCUMENTO = data.PER_NUMERO_DOCUMENTO;
                        this.PGP_PROM_NOMBRE_CORTO = data.PGP_PROM_NOMBRE_CORTO
                    }
                },
                (error) => { console.log(error); },
            );
        }
    }

    get(){
        return this;
    }

    hasRole( role: string ) {
        return this.Groups.indexOf(role);
    }


    get Username(){
        return this.username;
    }

    get Password(){
        return this.username;
    }

    get Name(){
        return this.name
    }

    get FamilyName(){
        return this.family_name;
    }

    get Groups(){
        return this.groups
    }
}
