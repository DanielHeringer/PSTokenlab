import { Event } from './../models/event.model';
import { finalize } from 'rxjs/operators';
import { DataService } from './../services/data.service';
import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  user: User;
  dayOfweek: number = new Date().getDay();
  weekDay: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonth: string;
  monthInteger: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  daysInMonth: number;
  monthIndex: number;
  firstDayTimestamp: number;
  lastDayTimestamp: number;
  logged: number = 0;
  events;
  eventsToList: Event[] = [];
  markedDays:number[] = [];
  actionLoginText: string = "Login";
  confirmationDialog: number = 0;
  invitationDialog: number = 0;
  invited: string = "";
  sendErrorMsg: string = "";

  constructor(private dataService: DataService) {
    this.setMonthIndex();
    this.setDaysInMonth();
    this.setCurrentMonth();
    this.setTimestamp();
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('user')!=null){
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.logged = this.user.loginAuth;
      if(this.logged){
        this.getEvents();
      }
    }
    else{
      this.logged = 0;
    }
  }

  getEvents(){
    return this.dataService.getEventInterval(this.user.id, this.firstDayTimestamp, this.lastDayTimestamp)
    .pipe(
      finalize(() => {
        this.markDays();
        this.listEvents(0);
      }))
    .subscribe(data => {
      this.events = data;
    })
  }

  markDays(){
    for(let event of this.events) {
      let startDay = new Date(event.start).getDate();
      let endDay = new Date(event.end).getDate();
      for(let i=startDay; i<=endDay; i++){
        this.markedDays.push(i);
      }
    }
  }

  getNoOfEvents(day){
    return this.markedDays.reduce(function (n, i) {
      var p = (i == day)? 1:0;
      return n + p;
  }, 0);
  }
  listEvents(day){
    if(day != 0){
      document.location.href = '#listAnchor';
    }
    this.eventsToList = [];
    for(let event of this.events) {
      let startDay = new Date(event.start).getDate();
      let endDay = new Date(event.end).getDate();
      if((day >= startDay && day<= endDay) || day == 0){
        let push =
            {id: event.id,
             name: event.name,
             description: event.description,
             startDate: new Date(event.start),
             endDate: new Date(event.end)
            }
        this.eventsToList.push(push);
      }
    }
  }

  isDayMarked(day){
    if(this.markedDays.find(element => element == day)){
      return true;
    }
    else
      return false;
  }

  setMonthIndex(){
    this.monthIndex = new Date(`${this.currentYear}-${this.monthInteger}-01`).getDay()
  }
  setDaysInMonth(){
    this.daysInMonth =  this.getDaysInMonth(this.monthInteger, this.currentYear);
  }
  getDaysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
  }
  setCurrentMonth(){
    this.currentMonth = this.months[this.monthInteger-1];
  }
  setTimestamp(){
    this.firstDayTimestamp = new Date(`${this.currentYear}-${this.monthInteger}-01`).getTime();
    this.lastDayTimestamp = new Date(`${this.currentYear}-${this.monthInteger}-${this.daysInMonth} 23:59`).getTime();
  }

  logout(){
    window.sessionStorage.clear();
    location.reload();
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
        items.push(i);
    }
    return items;
  }

  nextM(){
    if(this.monthInteger+1 > 12){
      this.monthInteger = 1;
      this.currentYear++;
    }
    else{
      this.monthInteger++;
    }
    this.updateCalendar();
  }

  prevM(){
    if(this.monthInteger-1 < 1){
      this.monthInteger = 12;
      this.currentYear--;
    }
    else{
      this.monthInteger--;
    }
    this.updateCalendar();
  }

  updateCalendar(){
    this.setMonthIndex();
    this.setDaysInMonth();
    this.setCurrentMonth();
    this.setTimestamp();
    if(this.logged){
      this.markedDays = []
      this.events = [];
      this.getEvents();
    }
  }

  delete(id){
    return this.dataService.deleteEvent(id)
    .pipe(
      finalize(() => {
        this.updateCalendar();
      }))
    .subscribe(data => {
    })
  }
  editEvent(id){
    window.location.href = this.dataService.localUrl + "/editEvent/" + id + "/0";
  }
  redirectToNew(day){
    let date = new Date(`${this.currentYear}-${this.monthInteger}-${day}`)
    let dateStr = date.toISOString();
    let param = dateStr.slice(0,16);
    window.location.href = this.dataService.localUrl + '/newEvent/' + param;
  }
  toggleConfirmation(id){
    if(this.confirmationDialog == 0){
      this.confirmationDialog = id;
    }
    else if(this.confirmationDialog != id){
      this.confirmationDialog = id;
    }
    else{
      this.confirmationDialog = 0;
    }
  }
  toggleInvitation(id){
    if(this.invitationDialog == 0){
      this.invitationDialog = id;
    }
    else if(this.invitationDialog != id){
      this.invitationDialog = id;
    }
    else{
      this.invitationDialog = 0;
    }
  }
  inviteUser(id, username){
    return this.dataService.invite(this.user.id, username, id)
    .subscribe(data => {
      if(data.sendError == 1){
        this.sendErrorMsg = "User already invited";
      }
      else if(data.sendError == 2){
        this.sendErrorMsg = "User not found";
      }
      else if(data.sendError == 3){
        this.sendErrorMsg = "User is already committed";
      }
      else{
        this.sendErrorMsg = "Invitation sent";
      }
    })
  }

  unnanswered(){
    return true
  }
}
