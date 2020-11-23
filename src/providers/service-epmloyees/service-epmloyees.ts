import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";

/*
  Generated class for the ServiceEpmloyeesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const API_URL : string  ="https://randomuser.me/api/?results=10&nat=us&seed=d07ade5f51ff3011";

@Injectable()
export class ServiceEpmloyeesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ServiceEpmloyeesProvider Provider');
  }


  getEmployees() {
    return this.http.get(API_URL).
      pipe(map((res: any) => res.results));
  }

}
