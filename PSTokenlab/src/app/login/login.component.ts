import { DataService } from './../services/data.service';
import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string ='';
  password: string='';
  user: User;
  errorMsg: string  = "";

  constructor(private dataService: DataService ) {
  }

  ngOnInit(): void {
    this.checklogged();
  }

  checklogged(){
    let logged;
    if(sessionStorage.getItem('user')!=null){
      logged = JSON.parse(sessionStorage.getItem('user')).loginAuth;
      if(logged)
        window.location.href = this.dataService.localUrl;
    }
  }

  loginReq(){
    if(this.email == ""){
      this.errorMsg = "Email is required";
      return;
    }
    if(this.password == ""){
      this.errorMsg = "Password is required";
      return;
    }
    return this.dataService.login(this.email, this.password)
    .pipe(
      finalize(() => {
        if(this.user.loginAuth){
          this.startSession();
          this.checklogged();
        }
        else{
          this.errorMsg = "Wrong email or password";
        }
      }))
    .subscribe(data => {this.user = data})
  }
  startSession(){
    sessionStorage.setItem('user', JSON.stringify(this.user));
  }

}
