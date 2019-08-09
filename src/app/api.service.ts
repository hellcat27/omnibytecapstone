import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

ocrResponse: any;
ocrDataArray: any;

  constructor() { }

  setTab3Response(data){
    this.ocrResponse = data;
  }

  getTab3Response(){
    return this.ocrResponse;
  }

  setOcrDataArray(data){
    this.ocrDataArray = data;
  }

  getOcrDataArray(){
    return this.ocrDataArray;
  }
}
