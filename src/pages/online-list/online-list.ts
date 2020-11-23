import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ServiceEpmloyeesProvider} from "../../providers/service-epmloyees/service-epmloyees";
import {EmployeeDetailsPage} from "../employee-details/employee-details";

/**
 * Generated class for the OnlineListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-online-list',
  templateUrl: 'online-list.html',
})
export class OnlineListPage {
  /*liste des employees*/
  public employeesList = [];

  /*Constructeur */
  constructor(public navCtrl: NavController, public navParams: NavParams, private employeesProvider: ServiceEpmloyeesProvider, private loadingController: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnlineListPage');
    /*Controleur de chargement*/
    let employeesLoadingController = this.loadingController.create({
      content: "Chargement en cours",

    });
    employeesLoadingController.present();

    /*Chargement des employees */
    this.employeesProvider.getEmployees().subscribe(employees => {
      console.log('employeesList', employees);
      this.employeesList = employees;
      employeesLoadingController.dismiss();
    });

  }

  /*afficher les details  d'un employee */
  showEmployee(employee) {
    this.navCtrl.push(EmployeeDetailsPage, {
      employee: employee
    });
  }

}
