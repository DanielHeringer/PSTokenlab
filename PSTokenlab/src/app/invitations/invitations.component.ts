import { DataService } from './../services/data.service';
import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {

  logged:number = 0;
  user: User;
  constructor(private DataService: DataService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('user')!=null){
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.logged = this.user.loginAuth;
    }
    else{
      this.logged = 0;
    }
  }

  logout(){
    window.sessionStorage.clear();
    location.reload();
  }

}
