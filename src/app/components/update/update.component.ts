import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,  FormGroup, Validators  } from '@angular/forms';
import { AuthService } from "./../../shared/services";
import { User } from '../../models'



declare var $: any;

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {

  public updateForm: FormGroup;

  constructor( private fb: FormBuilder, public authService:AuthService, public user:User ) { 
    
  }

  ngOnInit() {
    this.createForm();
    this.startBackstretch();
  }

  createForm() {
    this.updateForm = this.fb.group({
      name: new FormControl(this.user.Name ,[Validators.required, Validators.min(20)]),
      last_name: new FormControl(this.user.FamilyName ,[Validators.required, Validators.min(20)])
    })
  }

  OnSubmit(){
    console.log(this.updateForm.value)
  }

  startBackstretch(){
    var path="assets/";
    $.backstretch([
      path+"img/gbe_2.jpg",
      path+"img/gbe_3.jpg",
      path+"img/gbe_1.jpg"
      ],{
        fade: 750,
        duration: 4000
      });
  }

}
