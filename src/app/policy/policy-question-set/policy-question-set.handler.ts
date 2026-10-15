import { UpperCasePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { PolicyServiceHandler } from '../services/policy.service.handler';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyQuestionSetHandlerComponent extends BaseComponent<PolicyServiceHandler> implements OnChanges {
  @Input() questionSet: any;
  @Input() partyGuid: string;
  @Input() isParentPanel: boolean;
  @Input() policyService: PolicyServiceHandler;

  /**
   * It is triggered to emit the value of clear button is required on e-form
   * @boolean EventEmitter<boolean> parameter will send the boolen value from the component called
   */
  @Output() clearRequire = new EventEmitter<boolean>();

  public isUpperCaseSet: boolean;

  public uiLayoutXMLFormat;

  constructor(
    policyService: PolicyService,
    public settingService: SettingService,
    protected uppercasePipe: UpperCasePipe
  ) {
    super(policyService);
    // this.isUpperCaseSet = false;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.policyService != undefined && this.policyService != null) this.service = this.policyService;
    if (changes['questionSet'] && changes['questionSet'].currentValue) {
      this.renderXMLFormat();
    }
  }

  public onAddGridBasedQuestion(event) {
    let newQuestionModel = [];
    this.questionSet.questions[0].filter((question) => {
      let newQuestion = {};

      Object.keys(question).forEach((key) => {
        if (key === 'guid') {
          newQuestion[key] = this.service.generateGuid();
        } else if (key == 'responseValue') {
          newQuestion[key] = undefined;
        } else {
          newQuestion[key] = question[key];
        }
      });
      newQuestionModel.push(newQuestion);
    });
    this.questionSet.questions.push(newQuestionModel);
  }
  public removeGridBasedQuestion(index) {
    if (index > -1) {
      this.questionSet.questions.splice(index, 1);
    }
  }

  public onQuestionChanged(partyQuestionSetQuestion: any) {
    if (partyQuestionSetQuestion.question != undefined) {
      //if the current question impacts other Related questions as well
      //then need to pass the entire questionnaire response for the current party
      //and refresh it as well
      if (
        partyQuestionSetQuestion.question.partOfImpactingQuest != undefined &&
        partyQuestionSetQuestion.question.partOfImpactingQuest == true
      ) {
        this.handleImpactingQuestionChanged(partyQuestionSetQuestion);
      } else {
        this.handleCurrentQuestionChanged(partyQuestionSetQuestion);
      }
    }
  }

  protected handleImpactingQuestionChanged(partyQuestionSetQuestion: any) {
    let currPartyGuid = partyQuestionSetQuestion.partyGuid;
    let questionBody = { CurrPartyQuestionnaireResponseList: null };

    this.service.responseIO.data.PartyQuestionnaireResponseList.forEach((partyQuestionnaire: any) => {
      if (partyQuestionnaire.partyGuid == currPartyGuid) {
        questionBody.CurrPartyQuestionnaireResponseList = partyQuestionnaire;
        return;
      }
    });

    this.service.getReflexiveQuestionnaire(questionBody).subscribe((questionSetResponse) => {
      // console.log(questionSetResponse);
      //Replace the current responseIO for the same party question response
      this.service.responseIO.data.PartyQuestionnaireResponseList.forEach((partyQuestionnaire: any, i) => {
        if (partyQuestionnaire.partyGuid == currPartyGuid) {
          this.service.responseIO.data.PartyQuestionnaireResponseList[i] =
            questionSetResponse['data'].CurrPartyQuestionnaireResponseList;
          this.service.refreshLookups(questionSetResponse);
          return;
        }
      });
      setTimeout(() => {
        this.setFieldFocus(partyQuestionSetQuestion);
      }, 100);
    });
  }

  protected handleCurrentQuestionChanged(partyQuestionSetQuestion: any) {
    let questionBody = {
      currPartyGuid: partyQuestionSetQuestion.partyGuid,
      currQuestionSetCd: partyQuestionSetQuestion.questionSetCd,
      currParentReferencePath: partyQuestionSetQuestion.parentReferencePath,
      currDataElementCd: partyQuestionSetQuestion.question.dataElementCd,
      currResponseValue: partyQuestionSetQuestion.question.responseValue,
    };
    this.service.getReflexiveQuestionnaire(questionBody).subscribe(
      (questionSetResponse) => {
        // this.questionSet =
        //     questionSetResponse['data']['currQuestionSet'];
        // console.log(this.questionSet);
        // console.log(questionSetResponse['data']['currQuestionSet']);
        if (questionSetResponse['data']['currQuestionSet'].questions && this.questionSet['questions']) {
          this.questionSet['questions'] = questionSetResponse['data']['currQuestionSet'].questions;
        }
        if (questionSetResponse['data']['currQuestionSet'].questionSets && this.questionSet['questionSets']) {
          this.questionSet['questionSets'] = questionSetResponse['data']['currQuestionSet'].questionSets;
        }
        if (
          questionSetResponse['data']['currQuestionSet'].gridReflexiveQuestion &&
          this.questionSet['gridReflexiveQuestion']
        ) {
          this.questionSet['gridReflexiveQuestion'] =
            questionSetResponse['data']['currQuestionSet'].gridReflexiveQuestion;
        }
        if (questionSetResponse['lookups'] != undefined)
          Object.keys(questionSetResponse['lookups']).forEach((newKey) => {
            if (this.service.responseIO.lookups[newKey] == undefined) {
              this.service.responseIO.lookups[newKey] = questionSetResponse['lookups'][newKey];
            }
          });
        // console.log(
        //     this.service.responseIO.data.PartyQuestionnaireResponseList
        // );
        // console.log(partyQuestionSetQuestion);
        this.setFieldFocus(partyQuestionSetQuestion);
        console.log('Data upated successfully.');
        this.renderXMLFormat();
      },
      (error) => {
        console.log('Data load failed.');
        console.log('Error:', error);
      }
    );
  }

  setFieldFocus(questionSet: any): void {
    if (this.service.settingService.getApplicationMode() === 'offline') return;
    //ids have been set differently for different input types that needs to be corrected.

    let objToFocus = document.getElementById(questionSet.questionSetCd + '_' + questionSet.question.dataElementCd);
    if (objToFocus == undefined)
      objToFocus = document.getElementById(
        questionSet.questionSetCd +
          '_' +
          questionSet.question.dataElementCd +
          '_' +
          questionSet.question.responseValue
      );
    if (objToFocus == undefined)
      objToFocus = document.getElementById(
        questionSet.questionSetCd +
          '_' +
          questionSet.question.dataElementCd +
          '_' +
          questionSet.question.responseValue +
          '_' +
          questionSet.question.guid
      );
    if (objToFocus == undefined)
      objToFocus = document.getElementById(
        questionSet.questionSetCd + '_' + questionSet.question.dataElementCd + '_' + questionSet.question.guid
      );
    if (objToFocus != undefined) {
      // console.log('OBJ:', objToFocus);
      //logic below is for Ng Select that is FCOMBO /NCOMBO focus since these are angular components so search for the text box within the div and focus on that object.
      let el =
        objToFocus.tagName.toLowerCase() == 'ng-select'
          ? $(objToFocus.querySelector('div.ng-select-container')).find('input[type=text]')
          : undefined;
      if (el) {
        el.focus();
      } else {
        //   setTimeout(() => {
        objToFocus.focus();
      }
      // }, 200);
    }
  }

  private renderXMLFormat() {
    if (this.questionSet['uiLayoutXMLFormat'] != undefined) {
      let xmlFormat = this.questionSet['uiLayoutXMLFormat'].toString().replaceAll('&&', '&amp;&amp;');
      let parser = new DOMParser();
      let xml = parser.parseFromString(xmlFormat, 'text/xml');
      this.uiLayoutXMLFormat = <Element>xml.documentElement;
      // console.log(this.questionSet['uiLayoutXMLFormat_XML']);
      const errorNode = this.questionSet['uiLayoutXMLFormat_XML']?.querySelector('parsererror');
      if (errorNode) {
        // parsing failed
        console.error(errorNode);
        console.error(xmlFormat);
        this.settingService.alertService.error('XML configuration error: ' + errorNode['outerText']);
        return;
      }
      let isClearAllowed =
        this.uiLayoutXMLFormat?.getAttribute('isClearAllowed') != undefined
          ? this.uiLayoutXMLFormat?.getAttribute('isClearAllowed') == 'true'
            ? true
            : false
          : true;
      if (isClearAllowed != undefined) this.clearRequire.emit(isClearAllowed);
    }
  }
}
