import { Component } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { NavController, ActionSheetController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  submittedMessage;
  selectedImage: string = "";
  imageText: string = "";

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private loading: LoadingController,
    public http: HttpClient,
    public platform: Platform,
    private api: ApiService) { }

    public output: String;
    
  async selectSource() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Source',
      buttons: [
        {
          text: 'Capture Image',
          role: 'camera',
          icon: 'camera',
          handler: () => {
            return this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Use Libary',
          role: 'libary',
          icon: 'folder-open',
          handler: () => {
            return this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });
    await actionSheet.present();
  }

  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpg;base64,${imageData}`;//image/jpeg //data:image/jpg;base64, 
      this.submittedMessage =  this.makeBlob(`data:image/jpg;base64,${imageData}`)//data:image/octet-stream,
    });

  }

  makeBlob = function (dataURL) {//used to turn the image data into a binary octet-stream, the azure ocr service needs it in this format
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

  async recognizeImage() {
    this.output = '';
    var options = {
      apikey: '#USERAPIKEYHERE',
      language: 'eng',
    };

    
    const loading = await this.loading.create({
      message: 'Recognizing...',
      spinner: 'circles', // lines, lines-small, dots, bubbles, circles, crescent
    });
    loading.present();

    var httpOptions = {
      headers: new HttpHeaders({
        //'apikey': '24027dc14088957',
        'Content-Type': 'application/octet-stream',//application/x-www-form-urlencoded
        'Ocp-Apim-Subscription-Key': '#USERAPIKEYHERE'
      }),
      parameters: new HttpParams({

      })
    }
      
    console.log(this.submittedMessage);
    console.log(httpOptions.headers);
    //loading.dismiss();
    var that = this;//https://northcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText?mode=Handwritten //handwriting ocr service, unimplemented
    this.http.post('https://northcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr?language=en',this.submittedMessage,httpOptions).subscribe(
      (val: any) => {
        loading.dismiss();
        console.log("POST call successful return.", val);
        var line0 = val.regions[0].lines[0];
        var i = 0;
        var out = JSON.stringify(val);
        var dataEval = JSON.parse(out);
        for(var region of dataEval.regions){
          console.log(region);
          for(var line of region.lines){
            console.log(line);
            for(var word of line.words){
              console.log(word);
              console.log(word.text);
              this.output += word.text + " ";
            }
          }
        }
        this.api.setTab3Response(JSON.parse(out));
      },
      response => {
        loading.dismiss();
        console.log("POST call in error.", response);
      }
    );
  }
}
