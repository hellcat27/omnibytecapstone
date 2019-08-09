import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  passedId = null;
  wordsArray: any;
  returnValue = '';

  constructor(private navParams: NavParams, private modalController: ModalController, private api: ApiService) { }

  ngOnInit() {
    this.passedId = this.navParams.get('custom_id');
    this.wordsArray = this.api.getOcrDataArray();
    console.log('modal test: ' + this.wordsArray);
  }

  addWord(event: any){
    console.log(event);
    this.returnValue += (event.srcElement.innerText + ' ');
  }

  clearReturnField(){
    this.returnValue = '';
  }

  closeModal() {
    this.modalController.dismiss(this.returnValue);
  }

}