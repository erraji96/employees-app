import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ServiceEpmloyeesProvider} from "../../providers/service-epmloyees/service-epmloyees";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {EmployeeDetailsPage} from "../employee-details/employee-details";

/**
 * Generated class for the OfflineListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline-list',
  templateUrl: 'offline-list.html',
})
export class OfflineListPage {


  /*liste des employees*/
  employeesList: any = [];
  /*Prefix des tables (ex: emp_employees , emp_locations , ...) */
  tablePrefix = 'emp_';
  /*les informations de base de donnees*/
  database_name = 'cigma_employees.db';
  database_location = 'default';

  /*Constructeur */
  constructor(public navCtrl: NavController, public navParams: NavParams, private employeesProvider: ServiceEpmloyeesProvider, private loadingController: LoadingController, private sqlite: SQLite, private toastCtrl: ToastController) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineListPage');
    /*Controleur de chargement*/
    let employeesLoadingController = this.loadingController.create({
      content: "Chargement en cours",
    });
    //employeesLoadingController.present();
    employeesLoadingController.present();
    this.getEmployees();
    employeesLoadingController.dismiss();

  }

  /*afficher les details  d'un employee */
  showEmployee(employee) {
    this.navCtrl.push(EmployeeDetailsPage, {
      employee: employee
    });
  }

  /*lister les employees */
  getEmployees() {
    console.log("listing employees from local database");
    return this.sqlite.create({
      name: this.database_name,
      location: this.database_location
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM  ' + this.tablePrefix + 'employees', [])
        .then(res => {
          this.employeesList = [];
          /*champs  = id_value,id_name,cell,email,gender,nat,phone*/
          for (var i = 0; i < res.rows.length; i++) {
            /*construire l'objet employee pour le remplire*/
            let employee = {
              gender: null,
              name: {
                title: null,
                first: null,
                last: null
              },
              location: {
                street: {
                  number: null,
                  name: null
                },
                city: null,
                state: null,
                country: null,
                postcode: null,
                coordinates: {
                  latitude: null,
                  longitude: null
                },
                timezone: {
                  offset: null,
                  description: null
                }
              },
              email: null,
              login: {
                uuid: null,
                username: null,
                password: null,
                salt: null,
                md5: null,
                sha1: null,
                sha256: null
              },
              dob: {
                date: null,
                age: null
              },
              registered: {
                date: null,
                age: null
              },
              phone: null,
              cell: null,
              id: {
                name: null,
                value: null
              },
              picture: {
                large: null,
                medium: null,
                thumbnail: null
              },
              nat: null
            };
            //employee.employee_id = res.rows.item(i).employee_id;
            employee.cell = res.rows.item(i).cell;
            employee.email = res.rows.item(i).email;
            employee.phone = res.rows.item(i).phone;
            employee.nat = res.rows.item(i).nat;
            employee.gender = res.rows.item(i).gender;
            employee.id.name = res.rows.item(i).id_name;
            employee.id.value = res.rows.item(i).id_value;

            /*champs  = date,age,employee_id*/
            db.executeSql('SELECT * FROM  ' + this.tablePrefix + 'date_births WHERE employee_id = ?', [employee.id.value])
              .then(res => {
                if (res.rows.length > 0) {
                  employee.dob.age = res.rows.item(0).age;
                  employee.dob.date = res.rows.item(0).date;
                }
              })
              .catch(e => {
                console.log("error selecting data from date_births table : " + JSON.stringify(e));
              });


            /*champs  = city,latitude,longitude,country,postcode,state,street_number,street_name,timezone_offset,timezone_description,employee_id*/
            db.executeSql('SELECT * FROM  ' + this.tablePrefix + 'locations WHERE employee_id = ?', [employee.id.value])
              .then(res => {
                if (res.rows.length > 0) {
                  employee.location.city = res.rows.item(0).city;
                  employee.location.postcode = res.rows.item(0).postcode;
                  employee.location.country = res.rows.item(0).country;
                  employee.location.state = res.rows.item(0).state;
                  employee.location.timezone.description = res.rows.item(0).timezone_description;
                  employee.location.timezone.offset = res.rows.item(0).timezone_offset;
                  employee.location.street.number = res.rows.item(0).street_number;
                  employee.location.street.name = res.rows.item(0).street_name;
                  employee.location.coordinates.latitude = res.rows.item(0).latitude;
                  employee.location.coordinates.longitude = res.rows.item(0).longitude;
                  console.log('location data ' + JSON.stringify(res.rows.item(0)))
                }
              })
              .catch(e => {
                console.log("error selecting data from locations table  " + JSON.stringify(e));
              });

            /*champs  = md5,password,salt,sha1,sha256,username,uuid,employee_id*/
            db.executeSql('SELECT * FROM  ' + this.tablePrefix + 'logins WHERE employee_id = ?', [employee.id.value])
              .then(res => {
                if (res.rows.length > 0) {
                  employee.login.md5 = res.rows.item(0).md5;
                  employee.login.password = res.rows.item(0).password;
                  employee.login.salt = res.rows.item(0).salt;
                  employee.login.sha1 = res.rows.item(0).sha1;
                  employee.login.sha256 = res.rows.item(0).sha256;
                  employee.login.username = res.rows.item(0).username;
                  employee.login.uuid = res.rows.item(0).uuid;
                }
              })
              .catch(e => {
                console.log("error selecting data from logins table : " + JSON.stringify(e));
              });

            /*champs  = title,first,last,employee_id*/
            db.executeSql('SELECT * FROM  ' + this.tablePrefix + 'names WHERE employee_id = ?', [employee.id.value])
              .then(res => {
                if (res.rows.length > 0) {
                  employee.name.title = res.rows.item(0).title;
                  employee.name.first = res.rows.item(0).first;
                  employee.name.last = res.rows.item(0).last;
                }
              })
              .catch(e => {
                console.log("error selecting data from names table : " + JSON.stringify(e));
              });

            /*champs  = large,medium,thumbnail,employee_id*/
            db.executeSql('SELECT * FROM  ' + this.tablePrefix + 'pictures WHERE employee_id = ?', [employee.id.value])
              .then(res => {
                if (res.rows.length > 0) {
                  employee.picture.large = res.rows.item(0).large;
                  employee.picture.medium = res.rows.item(0).medium;
                  employee.picture.thumbnail = res.rows.item(0).thumbnail;
                }
              })
              .catch(e => {
                console.log("error selecting data from emp_pictures table : " + JSON.stringify(e));
              });

            /*champs  = date,age,employee_id*/
            db.executeSql('SELECT * FROM  ' + this.tablePrefix + 'registrations WHERE employee_id = ?', [employee.id.value])
              .then(res => {
                if (res.rows.length > 0) {
                  employee.registered.date = res.rows.item(0).date;
                  employee.registered.age = res.rows.item(0).age
                }
              })
              .catch(e => {
                console.log("error  selecting data from tables : " + JSON.stringify(e));
              });
            /*alimenter la liste*/
            this.employeesList.push(employee);
          }


        })
        .catch(e => {
          console.log("error selecting data from emp_employees table : " + JSON.stringify(e));
        });
    }).catch(e => {
      console.log("general database error : " + JSON.stringify(e));
    });
  }


  /*Suppression d'un employee*/
  deleteEmployee(employee) {
    this.sqlite.create({
      name: this.database_name,
      location: this.database_location
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM ' + this.tablePrefix + 'employees where id_value =? ', [employee.id.value])
        .then(res => {
          console.log(JSON.stringify(res));
          console.log('deleting from emp_employees table');
          this.getEmployees();
          this.showToast("Salariée supprimé", "bottom", 800);
        }).catch(e => {
        console.log("error deleting from emp_employees : " + JSON.stringify(e));
      });
    })
  }

  /*afficher un message toast*/
  showToast(msg: string, pos: string, time) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: time,
      position: pos,
      cssClass: 'normalToast'
    });
    toast.present();
  }
}
