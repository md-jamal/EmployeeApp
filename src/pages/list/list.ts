import { Component } from '@angular/core';
import { IonicPage, NavController,ActionSheetController } from 'ionic-angular';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {ListItem} from '../../app/Models/list.item.interface';

import {MapPage} from '../map/map';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  ListItemRef$ : FirebaseListObservable<ListItem[]>
  constructor(public navCtrl: NavController,private database:AngularFireDatabase,private actionSheetController: ActionSheetController,private auth: AngularFireAuth) {
  
    this.ListItemRef$= this.database.list('cabs');
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  selectedCab(SelectedListItem: ListItem){
    this.navCtrl.push(MapPage,{Key: SelectedListItem.$key});
  }

   signOut() 
  {
    this.auth.auth.signOut();
  }
}
