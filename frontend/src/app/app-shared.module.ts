import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ChipModule } from 'primeng/chip';
import { KnobModule } from 'primeng/knob';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ChartModule } from 'primeng/chart';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { StepsModule } from 'primeng/steps';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ScrollTopModule } from 'primeng/scrolltop';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitterModule } from 'primeng/splitter';
import { PanelModule } from 'primeng/panel';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { FocusTrapModule } from 'primeng/focustrap';

const SHARED_MODULES = [
    CommonModule,
    RouterModule,
    //BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    //ReactiveFormsModule.withConfig({ callSetDisabledState: 'whenDisabledForLegacyCode' }),
    NgxSpinnerModule,

    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DatePickerModule,
    SelectModule,

    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    ListboxModule,

    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    ColorPickerModule,
    CascadeSelectModule,
    MultiSelectModule,
    ToggleButtonModule,
    SliderModule,
    RadioButtonModule,
    InputTextModule,
    RatingModule,
    ChipModule,
    KnobModule,
    InputSwitchModule,
    ListboxModule,
    SelectButtonModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    SplitButtonModule,
    ChartModule,
    FileUploadModule,
    DividerModule,
    StyleClassModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    TimelineModule,
    TooltipModule,
    DataViewModule,
    PickListModule,
    OrderListModule,
    ImageModule,
    GalleriaModule,
    CarouselModule,
    BreadcrumbModule,
    MenubarModule,
    TabMenuModule,
    StepsModule,
    TieredMenuModule,
    MenuModule,
    ContextMenuModule,
    MegaMenuModule,
    PanelMenuModule,
    MessagesModule,
    MessageModule,
    ButtonModule,
    ProgressBarModule,
    AvatarModule,
    ScrollPanelModule,
    TagModule,
    SkeletonModule,
    AvatarGroupModule,
    ScrollTopModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    AccordionModule,
    FieldsetModule,
    SplitterModule,
    PanelModule,
    TreeModule,
    TreeTableModule,
    FloatLabelModule,
    ToastModule,
    BadgeModule,
    AvatarModule,
    CardModule,
    TabsModule,
    FocusTrapModule
];

const SHARED_COMPONENTS = [
    RouterOutlet,
    NgStyle,
    IconField,
    InputIcon
];


@NgModule({
    imports: [
        ...SHARED_MODULES,
        ...SHARED_COMPONENTS,
    ],
    exports: [
        ...SHARED_MODULES,
        ...SHARED_COMPONENTS,
    ],
})
export class AppSharedModule { }
