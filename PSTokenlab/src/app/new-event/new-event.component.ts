import { User } from './../models/user.model';
import { finalize } from 'rxjs/operators';
import { DataService } from './../services/data.service';
import { Event } from './../models/event.model';
import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  name:string = "";
  startDate: Date;
  endDate: Date;
  startDateStr: string = "";
  endDateStr: string = "";
  description:string = "";
  event: Event = {"id": null, "description": this.description, "name": this.name,
                  "startDate": this.startDate, "endDate": this.endDate};
  user: User;
  logged: number;
  errorMsg: string  = "";
  eventError: number = -1;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checklogged();
    if(this.route.snapshot.paramMap.get('date') == "default"){
      let date = new Date()
      let dateStr = date.toISOString();
      this.startDateStr = dateStr.slice(0,16);
      this.endDateStr = dateStr.slice(0,16);
    }
    else{
      this.startDateStr = this.route.snapshot.paramMap.get('date');
      this.endDateStr = this.route.snapshot.paramMap.get('date');
    }
  }

  checklogged(){
    if(sessionStorage.getItem('user')==null){
        window.location.href = this.dataService.localUrl+"/login";
    }
    else{
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.logged = this.user.loginAuth;
     }
  }

  checkRequirements(){
    if(this.name == ""){
      this.errorMsg = "Event Name is required";
      return 0;
    }
    this.strToDate();
    if(this.endDate == null){
      this.errorMsg = "End Date is required";
      return 0;
    }
    if(this.startDate == null){
      this.errorMsg = "Start Date is required";
      return 0;
    }
    if(this.description == ""){
      this.errorMsg = "Description is required";
      return 0;
    }
    if(this.startDate.getTime() > this.endDate.getTime()){
      this.errorMsg = "The end date must be after the start date";
      return 0;
    }
    return 1;
  }
  strToDate(){
    if(this.startDateStr != "" && this.endDateStr != ""){
      this.startDate = new Date(this.startDateStr);
      this.endDate = new Date(this.endDateStr);
    }
  }

  createEvent(){
    if(this.checkRequirements()){
      this.event.name = this.name;
      this.event.description = this.description;
      this.event.startDate = this.startDate;
      this.event.endDate = this.endDate;
      let creatorID = JSON.parse(sessionStorage.getItem('user')).id;


      return this.dataService.createEvent(this.event, creatorID)
      .pipe(
        finalize(() => {
          if(this.eventError == 0){
            window.location.href = this.dataService.localUrl;
          }
          else if(this.eventError == 1){
            this.errorMsg = "This event ovelaps another event";
          }
        }))
      .subscribe(data => {
        this.eventError = data.eventError;
      })
    }
    }

    logout(){
      window.sessionStorage.clear();
      location.reload();
    }
}
