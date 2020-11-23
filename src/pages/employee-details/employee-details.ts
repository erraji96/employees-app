import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import {SMS} from "@ionic-native/sms";

/**
 * Generated class for the EmployeeDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-employee-details',
  templateUrl: 'employee-details.html',
})
export class EmployeeDetailsPage {


  public employee = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,private callNumber: CallNumber,private  sms: SMS) {
    console.log("Selected employee : " + this.employee);
    this.employee = navParams.get("employee");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeeDetailsPage');
  }


  appelerEmployee(numTelephone){
    console.log('Apepler le numero : ' +numTelephone );
    this.callNumber.callNumber(numTelephone,true);
  }
  smsEmployee(numTelephone){
    console.log('Envoyer sms a : ' +numTelephone );
    /*les options*/
    var options = {
      replaceLineBreaks: true,
      android:{
        intent : 'INTENT',
      }
    };
    /*ouvrir l'application de messagerie par default*/
    this.sms.send(numTelephone,"",options);
  }


}
