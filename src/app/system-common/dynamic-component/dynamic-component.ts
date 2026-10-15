import {
  Component,
  Input,
  SimpleChanges,
  OnInit,
  ViewChild,
  ComponentRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseService } from '../services/base.service';
import { ResponseIO } from 'src/app/models/responseIO';
import { DynamicLoadingDirective } from '../directive/dynamic-loading.directive';
import { BaseComponent } from '../base/base.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sym-dynamic-component',
  templateUrl: './dynamic-component.html',
  styleUrls: ['./dynamic-component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DynamicComponent implements OnInit {
  // @ViewChild('xmlContainer', { static: false, read: ViewContainerRef }) xmlContainer!: ViewContainerRef;
  @ViewChild(DynamicLoadingDirective, { static: true }) dynamicLoadingDirective!: DynamicLoadingDirective;
  /**
   * This is a mandatory input
   * Expects the component that is rendered via code dynamically
   */
  @Input() componentToRender;

  /**
   * This is required only if given component as any input.
   * This contains list Inputs for gien component
   */
  @Input() inputOptions: any;

  /**
   * Expects the service to be loaded.
   */
  @Input() service: BaseService;

  @Input() responseUpdated: boolean;

  /**
   * This is optional input. This is used when we want to over-ride HTML
   * usin XML config.
   */
  @Input() xmlDOM;
  /**
   * It is required input. It is of type ResposeIO.
   *
   * It contains the value to be displayed in the UI.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * To emitt the component call.
   */
  @Output() notifyReloadStepOutput = new EventEmitter<any>();

  /**
   * @ignore
   */
  // private inputList: { key: string; value: any }[];
  /**
   * @ignore
   */
  private componentRef: ComponentRef<BaseComponent<BaseService>>;

  constructor(public baseService: BaseService) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // let triggerNgChangesForRespUpdt: boolean = false;
    // if (
    //   (changes['responseUpdated'] && changes['responseUpdated'].currentValue) ||
    //   (changes['responseUpdated'] && changes['responseUpdated'].firstChange)
    // ) {
    //   triggerNgChangesForRespUpdt = true;
    // }
    if (changes['componentToRender'] && changes['componentToRender'].currentValue) {
      if (this.componentToRender != null) this.onComponentNameTriggered(changes);
    } else {
      this.triggerOnChanges(changes);
    }
    // else if ( triggerNgChangesForRespUpdt )
    // {
    //   this.triggerResponseUpdated(changes);
    // }
  }

  private onComponentNameTriggered(changes: SimpleChanges) {
    if (this.componentToRender != undefined) {
      // setTimeout(() => {
      // create the component factory
      // add the component to the view
      //   this.componentRef = this.xmlContainer.createComponent(
      //     this.componentFactoryResolver.resolveComponentFactory(this.componentToRender)
      // );

      // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentToRender);
      let viewContainerRef = this.dynamicLoadingDirective.viewContainerRef;

      viewContainerRef.clear();

      if (this.componentRef != undefined) {
        this.componentRef.destroy();
      }

      this.componentRef = viewContainerRef.createComponent<any>(this.componentToRender);
      let componentInputCount = 0;
      //        this.inputList = [];
      for (let i = 0; i < this.inputOptions.length; i++) {
        let key = this.inputOptions[i].nodeName.trim();
        if (key === 'symIf' || key === 'symIfVal') {
          continue;
        }
        if (key != 'name') componentInputCount++;
        let value = this.inputOptions[i].nodeValue.trim();
        if (key === 'model') {
          if (this.componentRef.instance['modelTempName'] != undefined || this.xmlDOM.nodeName === 'component') {
            this.componentRef.instance['modelTempName'] = value;
          }
          //console.log('on onComponentNameTriggered: ', this.componentRef.instance);
          //console.log('model: ', value);
          value = this.service.getModel(value);
        } else {
          value = JSON.parse(JSON.stringify(this.inputOptions[i].nodeValue.trim()));
        }
        if (typeof this.componentRef.instance[key] === 'boolean') {
          value = value === 'true' ? true : false;
        }
        this.componentRef.instance[key] = value;

        // let inputs = {
        //   key: this.inputOptions[i].nodeName.trim(),
        //   value: JSON.parse(JSON.stringify(this.inputOptions[i].nodeValue.trim())),
        // };
        // this.inputList.push(inputs);
      }

      // if (this.inputList.length > 0) {
      //   this.inputList.filter((input) => {
      //     if (input.key === 'model') {
      //       input.value = this.service.getModel(input.value);
      //     }
      //     this.componentRef.instance[input.key] = JSON.parse(JSON.stringify(input.value));
      //   });
      // }
      if (this.xmlDOM != undefined && this.xmlDOM.nodeName === 'xmlcomponent') {
        this.componentRef.instance['xmlDom'] = this.xmlDOM;
      }
      if (
        (this.service.responseIO === undefined || this.service.responseIO === null) &&
        this.responseIO != undefined
      ) {
        this.service.responseIO = this.responseIO;
      }
      this.componentRef.instance['service'] = this.service;
      this.componentRef.instance['responseIO'] = this.responseIO;
      this.componentRef.instance['service']['isXMLCodeRendered'] = true;
      // this.componentRef.instance.notifyInputModify.
      const sub: Subscription = this.componentRef.instance.notifyReloadStep.subscribe((event) => {
        this.notifyReloadStepOutput.next(event);
      });
      this.componentRef.onDestroy(() => {
        sub.unsubscribe();
      });
      this.baseService.isXMLCodeRendered = true;
      // if (triggerNgChangesForRespUpdt) {
      if (componentInputCount > 0) this.triggerOnChanges(changes);
      //}
      // console.log(componentRef);
      // }, 0);
    }
  }

  //Function to Trigger ResponseUpdated for XML Configuration internally
  private triggerOnChanges(changes: SimpleChanges) {
    // this.componentRef.instance[ 'responseUpdated' ] = true;
    if (changes['responseUpdated'] != undefined)
      this.componentRef.instance['responseUpdated'] = changes['responseUpdated'].currentValue;
    //console.log('on triggerResponseUpdated: ', this.componentRef);
    if (this.componentRef.instance['modelTempName'] != undefined)
      this.componentRef.instance['model'] = this.service.getModel(this.componentRef.instance['modelTempName']);
    if (this.service.responseIO != undefined) this.componentRef.instance['responseIO'] = this.service.responseIO;
    this.componentRef.instance.ngOnChanges(changes);

    this.componentRef.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.dynamicLoadingDirective != undefined && this.componentRef != undefined) {
      this.dynamicLoadingDirective.viewContainerRef.clear();
      this.componentRef.destroy();
      this.componentRef.instance['service']['isXMLCodeRendered'] = undefined;
      this.baseService.isXMLCodeRendered = undefined;
    }
  }
}
