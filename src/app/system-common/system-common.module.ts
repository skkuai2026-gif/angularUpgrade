import { RestApiListingComponent } from './rest-api-listing/rest-api-listing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AlertComponent } from './alert/alert.component';
import { LoginOtpComponent } from './login-otp/login-otp.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { OtpComponent } from './otp/otp.component';
import { LanguageComponent } from './language/language.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { XmlGenericConfigUIComponent } from './xml-generic-config-ui/xml-generic-config-ui.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { ButtonComponent } from './button/button.component';
import { TabContainerComponent } from './tab-container/tab-container.component';
import { ErrorComponent } from './error/error.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NavigationLinksComponent } from './navigation-links/navigation-links.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { StepComponent } from './step/step.component';
import { SafeHtmlPipe } from './pipe/safeHtmlPipe';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe, UpperCasePipe, LowerCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchComponent } from './search/search.component';
import { SystemCommonRoutingModule } from './system-common-routing.module';
import { FieldGroupComponent } from './field-group/field-group.component';
import { PanelComponent } from './panel/panel.component';
import { BaseComponent } from './base/base.component';
import { TopHeaderComponent } from './top-header/top-header.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { DataEntryGridComponent } from './data-entry-grid/data-entry-grid.component';
import { DatePipe } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Datepicker module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { SignaturePadModule } from 'angular2-signaturepad';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { SignatureComponent } from './signature/signature.component';
// import { ModalModule } from 'ngx-bootstrap/modal';
import { HtmlBodyComponent } from './html-body/html-body.component';

// import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { SubTabComponent } from './sub-tab/sub-tab.component';

import { DataTablesModule } from 'angular-datatables';

import { CustomFormatPipe } from './pipe/custom-format.pipe';
import { CarouselComponent } from './carousel/carousel.component';
import { TooltipComponent } from './tooltip/tooltip.component';
// import { ChartsModule } from 'ng2-charts';
// import { HeaderService } from './services/header.service';
// import { Location } from '@angular/common';
// import { SettingService } from './services/setting.service';
// import { OrigamiFormsModule } from '@codebakery/origami/forms';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { JSONTreeEditorComponent } from './json-tree-editor/json-tree-editor.component';
import { JSONTreeEditorItemComponent } from './json-tree-editor-item/json-tree-editor-item.component';
import { ApiBodyEditorComponent } from './api-body-editor/api-body-editor.component';
import { ApiFilterPipe } from './pipe/api-filter.pipe';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { CustomChartsComponent } from './custom-charts/custom-charts.component';
import { DynamicComponent } from './dynamic-component/dynamic-component';
import { XmlConfigUiComponent } from './xml-config-ui/xml-config-ui.component';
import { XmlHtmlUiComponent } from './xml-html-ui/xml-html-ui.component';
import { XmlSubTabUiComponent } from './xml-sub-tab-ui/xml-sub-tab-ui.component';
import { ComponentLoadEmitterComponent } from './component-load-emitter/component-load-emitter.component';
import { DynamicLoadingDirective } from './directive/dynamic-loading.directive';
import { SignatureUIComponent } from './signatureUI/signatureUI.component';
import { LoaderComponent } from './loader/loader.component';
import { SubStepComponent } from './sub-step/sub-step.component';
import { RunScriptsDirective } from './directive/run-scripts.directive';
import { DynamicStylesDirective } from './directive/dynamic-styles.directive';
import { AgentNotificationSearchComponent } from './agent-notification-search/agent-notification-search.component';
import { SunphSearchComponent } from './sunph-search/sunph-search.component';
@NgModule({
  declarations: [
    DisclaimerComponent,
    SearchComponent,
    FieldGroupComponent,
    PanelComponent,
    TopHeaderComponent,
    MenuComponent,
    LoginComponent,
    DataEntryGridComponent,
    SignatureComponent,
    SignatureUIComponent,
    SafeHtmlPipe,
    HtmlBodyComponent,
    PageContainerComponent,
    StepComponent,
    SubTabComponent,
    NavigationLinksComponent,
    ErrorComponent,
    TabContainerComponent,
    ButtonComponent,
    PopUpComponent,
    SystemSettingsComponent,
    XmlGenericConfigUIComponent,
    CustomFormatPipe,
    CarouselComponent,
    ChangePasswordComponent,
    LanguageComponent,
    OtpComponent,
    LoginOtpComponent,
    AlertComponent,
    PageNotFoundComponent,
    TooltipComponent,
    DateTimePickerComponent,
    RestApiListingComponent,
    JSONTreeEditorComponent,
    JSONTreeEditorItemComponent,
    ApiBodyEditorComponent,
    ApiFilterPipe,
    MenuItemComponent,
    CustomChartsComponent,
    DynamicComponent,
    XmlConfigUiComponent,
    XmlHtmlUiComponent,
    XmlSubTabUiComponent,
    ComponentLoadEmitterComponent,
    DynamicLoadingDirective,
    LoaderComponent,
    SubStepComponent,
    AgentNotificationSearchComponent,
    SunphSearchComponent,
    RunScriptsDirective,
    DynamicStylesDirective,
  ],
  exports: [
    DisclaimerComponent,
    SearchComponent,
    FieldGroupComponent,
    PanelComponent,
    TopHeaderComponent,
    MenuComponent,
    SystemCommonRoutingModule,
    LoginComponent,
    DataEntryGridComponent,
    SignatureComponent,
    SignatureUIComponent,
    SystemSettingsComponent,
    SafeHtmlPipe,
    HtmlBodyComponent,
    PageContainerComponent,
    StepComponent,
    SubTabComponent,
    NavigationLinksComponent,
    ErrorComponent,
    TabContainerComponent,
    ButtonComponent,
    PopUpComponent,
    XmlGenericConfigUIComponent,
    CustomFormatPipe,
    CarouselComponent,
    ChangePasswordComponent,
    LanguageComponent,
    OtpComponent,
    LoginOtpComponent,
    AlertComponent,
    PageNotFoundComponent,
    TooltipComponent,
    DateTimePickerComponent,
    RestApiListingComponent,
    JSONTreeEditorComponent,
    ApiBodyEditorComponent,
    ApiFilterPipe,
    CustomChartsComponent,
    XmlConfigUiComponent,
    ComponentLoadEmitterComponent,
    LoaderComponent,
    XmlHtmlUiComponent,
    SubStepComponent,
    RunScriptsDirective,
    DynamicStylesDirective,
    SunphSearchComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    SystemCommonRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    NgSelectModule,
    // ModalModule.forRoot(),
    // ChartsModule,
    DataTablesModule,
    AngularSignaturePadModule,
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    UpperCasePipe,
    LowerCasePipe,
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
  ],
})
export class SystemCommonModule {}
