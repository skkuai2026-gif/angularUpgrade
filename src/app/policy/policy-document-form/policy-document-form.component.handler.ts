import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';
import { ResponseIO } from 'src/app/models/responseIO';

// declare const applyAllVisibilityStates: any;

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyDocumentFormHandler extends BaseComponent<PolicyService> implements OnChanges {
  /**
   * This variable a string value that specifies the feature to hide/show the download button.
   */
  agentDownloadFeature: string;

  /**
   * Manages the visibility of panels within the component.
   * This object maps panel identifiers (as keys) to their visibility state (boolean).
   */
  public panelVisibility: { [key: string]: boolean };

  /**
   * A map that stores HTML and CSS content for different eForm previews.
   * The keys are unique identifiers for each document or preview,
   * and the values are objects containing HTML and CSS associated with the key.
   */
  public eFormPreviewHtmlMap = new Map<string, { html: string; css: string }>();

  /**
   * Represents the currently selected service document.
   */
  public selectedServiceDocument: any;

  /**
   * Provides access to a list of DOM elements referenced by 'eFormPreviewDiv'.
   * This allows direct manipulation of each element in the list, such as applying dynamic styles or accessing properties.
   * The elements are accessed after the view has been initialized, as specified by { static: false }.
   * Using `ViewChildren` enables interaction with multiple instances of the referenced elements in the component's view.
   */
  @ViewChildren('eFormPreviewDiv', { read: ElementRef }) dynamicContentRefs: QueryList<ElementRef>;

  /**
   * Holds the list of navigation links used in the component.
   * This list is used to dynamically generate the navigation structure in the component's template.
   */
  public navigationLinkList: NavigationLink[];

  /**
   * This variable it used to hide/show the download button on basis of the Application property 'ISEFORMDOWNLOADREQUIRED'
   */
  public showDownloadButton: boolean;

  // @ViewChild('eFormPreviewDivHtml', { static: false }) eFormPreviewDivHtml: ElementRef;

  public isClearBtnReq: boolean;

  constructor(policyService: PolicyService) {
    super(policyService);
    this.panelVisibility = {};
    this.showDownloadButton =
      this.service.getApplicationPropertyValue('ISEFORMDOWNLOADREQUIRED') != undefined
        ? this.service.getApplicationPropertyValue('ISEFORMDOWNLOADREQUIRED') == 'YES'
          ? true
          : false
        : false;
    this.isClearBtnReq = true;
  }

  ngOnInit(): void {
    this.setNavigationLinks();
    //Added to hide/show the download button if the download feature exists
    if (!this.showDownloadButton && this.agentDownloadFeature != undefined) {
      this.showDownloadButton = this.service.checkFeatureIsApplicable(this.agentDownloadFeature);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (
      (changes['responseUpdated'] &&
        changes['responseUpdated'].currentValue &&
        changes['responseUpdated'].currentValue == true) ||
      (changes['responseUpdated'] && changes['responseUpdated'].firstChange == true)
    ) {
      this.panelVisibility = {};
      this.eFormPreviewHtmlMap = new Map<string, { html: string; css: string }>();
      if (this.selectedServiceDocument) {
        // this.loadPreview(this.selectedServiceDocument, 'htmlEntry', false);
        if (!this.checkPreviewExists(this.selectedServiceDocument))
          this.loadPreview(this.selectedServiceDocument, 'htmlEntry', false);
        setTimeout(() => {
          this.panelVisibility[this.selectedServiceDocument.documentCd] = true;
        }, 100);
      }
    }
  }

  private setNavigationLinks() {
    this.navigationLinkList = [];
    this.service.responseIO.data['PartyDocumentFormList'][0]['DocumentFormCategoryList'][0]['DocumentList'].filter(
      (documentEForm) => {
        let nav = new NavigationLink();
        nav.link = documentEForm.documentCd;
        nav.labelKey = this.service.getFieldLookupDesc(documentEForm, 'documentCd');
        this.navigationLinkList.push(nav);
      }
    );
  }

  onPanelClick(document: any) {
    this.selectedServiceDocument = document;
    this.panelVisibility[document.documentCd] = !this.panelVisibility[document.documentCd];
    if (this.panelVisibility[document.documentCd])
      //Added to set the events when the panel is closed/opened and the innerHtml is loaded again
      setTimeout(() => {
        this.setEventListener();
      }, 100);
    if (this.panelVisibility[document.documentCd] && !this.checkPreviewExists(document))
      this.loadPreview(document, 'htmlEntry', false);
  }

  protected selected_change(item: FieldItem) {
    this.selectedServiceDocument = item.model;
    let modelNameListArray = ['Entity', 'PartyDocumentFormList'];
    this.service.validatePolicy(modelNameListArray, true).subscribe(
      (successResponse) => {
        let respData = JSON.parse(JSON.stringify(successResponse));
        let responseIO = new ResponseIO();
        responseIO.data = this.service.responseIO.data;

        responseIO.metadata = Object.assign(this.service.responseIO.metadata, respData.metadata);
        responseIO.lookups = Object.assign(this.service.responseIO.lookups, respData.lookups);
        responseIO.lookupkeyFOptionList = this.service.responseIO.lookupkeyFOptionList;

        this.service.responseIO = responseIO;

        //this.service.refreshMetaData(respData);
        if (item.fieldValue == 'YES') {
          this.panelVisibility[item.model.documentCd] = true;
          //Added to set the events when the panel is closed/opened and the innerHtml is loaded again
          setTimeout(() => {
            this.setEventListener();
          }, 100);
          if (!this.checkPreviewExists(item.model)) this.loadPreview(item.model, 'htmlEntry', false);
        } else {
          this.warningConfirm(
            this.service.getMultilingualMessage('clearEformConfirmation', [
              this.service.getFieldLookupDesc(item.model, 'documentCd'),
            ]),
            () => {
              //On click of Ok button the corresponding panel will be closed
              this.panelVisibility[item.model.documentCd] = false;
              this.clearQuestionResponse(item.model);
            },
            () => {
              //On click of Cancel button the selected document will be checked.
              this.setTimeoutPromise(() => {
                //item.model.selected = 'YES';
                this.service.setModelFieldValue(item.model, 'selected', 'YES');
              }, 10);
            }
          );
        }
      },
      (error) => {
        //this.errorApiResponse(error);
      }
    );
  }

  public clearQuestionResponse(model: any) {
    if (model?.DocumentQuestionResponseList?.questionSets != undefined) {
      if (model.DocumentQuestionResponseList.questionSets[0]?.questions?.length != 0) {
        model.DocumentQuestionResponseList.questionSets[0].questions.forEach((question) => {
          if (question['enabled'] != 'NO') this.setQuestionResponseValue(question, undefined);
        });
      }
      // To handle wrapper question sets, which could contain wrappers inside wrappers
      else if (model.DocumentQuestionResponseList.questionSets[0]?.questionSets?.length != 0) {
        this.clearNestedQuestionSets(model.DocumentQuestionResponseList.questionSets[0]);
      }
    }
  }

  private clearNestedQuestionSets(questionSet: any) {
    questionSet?.questionSets?.forEach((nestedQuestionSet: any) => {
      // Clear responses for questions in the current level of questionSets
      if (nestedQuestionSet.questions && nestedQuestionSet.questions?.length != 0) {
        nestedQuestionSet.questions.forEach((question: any) => {
          this.setQuestionResponseValue(question, undefined);
        });
      }
      // Recursively handle deeper nested questionSets (wrappers within wrappers)
      if (nestedQuestionSet.questionSets && nestedQuestionSet.questionSets?.length != 0) {
        this.clearNestedQuestionSets(nestedQuestionSet);
      }
    });
  }

  private setQuestionResponseValue(question: any, value: any) {
    Object.keys(question).forEach((key) => {
      if (key == 'responseValue') {
        question[key] = value;
      }
      if (key == 'responseValue_mk' || key == 'responseValue_dt' || key == 'responseValue_fc') {
        question[key] = value;
      }
    });
  }

  public loadPreview(serviceDocument: any, viewType: string, displayLoader?: boolean) {
    let buttonId = viewType == 'pdf' ? 'download_eForm_' : 'preview_eForm_';
    this.service.displayLoader(false, buttonId + serviceDocument.documentCd);
    this.service.eFormPreview(serviceDocument, viewType, displayLoader).subscribe(
      (successResponse) => {
        this.service.hideLoader(false, buttonId + serviceDocument.documentCd);
        let previewContents: any;
        let respData: any = JSON.parse(JSON.stringify(successResponse));
        if (respData.data?.EFormPreviewHtml != undefined) {
          previewContents = {
            html: respData.data.EFormPreviewHtml,
            css: respData.data.EFormPreviewHtmlStyles,
          };
          this.selectedServiceDocument = serviceDocument;
          if (viewType == 'html') {
            this.openModal('eFormPreviewModal');
          }
        } else if (respData.data?.pdfFileContents != undefined) {
          previewContents = respData.data.pdfFileContents;
          this.downloadOrOpenContent(
            previewContents,
            'pdf',
            this.service.getMultilingualLabel(this.service.getFieldLookupDesc(serviceDocument, 'documentCd'))
          );
        }
        this.eFormPreviewHtmlMap.set(serviceDocument.documentCd + '_' + viewType, previewContents);
        if (viewType == 'htmlEntry') {
          setTimeout(() => {
            this.setEventListener();
          }, 100);
        }
        // } else if (viewType == 'html') {
        //   setTimeout(() => {
        //     applyAllVisibilityStates(this.eFormPreviewDivHtml);
        //   }, 10);
        // }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  public onOkClick(document: any) {
    this.panelVisibility[document.documentCd] = false;
  }

  protected checkPreviewExists(serviceDocument: any): boolean {
    if (
      serviceDocument.formCaptureTypeCd === 'PREVIEW' &&
      this.eFormPreviewHtmlMap.get(serviceDocument.documentCd + '_htmlEntry') == undefined
    )
      return false;
    else {
      return true;
    }
  }

  protected setEventListener(): void {
    const dynamicContentArray = this.dynamicContentRefs.toArray();
    //Added so that only the selected eform document has its eventListeners set
    const targetIndex = dynamicContentArray.findIndex((contentRef) => {
      const element = contentRef.nativeElement;
      //To compare with the parentId
      if (element) return element.offsetParent.id == 'heading_' + this.selectedServiceDocument.documentCd;
    });

    if (targetIndex != -1) {
      const element = dynamicContentArray[targetIndex].nativeElement;
      // Set event listeners for input tags
      const inputTags = element.querySelectorAll('input');
      this.setChangeListener(inputTags);
      // Set event listeners for select tags
      const selectTags = element.querySelectorAll('select');
      this.setChangeListener(selectTags);
      // Set event listeners for textArea tags
      const textareaTags = element.querySelectorAll('textarea');
      this.setChangeListener(textareaTags);
    }
  }

  private setChangeListener(tags: NodeListOf<HTMLElement>): void {
    tags.forEach((tag: HTMLElement) => {
      tag.addEventListener('change', (event) => {
        this.handleQuestionChange(event);
      });
    });
  }

  private handleQuestionChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if (this.selectedServiceDocument?.DocumentQuestionResponseList) {
      const documentQuestionResponseList = this.selectedServiceDocument.DocumentQuestionResponseList;
      if (
        event.target['attributes'] != undefined &&
        event.target['attributes']['questionSetCd'] != undefined &&
        event.target['attributes']['questionSetCd']['nodeValue'] != undefined &&
        documentQuestionResponseList.questionSets[0]?.questionSetCd ===
          event.target['attributes']['questionSetCd']['nodeValue']
      ) {
        if (documentQuestionResponseList.questionSets[0]?.questionSets) {
          for (const questionSet of documentQuestionResponseList.questionSets[0]?.questionSets) {
            for (const question of questionSet.questions) {
              if (
                event.target['attributes']['dataElementCd'] != undefined &&
                event.target['attributes']['dataElementCd']['nodeValue'] &&
                question?.dataElementCd === event.target['attributes']['dataElementCd']['nodeValue']
              ) {
                question.responseValue = inputValue;
                question.responseValue_mk = inputValue;
                break;
              }
            }
          }
        } else {
          for (const question of documentQuestionResponseList.questionSets[0]?.questions) {
            if (
              event.target['attributes']['dataElementCd'] != undefined &&
              event.target['attributes']['dataElementCd']['nodeValue'] &&
              question?.dataElementCd === event.target['attributes']['dataElementCd']['nodeValue']
            ) {
              question.responseValue = inputValue;
              question.responseValue_mk = inputValue;
              break;
            }
          }
        }
      }
      this.selectedServiceDocument.DocumentQuestionResponseList = documentQuestionResponseList;
      this.service.setUpdated(this.selectedServiceDocument);
      //also update current service document into main node ie. PartyDocumentFormList
      if (this.service.responseIO.data['PartyDocumentFormList'] != undefined) {
        this.service.responseIO.data['PartyDocumentFormList'].filter((partyDocumentForm) => {
          if (partyDocumentForm['partyGuid'] == this.selectedServiceDocument['partyGuid']) {
            partyDocumentForm.DocumentFormCategoryList.filter((documentFormCategory) => {
              if (documentFormCategory['docCategoryCd'] == this.selectedServiceDocument['docCategoryCd']) {
                documentFormCategory.DocumentList.filter((document) => {
                  if (document['documentCd'] == this.selectedServiceDocument['documentCd']) {
                    document = this.selectedServiceDocument;
                  }
                });
              }
            });
          }
        });
      }
    }
  }

  protected checkClearBtnReq(value?: boolean) {
    this.isClearBtnReq = value;
  }
}
