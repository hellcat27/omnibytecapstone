import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ModalPage } from '../modal/modal.page';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
text: any;
responseContainer: any;
responseArray: string[] = Array();
value = 0;
nameString = '';
phoneString = '';
addressString = '';
name: any;
phonenumber: any;
address: any;
notes = '';
flag: number;
alternateOrientation: boolean;

  constructor(
    private api: ApiService,
    private modalController: ModalController,
    private emailComposer: EmailComposer
  ){ 
  }
  ngOnInit(){
    this.responseContainer = this.api.getTab3Response();
    this.setupResponseArray();
    this.api.setOcrDataArray(this.responseArray);
    this.text = this.responseArray;
  }

  refresh(){
    this.responseContainer = this.api.getTab3Response();
    this.setupResponseArray();
    this.api.setOcrDataArray(this.responseArray);
    this.text = this.responseArray;
  }

  setupResponseArray(){
    this.responseArray = [];
    for(var region of this.responseContainer.regions){
      for(var line of region.lines){
        for(var word of line.words){
          this.responseArray.push(word.text);
        }
      }
    }
  }

  async autoSelectName(){
    this.flag = 0;
    this.nameString = '';
    for(var region of this.responseContainer.regions){
      if(this.alternateOrientation == true){
        this.flag = 0;
      }
      for(var line of region.lines){
        if(this.alternateOrientation != true){
          this.flag = 0;
        }
        for(var word of line.words){
          if(this.flag == 1){
            this.nameString += (word.text + ' ');
          }
          if(word.text.toLowerCase() == 'name:' || word.text.toLowerCase() == 'name'){
            this.flag = 1;
          }
        }
      }
    }
    this.name = this.nameString;
  }

  async autoSelectPhoneNumber(){
    this.flag = 0;
    this.phoneString = '';
    for(var region of this.responseContainer.regions){
      if(this.alternateOrientation == true){
        this.flag = 0;
      }
      for(var line of region.lines){
        if(this.alternateOrientation != true){
          this.flag = 0;
        }
        for(var word of line.words){
          if(this.flag == 1){
            this.phoneString += (word.text + ' ');
          }
          if(word.text.toLowerCase() == 'number:' || word.text.toLowerCase() == 'number'){
            this.flag = 1;
          }
        }
      }
    }
    this.phonenumber = this.phoneString;
  }

  async autoSelectAddress(){
    this.flag = 0;
    this.addressString = '';
    for(var region of this.responseContainer.regions){
      if(this.alternateOrientation == true){
        this.flag = 0;
      }
      for(var line of region.lines){
        if(this.alternateOrientation != true){
          this.flag = 0;
        }
        for(var word of line.words){
          if(this.flag == 1){
            this.addressString += (word.text + ' ');
          }
          if(word.text.toLowerCase() == 'address:' || word.text.toLowerCase() == 'address'){
            this.flag = 1;
          }
        }
      }
    }
    this.address = this.addressString;
  }

  async selectName() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        custom_id: this.responseArray
      }
    });
    await modal.present();

    modal.onWillDismiss().then((data) => {
      this.name = data.data;
    })
  }

  async selectPhoneNumber() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        custom_id: this.responseArray
      }
    });
    await modal.present();

    modal.onWillDismiss().then((data) => {
      this.phonenumber = data.data;
    })
  }

  async selectAddress() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        custom_id: this.responseArray
      }
    });
    await modal.present();

    modal.onWillDismiss().then((data) => {
      this.address = data.data;
    })
  }

  submitEmail() {
    let email = {
      to: '',
      subject: 'test',
      body: 'Name: ' + this.name + '<br/>Phone Number: ' + this.phonenumber + '<br/>Address: ' + this.address + '<br/><br/>' + this.notes,
      isHtml: true
    };
 
    this.emailComposer.open(email);
  }
  
}
