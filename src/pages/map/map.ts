import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

   @ViewChild('mapCanvas') mapElement: ElementRef;

   map: any;
   ActiveMarker: any=null;
   Lat: any= null;
   Long: any =null;
   DatabaseReference: any=null; // For attaching child_modified events and decoupling it
   KeyPassed: string=null;

  
  constructor(public Database:AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams,public ToastCntrl: ToastController) {
  
  this.KeyPassed = this.navParams.get('Key');
  console.log(this.KeyPassed + ' Key Passed');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.initMap();
    this.InitializeMarkerPosition();
    this.AttachDatabaseEvent();
  }


  initMap(){
    let mapEle= this.mapElement.nativeElement;
    this.map= new google.maps.Map(mapEle,{zoom : 14,
                                          center: {lat: 17.451571,lng: 78.381041}
                                        });
   /*var marker= new google.maps.Marker({position : {lat: 17.437098,lng: 78.386266},
                                        map:this.map,
                                        title: "You are here!"
                                      });*/

   google.maps.event.addListenerOnce(this.map, 'idle', () => {
          mapEle.classList.add('show-map');
  })
  
  }

  InitializeMarkerPosition(){
    console.log('Inside if');
    var DatabaseRef= this.Database.database.ref('/cabs'+'/'+this.KeyPassed.toString());
    DatabaseRef.once('value',(snapshot)=>{
     console.log('Lat '+ snapshot.val().geolocation.latitude+ ' Long '+ snapshot.val().geolocation.longitude);
     this.Lat= snapshot.val().geolocation.latitude;
     this.Long=snapshot.val().geolocation.longitude;
     this.UpdatePostion();
    })
  }
  
  AttachDatabaseEvent()
  { 
     var ChangedValue;
     var Latitude;
     var Longitude;
     var KeyValue=new String();
      this.DatabaseReference = this.Database.database.ref('/cabs'+'/'+this.KeyPassed.toString());
      this.DatabaseReference.on('child_changed',(snapshot)=>{
       ChangedValue= snapshot.val();
       KeyValue=snapshot.key.toString(); //Getting the changed value key name
       if(!KeyValue.localeCompare('geolocation')){
         console.log('Location recieved '+ChangedValue.latitude+' '+ ChangedValue.longitude);
         this.PresentMessage('Location recieved '+ChangedValue.latitude+' '+ ChangedValue.longitude);
         Latitude=ChangedValue.latitude;
         Longitude=ChangedValue.longitude;
         this.Lat=Latitude;
         this.Long=Longitude;
         this.UpdatePostion();
       }
     });
  }

  UpdatePostion()
  {
    console.log("Inside UpdatePostion");
    if(this.ActiveMarker==null)
    {
      console.log('Setting marker initially');
      this.SetMarker();
    }
    else{
      console.log('Updating marker position');
      this.ActiveMarker.setPosition({lat: parseFloat(this.Lat),lng: parseFloat(this.Long)});
    }
    this.map.setCenter({lat:parseFloat(this.Lat),lng: parseFloat(this.Long)});
  }

  SetMarker()
  {
    var Marker;
    //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var image= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAE6ElEQVRIS5WWe0yVZRzHP8/7nsPlkFwyEReWhDNvDNO8hKWZ19rcVOIPY6WxxLxW07LS6g+xudxqZuJt5srKtuYlKxuZBoYZoqLCIU1AJAS5CAiHczi392nPy4HQkcizPXtuv/f5/J7f7/s85wh6KDWfcSYq+fMx195PI3zmFIJ0C1WHjzJkwx5qDrx8NnY5j99tC9ETwJFNXthkOS5/mCB6zdvYgiwUrMtgRpnk1nFxOnIq4+8ZULE1frUUPCqEbEGK+4H4yLjSqIvpjEiqkFSsmkZzq4uE7Sc5FisYvQO7oyK+Hrgm4ZaQIkwgLw9cVvpRB7TzBBWZ8etjZ0avMxd8XkBiGAI9vA5vbSPWh59A1tkxpESPScB75RTW/pH4HA+AJkEaCEuQ+XnV0ZsZDy0tfU/1OwHFcyMyhn03bW2TZyXNRiKa8CsGoLU7I/0gAuZSgtADThrmLhKdCO0C4cFbyH32yIanspyms52Amk/iz0SnJY6xW/ZT5+wpM92ve4AZIcmUbys4G/fWVTP5JsA+JWzq8M1jf/XGplCoLeWmCzS1ItoNOrww+3fIQh3GPCigAE9qmwmrPkTWgpNLZhV4t5vmhZNtS0ZuGZdZG7ORYsbT4jawaODygVtKbjilCXT5DZyG7ASqjSM0HYsOVqBPqIUkPY94x1qyUnN3zTrnTjcBf83r++nQzOkrzsqv+aXGQ5XTR4NX4vcaCCE6T9Gdpju8V60fHRsO9kTG8Pvq4C2TfnOvNL+pXdXnar/ntEHLw5vIKXERrKtQtG9sBuDOnf/n9ihIE6FcCQui9HtRPnibJ840bf7AKoNnhnAsZBHVjQ1oUgNDKU8gpUW5ZioRFR6zBSl18JnyMedULjQDXIaNF0N34yhopv+HfiEqXrvvwIBVjrnSDVYjkFEfoK6CGquqxqr6u4xVX9moVlW1HoDj0sAvOXck6KBwHEIGjWpPUsnlMMrKbUyfUNcufw+IDoC5kfgPqPpe0T4nJbIVckoGEqPfYmh8E7RZqL0EovUE0jYIDmclsD8vGberkSJ7IYW7jyMUpKv33QFUuNyw4NgbhAaHUnylnJSo46ycVU1LuY5ozUHaBkNaxiaGPBLKjevlXLRXsnTSTzw/pwXauoSnO4A0yC8bzo/O5RjuRmpqqvg5p4h/1mXTUmINAOJh0fp3iIsbQG3NdU78+Td7Xj1M4ih/++3piH+3AMm16n5sKn+TqBAf1ysryT6ZT9m7p2kptSCcuUhrLLQ2WHn90xSKyywsTDrKkrRqcHRJ4N1yIHwcPDearRcnYnXY+eKZP4iO8eGoFIj6rda2iDneYFyYt9dMrhf8raCp9+1ekmyqTRkH3o1WiynH8lzNI4qf7jvnwRUNB8PHKiHfIc2uMu2Qopoz5SnAE1CR6vukKU1T1k6DRruFvGzrPPOiyRT0j6uGFxl+OdSPYIxWv7O/3lbplpqu7FUxDDACL7eBYY6VQ6qx+n3+KmGLvSD6pUvDoFlYLiUH2ROmZJtXsb0kzX7hdBiesarfhHVk/g/77L15tCfOnj8iDG+Rem1dWlD+iUPfjLvt92B+6kvnBTLR9FZjwrd79+b1BpCaunCCxH/KjIgQ5/d99eVjtwEWLV62URP6Gil97NyR2eOfge7g6YuX1Quh9zWkb/euHZmv3Abojbe9sf0X1SFC29FX+ikAAAAASUVORK5CYII=';
    Marker = new google.maps.Marker({
    position: {lat: parseFloat(this.Lat),lng: parseFloat(this.Long)},
      map: this.map,
      icon: image
       });
    console.log('Marker Set!');
    this.ActiveMarker=Marker;
  }

   GoBack()
  {
      this.DatabaseReference.off();
      this.DatabaseReference=null;
      this.RemoveMarker();
      this.navCtrl.pop();
      console.log('Going Back');
  }


   RemoveMarker()
  {
    if(this.ActiveMarker!=null)
    {
    this.ActiveMarker.setMap(null);
    }
    console.log("Removing Marker");
  }

  PresentMessage(Mssg: String)
  {
    const toast = this.ToastCntrl.create({
    message: Mssg.toString(),
    duration: 3000,
    position: 'bottom'
      });

    toast.present();
  }

}


