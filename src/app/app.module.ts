import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {HttpClientModule} from "@angular/common/http";
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {OfflineListPage} from "../pages/offline-list/offline-list";
import {OnlineListPage} from "../pages/online-list/online-list";
import {AboutPage} from "../pages/about/about";
import {ServiceEpmloyeesProvider} from '../providers/service-epmloyees/service-epmloyees';
import {EmployeeDetailsPage} from "../pages/employee-details/employee-details";
import {CallNumber} from "@ionic-native/call-number";
import {SMS} from "@ionic-native/sms";
import {Toast} from "@ionic-native/toast";
import {SQLite} from "@ionic-native/sqlite";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OfflineListPage,
    OnlineListPage,
    EmployeeDetailsPage,
    AboutPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OfflineListPage,
    OnlineListPage,
    EmployeeDetailsPage,
    AboutPage
  ],
  providers: [
    CallNumber,
    SMS,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceEpmloyeesProvider,
    Toast,
    SQLite
  ]
})
export class AppModule {
}
