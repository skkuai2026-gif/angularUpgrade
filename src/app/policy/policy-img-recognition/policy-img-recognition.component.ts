import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { AimlService } from 'src/app/business-common/service/aiml.service';
declare const showImageLoader: any;
declare const hideImageLoader: any;
@Component({
  selector: 'sym-policy-img-recognition',
  templateUrl: './policy-img-recognition.component.html',
  styleUrls: ['./policy-img-recognition.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyImgRecognitionComponent extends BaseComponent<PolicyService> implements OnInit {
  @Input() documentImageList;
  @Output() imageVerificationDone = new EventEmitter<boolean>();

  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  // public captures: Array<any>;
  capturedImg: any;
  isLiveCapture: boolean;

  currentUploadedPhoto: File | null = null;
  uploadedPic: File | null = null;
  comaperedImageSelected: any;
  displayVerfyPop: boolean;
  imageCompiled: boolean;
  comparedImageResponse: any;
  imageStreamingObj: any;
  constructor(
    policyService: PolicyService,
    public settingService: SettingService,
    public aimlService: AimlService
  ) {
    super(policyService);
    // this.captures = [];
    this.isLiveCapture = false;
    this.displayVerfyPop = false;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.isLiveCapture) this.initialiseCaptureImg();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['documentImageList'] && changes['documentImageList'].currentValue) {
      if (this.documentImageList.length > 0) {
        this.onVerifyClick();
      }
    }
  }

  public onVerifyClick() {
    this.displayVerfyPop = true;
    this.imageCompiled = false;
    setTimeout(() => {
      this.comaperedImageSelected =
        this.comaperedImageSelected != undefined ? this.comaperedImageSelected : this.documentImageList[0];
      this.openModal('verifyImgPopup');
    }, 0);
  }

  public onPopUpClose() {
    hideImageLoader();
    this.displayVerfyPop = false;
    this.closeModal('verifyImgPopup');
    this.imageCompiled = false;
    this.imageVerificationDone.emit();
    this.stopCamera();
  }

  public onFileChange(files: FileList) {
    if (this.isLiveCapture) this.onLiveCapture();
    this.uploadedPic = files.item(0);
    let ext = ['jpeg ', 'png', 'jpg'];
    if (
      !this.isValueAvailableInList(
        ext,
        this.uploadedPic.name
          .substring(this.uploadedPic.name.lastIndexOf('.') + 1, this.uploadedPic.name.length)
          .toLowerCase()
      )
    ) {
      this.error(this.service.getMultilingualMessage('fileTypeAllowed', [ext.toString()]), undefined, true);
      this.uploadedPic = undefined;
      this.currentUploadedPhoto = undefined;
      return false;
    }

    if (this.uploadedPic.size < 50000) {
      this.error(this.service.getMultilingualMessage('minFileSize', ['50000'.toString()]), undefined, true);
      this.uploadedPic = undefined;
      this.currentUploadedPhoto = undefined;
      return false;
    }

    // this.currentPhoto = files.item( 0 );

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.currentUploadedPhoto = event.target.result;
    };
    reader.readAsDataURL(files.item(0));
  }

  onInputFileClick(event) {
    event.target.value = '';
    if (this.isLiveCapture) {
      this.isLiveCapture = !this.isLiveCapture;
      this.capturedImg = undefined;
      if (this.imageStreamingObj != undefined) this.stopCamera();
    }
    // if (this.isClearFileName) {
    //   // event.target.value = '';
    //   this.isClearFileName = false;
    // }
  }

  public compareImages() {
    let fileDataType = this.getFileDataType(this.comaperedImageSelected.fileLocation);
    showImageLoader();
    this.aimlService
      .compareImage(
        this.comaperedImageSelected.fileContents,
        this.uploadedPic != undefined ? this.uploadedPic : undefined,
        this.capturedImg != undefined ? this.capturedImg.replace('data:image/png;base64,', '') : undefined
      )
      .subscribe(
        (successResponse) => {
          this.imageCompiled = true;
          this.comparedImageResponse = successResponse;
          console.log(successResponse);
          hideImageLoader();
        },
        (error) => {
          console.log('Image comparison failed.');
          console.log('Error:', error);
          error.status = 404;
          if (error.status == 404) {
            error.message = 'The server is not responding, Kindly retry in sometime!';
          }
          hideImageLoader();
          this.imageCompiled = true;
          this.comparedImageResponse = error;
        }
      );
    this.stopCamera();
  }

  public onDocSelected(doc) {
    for (let i = 0; i < this.documentImageList.length; i++) {
      if (this.documentImageList[i].fileLocation === doc.target.value) {
        this.comaperedImageSelected = this.documentImageList[i];
        break;
      }
    }
  }

  public initialiseCaptureImg() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.imageStreamingObj = stream;
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
        })
        .catch((error) => {
          console.log('Error:', error);
          hideImageLoader();
          this.imageCompiled = true;
          this.comparedImageResponse = error;
        });
    }
  }

  public capture() {
    this.uploadedPic = undefined;
    this.currentUploadedPhoto = undefined;
    var context = this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 285, 200);
    // this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
    this.capturedImg = this.canvas.nativeElement.toDataURL('image/png');
    // console.log(this.captures);
  }

  public onLiveCapture() {
    this.uploadedPic = undefined;
    this.currentUploadedPhoto = undefined;
    this.isLiveCapture = !this.isLiveCapture;
    if (this.isLiveCapture) {
      this.initialiseCaptureImg();
    } else {
      this.capturedImg = undefined;
      this.stopCamera();
    }
  }
  onTryAgainClick() {
    this.imageCompiled = false;
    if (this.isLiveCapture) this.onLiveCapture();
  }

  protected stopCamera() {
    if (this.imageStreamingObj != undefined)
      this.imageStreamingObj.getTracks().forEach(function (track) {
        track.stop();
      });
  }
}
