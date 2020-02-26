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
  user: any;
  _notifications: any[] = [];


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('user')!=null){
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.logged = this.user.loginAuth;
      if(this.logged){
        this.notifications(this.user.id);
      }
    }
    else{
      this.logged = 0;
    }
  }

  logout(){
    window.sessionStorage.clear();
    location.reload();
  }

  notifications(id){
    return this.dataService.getNotifications(id)
    .subscribe(data => {
      this._notifications = data;
      for(let event of this._notifications){
        event.startDate = new Date(event.start);
        event.endDate = new Date(event.end);
      }
    })
  }

  answerInvite(eventID, creatorID, answer){
    return this.dataService.answerInvite(creatorID, this.user.id, eventID, answer)
    .subscribe(data => {
      if(data.error == 0){
        this.notifications(this.user.id);
        if(answer == 1){
          this.scheduleEvent();
        }
      }
    })
  }
  scheduleEvent(){

  }

}
