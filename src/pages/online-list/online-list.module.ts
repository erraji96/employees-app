import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineListPage } from './online-list';

@NgModule({
  declarations: [
    OnlineListPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlineListPage),
  ],
})
export class OnlineListPageModule {}
