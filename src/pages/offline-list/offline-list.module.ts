import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineListPage } from './offline-list';

@NgModule({
  declarations: [
    OfflineListPage,
  ],
  imports: [
    IonicPageModule.forChild(OfflineListPage),
  ],
})
export class OfflineListPageModule {}
