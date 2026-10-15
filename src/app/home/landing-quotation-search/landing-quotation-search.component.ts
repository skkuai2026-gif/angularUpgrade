import { QuotationService } from './../../quotation/services/quotation.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { Router } from '@angular/router';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OfflineService } from './../../offline/offline.service';
import { SearchResult, SearchResultRow } from './../../models/common/search-result';

@Component({
  selector: 'sym-landing-quotation-search',
  templateUrl: './landing-quotation-search.component.html',
  styleUrls: ['./landing-quotation-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LandingQuotationSearchComponent extends BaseSearchComponent<QuotationService> {
  downloadPDFDetails: { button_id: any; link: any; ref_id: any; refNum: string };
  constructor(
    public service: QuotationService,
    public router: Router,
    public settingService: SettingService,
    public offlineService: OfflineService
  ) {
    super(service, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.addLink = this.getQuotationLink();
  }

  private getQuotationLink() {
    let quotationLink = '/quotation';
    let insuranceTypeCd = this.getInsuranceType();
    if (insuranceTypeCd != undefined) {
      if (insuranceTypeCd == 'LIFE' || insuranceTypeCd == 'HEALTH') {
        quotationLink = insuranceTypeCd == 'HEALTH' ? '/quotationHealth' : '/quotation';
      } else if (insuranceTypeCd == 'AUTO' || insuranceTypeCd == 'TRAVEL') {
        quotationLink = '/quotationInsurance';
        //Commenting the below for now as it is not functional
        //quotationLink = '/quotation-policy-insurance';
      } else {
        quotationLink = '/quotationInsurance';
      }
      // else if (insuranceTypeCd == 'HOME') quotationLink = '/quotationHome';
      // else if (insuranceTypeCd == 'TRAVEL') quotationLink = '/quotationTravel';
      // else if (insuranceTypeCd == 'HEALTH') quotationLink = '/quotationHealth';
    }
    return quotationLink;
  }
  protected getMoreOptionList(): any[] {
    return [
      {
        id: 'Edit',
        link: '/' + this.getQuotationLink() + '/:id',
        text: 'Edit',
      },
      {
        id: 'Delete',
        link: '/quotation-search',
        text: 'delete',
      },
      {
        id: 'Copy',
        link: '/' + this.getQuotationLink() + '/:id',
        text: 'copy',
      },
      {
        id: 'Download',
        link: '/quotation-search',
        text: 'DOWNLOADPDF',
      },
    ];
  }
  onMoreButtonClicked(searchRecord: SearchResultRow) {
    let recordVal = this.getRecordValue(searchRecord, 'SearchProspectDO.quoteStatusCd');
    if ('PENDING' == recordVal) {
      let newMoreOptionList = this.getMoreOptions(['Download']);
      searchRecord.moreOptionList = newMoreOptionList;
    }
  }
  Edit_click(optionDetails: { button_id; link; ref_id }) {
    // console.log(optionDetails.ref_id, ' edit');

    let link: string;
    link = optionDetails.link.toString().replace(
      ':id',

      optionDetails.ref_id
    );

    this.router.navigate([link]);
  }
  Copy_click(optionDetails: { button_id; link; ref_id }) {
    // console.log(optionDetails.ref_id, ' Copy');
    this.service.copyQuotation(optionDetails.ref_id).subscribe(
      (quotation) => {
        // console.log(quotation);
        this.service.responseIO = JSON.parse(JSON.stringify(quotation));
        let link: string;
        let url_id: any;
        url_id =
          this.settingService.getApplicationMode() === 'offline'
            ? this.service.responseIO.data.Entity.object
            : this.service.responseIO.data.Entity.id;
        link = optionDetails.link.toString().replace(':id', url_id);
        this.router.navigate([link]);
      },
      (error) => {
        console.log('Copy Quotation load failed.');
        console.log('Error:', error);
      }
    );
  }
  Delete_click(optionDetails: { button_id; link; ref_id }) {
    // console.log(optionDetails.ref_id, ' Delete');
    this.service.deleteQuotation(optionDetails.ref_id).subscribe(
      (deleteResponse) => {
        if (deleteResponse['success'] == true) {
          this.success(deleteResponse['message'], () => {
            this.reloadCurrentRoute();
          });
        } else {
          this.error(deleteResponse['message']);
        }
      },
      (error) => {
        console.log('Delete Quotation load failed.');
        console.log('Error:', error);
      }
    );
  }

  Delete_All_click(optionDetails: { button_id; link; ref_id }) {
    this.service.deleteQuotations(optionDetails.ref_id).subscribe(
      (deleteResponse) => {
        if (deleteResponse['message'] == 'Successful' && deleteResponse['success']) {
          this.reloadCurrentRoute();
        } else {
          this.error(deleteResponse['message'] + ' Something went wrong.Kindly try again!', undefined, true);
        }
      },
      (error) => {
        console.log('Delete Quotation load failed.');
        console.log('Error:', error);
      }
    );
  }
  Download_click(optionDetails: { button_id: any; link: any; ref_id: any; refNum: string }) {
    // console.log(optionDetails);
    this.downloadPDFDetails = undefined;
    this.service.getOutputPreferences(optionDetails.ref_id).subscribe(
      (body) => {
        this.service.responseIO = JSON.parse(JSON.stringify(body));
        this.openModal('downloadPDFModal');
        this.downloadPDFDetails = optionDetails;
      },
      (error) => {
        console.log('getOutputPreferences failed.');
        console.log('Error:', error);
      }
    );
  }

  downloadPDF() {
    let respData: any;
    this.service.generateIllustrationPdfOnID(this.downloadPDFDetails.ref_id).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        if (respData.success) {
          if (
            this.settingService.isRhosimulator === true ||
            this.settingService.getApplicationMode() === 'online'
          ) {
            this.downloadOrOpenContent(
              respData.data.pdfFileContents,
              'pdf',
              this.downloadPDFDetails.refNum != undefined ? this.downloadPDFDetails.refNum : 'download'
            );
          } else {
            //open pdf in offline
            this.offlineService.openPdf(respData.data.pdfFileContents);
          }
        } else {
          this.error(respData.message);
        }
        this.downloadPDFDetails = undefined;
      },
      (error) => {
        console.log('PDF Generate failed.');
        console.log('Error:', error);
      }
    );
  }
}
