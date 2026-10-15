import { PolicyService } from './../services/policy.service';
import { Component, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { PolicyDocumentHandlerComponent } from './policy-document.handler';
import { TabItem } from 'src/app/models/common/tab-items';
import data from 'src/assets/config/url-config.json';
import { SettingService } from 'src/app/system-common/services/setting.service';
@Component({
  selector: 'sym-policy-document',
  templateUrl: './policy-document.component.html',
  styleUrls: ['./policy-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyDocumentComponent extends PolicyDocumentHandlerComponent implements OnChanges {
  @Input() isAutoUwGeneratedFl: boolean;
  @Input() isSelectedCheckBoxReq: boolean;
  @Input() responseUpdated: boolean;
  private lastOpenedPanelId: string | null = null;
  companySUNPH: any;
  allowMultiImageUplodFl: any;
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
  }
  ngOnInit() {
    super.ngOnInit();
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.appendTooltipIcons();
  }
  requirementinfoPopup_click() {
    this.openModal('infoPopup');
  }
  onPopupClosed() {
    // Bootstrap collapse panel
    if (this.lastOpenedPanelId) {
      setTimeout(() => {
        const panel = document.getElementById(this.lastOpenedPanelId);
        if (panel) {
          // panel.classList.add('show');
          panel.click();
        }
        this.lastOpenedPanelId = null;
      }, 0);
    }
  }
  protected loadPartyDocumentTab() {
    if (
      this.service.responseIO.data.PartyDocumentList != undefined &&
      this.service.responseIO.data.PartyDocumentList.length != 0
    ) {
      this.loadUWDocuments();
      this.partyDocumentTabList = [];
      let tabIndex = 0;
      let userReferenceId =
        this.service.getUserLoginData() != undefined
          ? this.service.getUserLoginData()['userReferenceId']
          : undefined;
      this.service.responseIO.data.PartyDocumentList.filter((documentParty) => {
        let tab = new TabItem();
        tab.text =
          documentParty.partyRole === undefined
            ? documentParty.partyName
            : documentParty.partyRole === null
            ? documentParty.partyName
            : documentParty.partyRole === ''
            ? documentParty.partyName
            : documentParty.partyRole === 'Proposer'
            ? 'OWNER' + ': ' + documentParty.partyName
            : documentParty.partyRole === 'Primary'
            ? 'INSURED' + ': ' + documentParty.partyName
            : documentParty.partyRole === 'Primary/Proposer'
            ? 'OWNER/INSURED' + ': ' + documentParty.partyName
            : documentParty.partyRole + ': ' + documentParty.partyName;
        tab.isSelected = false;
        tab.id = documentParty.partyGuid;
        tab.index = tabIndex;
        if (
          userReferenceId != undefined &&
          documentParty.partyGuid != userReferenceId &&
          this.service.responseIO.data.Entity.allowModifyAllRoles != 'YES'
        )
          tab.visible = false;
        this.partyDocumentTabList.push(tab);
        tabIndex++;
      });

      this.partyDocumentTabList[0].isSelected = true;
      //this.selectedPartyDocumentTab = new TabItem();
      this.selectedPartyDocumentTab = this.partyDocumentTabList[0];
    }
  }
  ngAfterViewInit() {
    this.appendTooltipIcons();
  }

  private appendTooltipIcons() {
    setTimeout(() => {
      $('#heading_BANKREQ').on('click', '.tooltip-label-info', (event) => {
        this.lastOpenedPanelId = 'heading_BANKREQ';
        this.bankRequirementCategoryTooltipPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#heading_BANKREQAGENY').on('click', '.tooltip-label-info', (event) => {
        this.lastOpenedPanelId = 'heading_BANKREQAGENY';
        this.bankRequirementCategoryTooltipPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#heading_BANKREQGIO').on('click', '.tooltip-label-info', (event) => {
        this.lastOpenedPanelId = 'heading_BANKREQGIO';
        this.bankRequirementCategoryTooltipPopup();
      });
    }, 0);
    setTimeout(() => {
      $('#heading_BANKREQCTAFPBA').on('click', '.tooltip-label-info', (event) => {
        this.lastOpenedPanelId = 'heading_BANKREQCTAFPBA';
        this.bankRequirementCategoryTooltipPopup();
      });
    }, 0);

    setTimeout(() => {
      const partyDocs = this.service.responseIO?.data?.PartyDocumentList ?? [];
      // this.isPartyDocumentRendered=true;
      partyDocs.forEach((partyDoc: any) => {
        const categoryList = partyDoc.DocumentCategoryList ?? [];

        categoryList.forEach((category: any) => {
          const documentList = category.DocumentList ?? [];

          documentList.forEach((doc: any) => {
            const code = doc.documentCd;

            if (code === 'ADA' || code === 'BDIA') {
              $('#dataBANKREQHeading_BDIA').on('click', '.tooltip-label-info', (event) => {
                this.bankRequirementCategoryDocumentBDIAADATooltipPopup();
              });
              if (this.companySUNPH === 'SLOCPI') {
                $('#dataBANKREQHeading_ADA').on('click', '.tooltip-label-info', (event) => {
                  this.bankRequirementCategoryDocumentBPADATooltipPopup();
                });
              }
              if (this.companySUNPH === 'SLGFI') {
                $('#dataBANKREQAGENYHeading_BDIA').on('click', '.tooltip-label-info', (event) => {
                  this.bankRequirementCategoryDocumentBDIAADATooltipPopup();
                });
                $('#dataBANKREQAGENYHeading_ADA').on('click', '.tooltip-label-info', (event) => {
                  this.bankRequirementCategoryDocumentRCBCTooltipPopup();
                });
                $('#dataBANKREQHeading_ADA').on('click', '.tooltip-label-info', (event) => {
                  this.bankRequirementCategoryDocumentRCBCTooltipPopup();
                });
                $('#dataBANKREQGIOHeading_BDIA').on('click', '.tooltip-label-info', (event) => {
                  this.bankRequirementCategoryDocumentBDIAADATooltipPopup();
                });
                $('#dataBANKREQGIOHeading_ADA').on('click', '.tooltip-label-info', (event) => {
                  this.bankRequirementCategoryDocumentRCBCTooltipPopup();
                });
              }
            }
          });
        });
      });
    }, 100);
  }

  bankRequirementCategoryTooltipPopup() {
    this.openModal('requirementDocumentCatPopup');
  }
  bankRequirementCategoryDocumentBDIAADATooltipPopup() {
    this.openModal('imagesBPODocPopup');
  }
  bankRequirementCategoryDocumentBPADATooltipPopup() {
    this.openModal('imagesBPIADADocPopup');
  }
  bankRequirementCategoryDocumentRCBCTooltipPopup() {
    this.openModal('imagesRCBCADADocPopup');
  }

  ngOnDestroy() {
    this.closeModal('requirementDocumentCatPopup');
    this.closeModal('imagesBPODocPopup');
    this.closeModal('imagesBPIADADocPopup');
  }
}
