import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home'
import { RegisterPage } from '../register/register'
import { ListPage } from '../list/list'

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('username') username;
  @ViewChild('password') password;

  
  constructor(private alertCtrl:AlertController,private auth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  
  }

  alert(message: string) {
    this.alertCtrl.create({
      title: 'Info!',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn()
  {
    console.log(this.username.value, this.password.value);
    this.auth.auth.signInWithEmailAndPassword(this.username.value, this.password.value)
    .then(response => {
      if ( response.emailVerified )
      {
        console.log("Success");
        this.navCtrl.setRoot(ListPage);
      }
      else
      {
        alert("Verify your EMAIL Address");
      }

    }).catch((error) => {
      alert(error.message);
    });
    
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }



}
