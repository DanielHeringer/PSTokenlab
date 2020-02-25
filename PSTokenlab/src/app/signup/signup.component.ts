import { finalize } from 'rxjs/operators';
import { DataService } from './../services/data.service';
import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private dataService: DataService) { }

  email: string = "";
  password: string = "";
  name: string = "";
  user: User = {"id": null, "email": "", "name": "", "password": "", "loginAuth": 0};
  userCheck:number = 0;
  errorMsg: string  = "";

  ngOnInit(): void {
    this.checklogged();
  }


  signUser(){
    if(this.name == ""){
      this.errorMsg = "Username is required.";
      return;
    }
    if(this.email == ""){
      this.errorMsg = "Email is required.";
      return;
    }
    if(this.password == ""){
      this.errorMsg = "Password is required.";
      return;
    }
    this.user.email = this.email;
    this.user.name = this.name;
    this.user.password = this.password;

    return this.dataService.signup(this.user)
    .pipe(
      finalize(() => {
        if(this.userCheck == 1){
          this.errorMsg = "Username already in use.";
        }
        else if (this.userCheck == 2){
          this.errorMsg = "Email already in use.";
        }
        else{
          this.startSession();
        }
      }))
    .subscribe(data => {
      this.userCheck = data.userError;
      if(this.userCheck == 0){
        this.user = data.user
      }
    })

  }
  startSession(){
    window.location.href = this.dataService.localUrl+"/login";
  }

  checklogged(){
    let logged;
    if(sessionStorage.getItem('user')!=null){
      logged = JSON.parse(sessionStorage.getItem('user')).loginAuth;
      if(logged)
        window.location.href = this.dataService.localUrl;
    }
  }

}
