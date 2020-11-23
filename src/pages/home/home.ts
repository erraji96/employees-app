import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {OfflineListPage} from "../offline-list/offline-list";
import {OnlineListPage} from "../online-list/online-list";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {ServiceEpmloyeesProvider} from "../../providers/service-epmloyees/service-epmloyees";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public employeesList = [];
  /*Prefix des tables (ex: emp_employees , emp_locations , ...) */
  tablePrefix = 'emp_';
  /*les informations de base de donnees*/
  database_name = 'cigma_employees.db';
  database_location = 'default';

  /*Constructeur */
  constructor(public navCtrl: NavController, public navParams: NavParams, private employeesProvider: ServiceEpmloyeesProvider, private loadingController: LoadingController, private sqlite: SQLite, private toastCtrl: ToastController) {
    /*verifier et creer la base de donnees*/
    this.createDatabase();
  }

  ionViewDidLoad() {
    /*verifier et creer la base de donnees*/
    this.createDatabase();
    /*lister les employes depuis API */
    this.getEmployeesFromApi();
  }
  ionViewWillEnter() {
    /*verifier et creer la base de donnees*/
    this.createDatabase();
  }



    /*Creation de la base de donnees*/
  createDatabase() {
    this.sqlite.create({
      name: this.database_name,
      location: this.database_location
    }).then((db: SQLiteObject) => {

      /*creation de table emp_employees */
      /*champs  = id_value,id_name,cell,email,gender,nat,phone*/
      db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePrefix + 'employees (id_value TEXT PRIMARY KEY,id_name TEXT,cell TEXT, email TEXT, gender TEXT, nat TEXT,phone TEXT)', [])
        .then(res => {
          console.log('execute emp_employees table sql');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error creating emp_employees table -> " + JSON.stringify(e));
        });

      /*creation de table emp_date_births */
      /*champs  = date,age,employee_id*/
      db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePrefix + 'date_births (date TEXT,age INTEGER, employee_id INTEGER ,CONSTRAINT fk_employees FOREIGN KEY (employee_id) REFERENCES ' + this.tablePrefix + 'employees(id_value) ON DELETE CASCADE)', [])
        .then(res => {
          console.log('execute emp_date_births table sql');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error creating emp_date_births table -> " + JSON.stringify(e));
        });

      /*creation de table emp_locations */
      /*champs  = city,latitude,longitude,country,postcode,state,street_number,street_name,timezone_offset,timezone_description,employee_id*/
      db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePrefix + 'locations (city TEXT,latitude TEXT,longitude TEXT,country TEXT,postcode INTEGER,state TEXT,street_number INTEGER,street_name TEXT,timezone_offset TEXT,timezone_description TEXT, employee_id INTEGER ,CONSTRAINT fk_employees FOREIGN KEY (employee_id) REFERENCES ' + this.tablePrefix + 'employees(id_value) ON DELETE CASCADE)', [])
        .then(res => {
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error creating emp_locations table -> " + JSON.stringify(e));
        });

      /*creation de table emp_logins */
      /*champs  = md5,password,salt,sha1,sha256,username,uuid,employee_id*/
      db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePrefix + 'logins (md5 TEXT,password TEXT,salt TEXT,sha1 TEXT,sha256 TEXT,username TEXT,uuid INTEGER,employee_id INTEGER ,CONSTRAINT fk_employees FOREIGN KEY (employee_id) REFERENCES ' + this.tablePrefix + 'employees(id_value) ON DELETE CASCADE)', [])
        .then(res => {
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error creating emp_logins table -> " + JSON.stringify(e));
        });

      /*creation de table emp_names */
      /*champs  = title,first,last,employee_id*/
      db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePrefix + 'names (title TEXT,first TEXT,last TEXT,employee_id INTEGER ,CONSTRAINT fk_employees FOREIGN KEY (employee_id) REFERENCES ' + this.tablePrefix + 'employees(id_value) ON DELETE CASCADE)', [])
        .then(res => {
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error creating emp_names table -> " + JSON.stringify(e));
        });

      /*creation de table emp_pictures */
      /*champs  = large,medium,thumbnail,employee_id*/
      db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePrefix + 'pictures (large TEXT,medium TEXT,thumbnail TEXT,employee_id INTEGER,CONSTRAINT fk_employees FOREIGN KEY (employee_id) REFERENCES ' + this.tablePrefix + 'employees(id_value) ON DELETE CASCADE)', [])
        .then(res => {
          console.log('execute emp_pictures table sql');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error creating emp_pictures table -> " + JSON.stringify(e));
        });

      /*creation de table emp_registrations  */
      /*champs  = date,age,employee_id*/
      db.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tablePrefix + 'registrations (date TEXT,age INTEGER,employee_id INTEGER ,CONSTRAINT fk_employees FOREIGN KEY (employee_id) REFERENCES ' + this.tablePrefix + 'employees(id_value) ON DELETE CASCADE)', [])
        .then(res => {
          console.log('execute emp_registrations table sql');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error creating emp_registrations table -> " + JSON.stringify(e));
        });

    }).catch(e => {
      console.log(e);
      console.log("error in database creation  " + JSON.stringify(e));
    });

  }

  /*Récupérer la liste des employees depuis l'API en utilisant le provider "employeesProvider"*/
  getEmployeesFromApi() {
    this.employeesProvider.getEmployees().subscribe(employees => {
      this.employeesList = employees;
    });
  }

  /*Synchroniser la base local avec l'API*/
  synchronizeDatabase() {
    this.createDatabase();
    this.employeesList.forEach((employee) => {
      this.sqlite.create({
        name: this.database_name,
        location: this.database_location
      }).then((db: SQLiteObject) => {
        /* vérifier est ce que l'employee existe déja*/
        console.log('vérifier est ce que existe déja');
        db.executeSql('SELECT * FROM ' + this.tablePrefix + 'employees WHERE id_value = ?', [employee.id.value])
          .then(res => {
            console.log(res.rows.length);
            if (res.rows.length > 0) {
              /*modification d'employee*/
              this.updateEmployee(employee);
            } else {
              /*Inseretion d'employee*/
              this.insertEmployee(employee);
            }
          })
          .catch(e => {
            console.log("error checking/inserting in emp_employees table : " + JSON.stringify(e));
          });
      }).catch(e => {
        console.log("synchronization error : " + JSON.stringify(e));
      });

    });
    this.showToast("Synchronisation terminée", "bottom", 800);
  }

  /*L'insertion d'un employee*/
  insertEmployee(employee) {
    this.sqlite.create({
      name: this.database_name,
      location: this.database_location
    }).then((db: SQLiteObject) => {
      /*champs  = id_value,id_name,cell,email,gender,nat,phone*/
      db.executeSql('INSERT INTO ' + this.tablePrefix + 'employees VALUES(?,?,?,?,?,?,?)', [employee.id.value, employee.id.name, employee.cell, employee.email, employee.gender, employee.nat, employee.phone])
        .then(function (res) {
          console.log(JSON.stringify(res));
          console.log('inserting in emp_employees table');
        })
        .catch(e => {
          console.log("error inserting in emp_employees : " + JSON.stringify(e));
        });


      /*champs  = date,age,employee_id*/
      db.executeSql('INSERT INTO ' + this.tablePrefix + 'date_births VALUES(?,?,?)', [employee.dob.date, employee.dob.age, employee.id.value])
        .then(res => {
          console.log(JSON.stringify(res));
          console.log('inserting in emp_date_birthstable');
        })
        .catch(e => {
          console.log("error inserting in emp_date_births table : " + JSON.stringify(e));
        });


      /*champs  = city,latitude,longitude,country,postcode,state,street_number,street_name,timezone_offset,timezone_description,employee_id*/
      db.executeSql('INSERT INTO ' + this.tablePrefix + 'locations VALUES(?,?,?,?,?,?,?,?,?,?,?)', [employee.location.city, employee.location.coordinates.latitude, employee.location.coordinates.longitude, employee.location.country, employee.location.postcode, employee.location.state, employee.location.street.number, employee.location.street.name, employee.location.timezone.offset, employee.location.timezone.description, employee.id.value])
        .then(res => {
          console.log('inserting in emp_locations table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error inserting in emp_locations table : " + JSON.stringify(e));
        });

      /*champs  = md5,password,salt,sha1,sha256,username,uuid,employee_id*/
      db.executeSql('INSERT INTO ' + this.tablePrefix + 'logins VALUES(?,?,?,?,?,?,?,?)', [employee.login.md5, employee.login.password, employee.login.salt, employee.login.sha1, employee.login.sha256, employee.login.username, employee.login.uuid, employee.id.value])
        .then(res => {
          console.log('inserting in emp_logins table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error inserting in emp_logins table : " + JSON.stringify(e));
        });

      /*champs  = title,first,last,employee_id*/
      db.executeSql('INSERT INTO ' + this.tablePrefix + 'names VALUES(?,?,?,?)', [employee.name.title, employee.name.first, employee.name.last, employee.id.value])
        .then(res => {
          console.log('inserting in emp_names table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error inserting in emp_names table : " + JSON.stringify(e));
        });

      /*champs  = large,medium,thumbnail,employee_id*/
      db.executeSql('INSERT INTO ' + this.tablePrefix + 'pictures VALUES (?,?,?,?)', [employee.picture.large, employee.picture.medium, employee.picture.thumbnail, employee.id.value])
        .then(res => {
          console.log('inserting in emp_pictures table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error inserting in emp_pictures table : " + JSON.stringify(e));
        });

      /*champs  = date,age,employee_id*/
      db.executeSql('INSERT INTO ' + this.tablePrefix + 'registrations VALUES(?,?,?)', [employee.registered.date, employee.registered.age, employee.id.value])
        .then(res => {
          console.log('inserting in emp_registrations table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error inserting in emp_registrations table : " + JSON.stringify(e));
        });

    }).catch(e => {
      console.log("general error in insertion :  " + JSON.stringify(e));
    });

  }

  /*Modification d'un employee*/
  updateEmployee(employee) {
    this.sqlite.create({
      name: this.database_name,
      location: this.database_location
    }).then((db: SQLiteObject) => {
      /*champs  = id_value,id_name,cell,email,gender,nat,phone*/
      db.executeSql('UPDATE ' + this.tablePrefix + 'employees SET id_name=?,cell=?,email=?,gender=?,nat=?,phone =?,phone = ? WHERE id_value = ? ', [employee.id.name, employee.cell, employee.email, employee.gender, employee.nat, employee.phone, employee.id.value])
        .then(function (res) {
          console.log(JSON.stringify(res));
          console.log('updating emp_employees table');
        })
        .catch(e => {
          console.log("error updating emp_employees : " + JSON.stringify(e));
        });


      /*champs  = date,age,employee_id*/
      db.executeSql('UPDATE ' + this.tablePrefix + 'date_births SET date = ?, age= ? WHERE employee_id = ?', [employee.dob.date, employee.dob.age, employee.id.value])
        .then(res => {
          console.log(JSON.stringify(res));
          console.log('up updating emp_date_births table');
        })
        .catch(e => {
          console.log("error updating emp_date_births table : " + JSON.stringify(e));
        });


      /*champs  = city,latitude,longitude,country,postcode,state,street_number,street_name,timezone_offset,timezone_description,employee_id*/
      db.executeSql('UPDATE ' + this.tablePrefix + 'locations SET city = ?,latitude=?,longitude=?,country=?,postcode=?,state=?,street_number=?,street_name=?,timezone_offset=?,timezone_description=? WHERE employee_id =?', [employee.location.city, employee.location.coordinates.latitude, employee.location.coordinates.longitude, employee.location.country, employee.location.postcode, employee.location.state, employee.location.street.number, employee.location.street.name, employee.location.timezone.offset, employee.location.timezone.description, employee.id.value])
        .then(res => {
          console.log('updating emp_locations table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error updating emp_locations table : " + JSON.stringify(e));
        });

      /*champs  = md5,password,salt,sha1,sha256,username,uuid,employee_id*/
      db.executeSql('UPDATE ' + this.tablePrefix + 'logins SET md5=?,password=?,salt=?,sha1=?,sha256=?,username=?,uuid=? WHERE employee_id = ?', [employee.login.md5, employee.login.password, employee.login.salt, employee.login.sha1, employee.login.sha256, employee.login.username, employee.login.uuid, employee.id.value])
        .then(res => {
          console.log('updating emp_logins table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error updating emp_logins table : " + JSON.stringify(e));
        });

      /*champs  = title,first,last,employee_id*/
      db.executeSql('UPDATE ' + this.tablePrefix + 'names SET title =?,first=?,last=? WHERE employee_id =? ', [employee.name.title, employee.name.first, employee.name.last, employee.id.value])
        .then(res => {
          console.log('updating emp_names table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error updating emp_names table : " + JSON.stringify(e));
        });

      /*champs  = large,medium,thumbnail,employee_id*/
      db.executeSql('UPDATE ' + this.tablePrefix + 'pictures SET large =?,medium=?,thumbnail=? WHERE employee_id=?', [employee.picture.large, employee.picture.medium, employee.picture.thumbnail, employee.id.value])
        .then(res => {
          console.log('updating emp_pictures table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error updating emp_pictures table : " + JSON.stringify(e));
        });

      /*champs  = date,age,employee_id*/
      db.executeSql('UPDATE ' + this.tablePrefix + 'registrations SET  date=?,age=? WHERE employee_id =? ', [employee.registered.date, employee.registered.age, employee.id.value])
        .then(res => {
          console.log('updating emp_registrations table');
          console.log(JSON.stringify(res));
        })
        .catch(e => {
          console.log("error updating emp_registrations table : " + JSON.stringify(e));
        });

    }).catch(e => {
      console.log("general error in update :  " + JSON.stringify(e));
    });
  }

  /*Navigation vers la page OnlineListPage*/
  showEmployeesFromApi() {
    this.navCtrl.push(OnlineListPage);
  }
  /*Navigation vers la page OfflineListPage*/
  showEmployeesFromDB() {
    this.navCtrl.push(OfflineListPage);
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
