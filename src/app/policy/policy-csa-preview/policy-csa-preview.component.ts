import { Component, EventEmitter, OnInit, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { ResponseIO } from 'src/app/models/responseIO';
import { CSAService } from 'src/app/csa/service/csa-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-policy-csa-preview',
  templateUrl: './policy-csa-preview.component.html',
  styleUrls: ['./policy-csa-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyCsaPreviewComponent extends BaseComponent<PolicyService> implements OnInit {
  /**
   * Will emit true if the quoteIllustration(Preview) in E-App preview is successfully Loaded.
   */
  @Output() policyCSAIllustrationLoaded = new EventEmitter<boolean>();
  csaPreviewHtmlPages: any;
  csaPreviewHtmlPagesProperty: any;
  public signtureMapObject = new Map();
  public signatureKey = [];
  public triggerBtnID;
  public triggerBtnClick = false;
  public currServiceSignature: any;

  constructor(policyService: PolicyService, public csaService: CSAService, public settingService: SettingService) {
    super(policyService);
    this.csaService = this.csaService;
  }
  ngOnInit() {
    super.ngOnInit();
    this.setCSAData();
    // this.displayIllustration();
    // $('.scrollDiv, .pgContent').css('overflow-y', 'hidden');
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (
      (changes['responseUpdated'] &&
        changes['responseUpdated'].currentValue &&
        changes['responseUpdated'].currentValue == true) ||
      (changes['responseUpdated'] && changes['responseUpdated'].firstChange == true)
    ) {
      this.setCSAData();
    }
  }
  ngOnDestroy() {
    // $('.pgContent').css('overflow', 'initial');
    // $('.scrollDiv, .pgContent').css('overflow-y', 'auto');
  }
  setCSAData() {
    let fnaSeq: any;
    if (this.settingService.getApplicationMode() === 'online') {
      this.service.getFNAId(this.service.responseIO.data.Entity.fnaId).subscribe((body) => {
        let resp = JSON.parse(JSON.stringify(body));
        fnaSeq = resp.data.cffSeq;
        if (fnaSeq != undefined && this.service.responseIO.data.Entity.fnaId != undefined) {
          this.csaService.id = fnaSeq;
          let modelNameBodyList = this.service.getModelNameBodyList(['Entity', 'ServiceSignatureList']);
          this.csaService.currentActiveTab = 'tab_csaIllustration';
          this.csaService.responseIO = new ResponseIO();
          this.csaService.load(this.csaService.id, modelNameBodyList).subscribe(
            (responseIO) => {
              // this.csaService.responseIO = new ResponseIO();
              this.csaService.responseIO = JSON.parse(JSON.stringify(responseIO));
              this.service.setCSAService(this.csaService);
            },
            (error) => {
              console.log('load Quotation failed, Error:', error);
            }
          );
        }
      });
    } else {
      fnaSeq = this.service.responseIO.data.Entity.fnaSeq;
      if (fnaSeq != undefined && this.service.responseIO.data.Entity.fnaId != undefined) {
        this.csaService.id = fnaSeq;
        let modelNameBodyList = this.service.getModelNameBodyList(['Entity', 'ServiceSignatureList']);
        console.log('modelNameBodyList', modelNameBodyList);
        this.csaService.currentActiveTab = 'tab_csaIllustration';
        this.csaService.responseIO = new ResponseIO();
        this.csaService.load(this.csaService.id, modelNameBodyList).subscribe(
          (responseIO) => {
            // this.csaService.responseIO = new ResponseIO();
            this.csaService.responseIO = JSON.parse(JSON.stringify(responseIO));
            this.service.setCSAService(this.csaService);
          },
          (error) => {
            console.log('load Quotation failed, Error:', error);
          }
        );
      }
    }
  }

  OnCaptureBtnClick() {
    console.log(
      'OnCaptureBtnClick document.readyState',
      document.readyState,
      this.service.getSessionStorageValue('buttonGUID')
    );
    this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
      var buttonObj = document.getElementById(serviceSignature.guid);
      console.log('buttonObj in oncapturebtnclick', buttonObj);
      if (buttonObj != undefined) {
        console.log('binding the button in oncapturebtmclick');
        buttonObj.addEventListener('click', this.onSignatureCapture.bind(event), false);
      } else {
        setTimeout(() => {
          // this.OnCaptureBtnClick();
        }, 100);
      }
    });
  }

  ngAfterViewInit() {
    console.log('in ngafterviewinit');
  }

  getElement() {
    console.log('in getElement');
    this.triggerBtnClick = false;
    let triggerBtnID = $('#buttonGUID').text();
    console.log('in setTimeout of getElement', triggerBtnID);

    this.triggerBtnClick = true;
    let serviceSignatureDO = this.service.responseIO.data.ServiceSignatureList.find(
      (existServiceSignature: any) => existServiceSignature.guid === triggerBtnID
    );
    if (serviceSignatureDO != null && serviceSignatureDO != undefined) {
      this.currServiceSignature = serviceSignatureDO;
    }
  }

  public onSignatureDone(signatureObject?: any) {
    this.triggerBtnClick = false;
  }

  onSignatureCapture(element) {
    console.log('onSignatureCapture', element.srcElement.id);
    let guid = element.srcElement.id;
    console.log('button click', guid);
    $('#buttonGUID').text(guid);
    $('#buttonGUID').trigger('click');
    // sessionStorage.setItem('buttonGUID',guid);
    // console.log("sessionStorage",sessionStorage);
    // location.reload();
  }
  csaIllustrationLoaded(csaIllustrationIsLoaded) {
    // this.copyCSASignIntoPolicySign();
    console.log('csaillustrationIsLoaded', csaIllustrationIsLoaded);
    this.policyCSAIllustrationLoaded.emit(csaIllustrationIsLoaded);
  }
  protected copyCSASignIntoPolicySign() {
    console.log(
      'before this.service.csaService.responseIO.data.ServiceSignatureList',
      this.service.csaService.responseIO.data.ServiceSignatureList
    );
    // console.log('before policy service', this.service.responseIO.data);
    if (this.service.csaService != undefined && this.service.csaService.responseIO != undefined) {
      // Clone the current ServiceSignatureList
      const policySignList = this.service.responseIO.data.ServiceSignatureList;
      const csaSignList = this.service.csaService.responseIO.data.ServiceSignatureList;
      console.log('before policySignList==csapreview', policySignList);
      console.log('before csaSignList====csapreview', csaSignList);
      const newServiceSignMap = new Map<string, any>();

      // Add all items from the policy list into the map (by guid)
      policySignList.forEach((item) => {
        newServiceSignMap.set(item.guid, item);
      });

      // Merge CSA list into the map
      csaSignList.forEach((csaSignature: any, i: number) => {
        if (newServiceSignMap.has(csaSignature.guid)) {
          // If guid exists, update CSA list with the newer value
          csaSignList[i] = newServiceSignMap.get(csaSignature.guid);
          console.log('149', csaSignList[i]);
        } else {
          // If not, add this item to the new list
          newServiceSignMap.set(csaSignature.guid, csaSignature);
          console.log('153', newServiceSignMap);
        }
      });

      // Replace the list
      this.service.responseIO.data.ServiceSignatureList = [];
      this.service.responseIO.data.ServiceSignatureList = Array.from(newServiceSignMap.values());

      console.log('after CSA service', this.service.csaService.responseIO);
      console.log('after policy service', this.service.responseIO.data);
    }
  }
}
