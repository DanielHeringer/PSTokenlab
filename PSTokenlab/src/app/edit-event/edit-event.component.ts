import { User } from './../models/user.model';
import { finalize } from 'rxjs/operators';
import { DataService } from './../services/data.service';
import { Event } from './../models/event.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  name:string;
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
  updated;
  data;


  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checklogged();
    this.getEvent(this.getEvent(this.route.snapshot.paramMap.get('id')));
    if(this.getEvent(this.route.snapshot.paramMap.get('updated'))){

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

  getEvent(id){
    return this.dataService.getEvent(id, this.user.id)
    .pipe(
      finalize(() => {
        this.name = this.data.name;
        let start = new Date(this.data.start).toISOString(), end = new Date(this.data.end).toISOString();
        this.startDateStr = start.substring(0,start.length-1);
        this.endDateStr = end.substring(0,end.length-1);
        this.description = this.data.description;
      }))
    .subscribe(data => {
      if(data[0].auth){
        this.data = data[0];
      }
      else{
        window.location.href = this.dataService.localUrl;
      }
    })
  }

  updateEvent(){
    if(this.checkRequirements()){
      this.event.id = this.data.id;
      this.event.name = this.name;
      this.event.description = this.description;
      this.event.startDate = this.startDate;
      this.event.endDate = this.endDate;
      let creatorID = JSON.parse(sessionStorage.getItem('user')).id;


      return this.dataService.editEvent(this.event, creatorID)
      .subscribe(data => {
        if(data.eventError==0){
          window.location.href = this.dataService.localUrl + "/editEvent/" + this.data.id + "/1";
        }
      })
    }
  }

  logout(){
    window.sessionStorage.clear();
    location.reload();
  }
}
