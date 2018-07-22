
import { API } from './../app/globals';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from "@angular/common/http";
import { Observable } from '../../node_modules/rxjs/Observable';



@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  accountAPI = API.Account

  constructor(
    public events: Events,
    public storage: Storage,
    public http: HttpClient
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:login');
  };

  signup(surname: string, dateOfBirth:string, password:string): Observable<any> {
    let body = {
      "surname":surname,
      "dateOfBirth":dateOfBirth,
      "password":password
    }
    return this.http.post(this.accountAPI, body, {responseType: 'text'})//use json will be better with angular
  };
  didSignup(){
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername('smsm');//change it to username
    this.events.publish('user:signup');
  }

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
