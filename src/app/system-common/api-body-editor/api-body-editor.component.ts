import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ResponseIO } from './../../models/responseIO';
import { BaseService } from 'src/app/system-common/services/base.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-api-body-editor',
  templateUrl: './api-body-editor.component.html',
  styleUrls: ['./api-body-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ApiBodyEditorComponent extends BaseComponent<BaseService> implements OnInit {
  @Input() restApiDataInfo: any;
  // @Input() selectedApi: any;
  @Input() apiRequestData: string;
  @Input() apiResponseData: string;
  @Input() responseIO: ResponseIO;
  @Input() service: BaseService;
  @Input() disableReqInput: boolean;
  @Input() requestCollapseAll: boolean;
  @Input() responseCollapseAll: boolean;

  @Output() requestBtnClicked = new EventEmitter<any>();
  /**
   * Triggered when pop is closed.
   */
  @Output() popupClosed = new EventEmitter<boolean>();

  modifiedRequest = { value: null };
  updatedResponseIO: ResponseIO;
  public showAPITextArea: boolean;
  constructor(baseService: BaseService) {
    super(baseService);
    this.requestCollapseAll = false;
    this.responseCollapseAll = true;
    this.showAPITextArea = false;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['apiResponseData'] && changes['apiResponseData'].currentValue) {
      this.updatedResponseIO = JSON.parse(this.apiResponseData);
    }
  }

  downloadJson(filename) {
    let dataStr: any;
    if (filename == 'RequestIO') {
      dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(this.modifiedRequest.value != null ? this.modifiedRequest.value : this.apiRequestData);
    } else if (filename == 'ResponseIO') {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(this.apiResponseData);
    }

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataStr);
    linkElement.setAttribute('download', filename + '.json');
    let clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  }

  sendRequest() {
    this.requestBtnClicked.emit(this.modifiedRequest);
    setTimeout(() => {
      this.modifiedRequest = { value: null };
    }, 15);
  }

  sendRequestMulti() {
    let threadCount = document.getElementById('threadCount')['value'];
    if (isNaN(parseInt(threadCount))) {
      alert('Enter a valid number!');
      return;
    }
    for (let j = 0; j < parseInt(threadCount); j++) {
      this.sendRequest();
    }
  }

  onRequestJSONChangeTA(event) {
    this.modifiedRequest.value = event.target.value;
  }

  onRequestJSONChange(json) {
    // this.apiRequestData.value = json;
    this.modifiedRequest.value = json;
  }

  onPopupClosed(value) {
    this.popupClosed.emit(value);
  }

  CopyJson() {
    this.openModal('copyPasteEditor');
  }

  ngOnDestroy() {
    this.modifiedRequest = { value: null };
  }
}
