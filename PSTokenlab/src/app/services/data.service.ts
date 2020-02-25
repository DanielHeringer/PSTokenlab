import { User } from './../models/user.model';
import { Event } from './../models/event.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  localUrl: string = "http://localhost:4200";
  baseUrl: string = "http://localhost:3000";


  constructor(private _http: HttpClient) {}

  login(email, password){
    let apiUrl = this.baseUrl+"/login/";
    let json ={"email": email, "password": password};

    return this._http.post<User>(apiUrl, json);
  }

  signup(user : User){
    let apiUrl = this.baseUrl+"/createUser/";
    let json ={"email": user.email, "password": user.password, "name": user.name};
    return this._http.post<any>(apiUrl, json);
  }
  createEvent(event : Event, creatorID){
    let apiUrl = this.baseUrl+"/createEvent/";
    let json ={"name": event.name, "description": event.description,
               "startDate": event.startDate.getTime(), "endDate": event.endDate.getTime(), "creatorID": creatorID};
    return this._http.post<any>(apiUrl, json);
  }
  getEventInterval(creatorID, start, end){
    let apiUrl = this.baseUrl+`/eventInterval/${creatorID}/${start}/${end}`;
    return this._http.get<any[]>(apiUrl);
  }
  deleteEvent(id){
    let apiUrl = this.baseUrl+`/deleteEvent/`+id;
    return this._http.delete<any[]>(apiUrl);
  }
}
