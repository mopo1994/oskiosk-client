import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {CdkTableModule} from '@angular/cdk/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {BackendServiceProvider} from 'app/providers';
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
  MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatIconRegistry, MatInputModule,
  MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule,
  MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
  MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {
  CashPointComponent, FlashMessageComponent, HomeComponent, NavbarComponent, ProductEditComponent, ProductImportComponent,
  ProductListComponent, SalesPointComponent, SelfServicePointComponent, UserEditComponent, UserImportComponent, UserListComponent,
  WaitIndicatorComponent
} from 'app/components';
import {ConfigService, FlashMessageService} from 'app/services';
import { HttpClientModule } from '@angular/common/http';
import {WaitDialog} from './components/wait-indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductEditComponent,
    ProductListComponent,
    ProductImportComponent,
    UserEditComponent,
    UserListComponent,
    UserImportComponent,
    SalesPointComponent,
    CashPointComponent,
    SelfServicePointComponent,
    NavbarComponent,
    FlashMessageComponent,
    WaitIndicatorComponent,
    HomeComponent,
    WaitDialog, WaitIndicatorComponent
  ],
  imports: [
    HttpClientModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatListModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'self-service-point',
        component: SelfServicePointComponent
      },
      {
        path: '',
        component: NavbarComponent,
        children: [
          {
            path: 'home',
            component: HomeComponent
          },
          {
            path: 'products',
            component: ProductListComponent
          },
          {
            path: 'product/new',
            component: ProductEditComponent
          },
          {
            path: 'product/import',
            component: ProductImportComponent
          },
          {
            path: 'product/:id',
            component: ProductEditComponent
          },
          {
            path: 'users',
            component: UserListComponent
          },
          {
            path: 'user/new',
            component: UserEditComponent
          },
          {
            path: 'user/import',
            component: UserImportComponent
          },
          {
            path: 'user/:id',
            component: UserEditComponent
          },
          {
            path: 'sales-point',
            component: SalesPointComponent
          },
          {
            path: 'cash-point',
            component: CashPointComponent
          },
          {
            path: '**',
            component: HomeComponent
          }
        ]
      }
    ]),

    /*
        RouterModule.forRoot([
          {
            path: 'products',
            component: ProductListComponent
          },
          {
            path: 'product/new',
            component: ProductEditComponent
          },
          {
            path: 'product/import',
            component: ProductImportComponent
          },
          {
            path: 'product/:id',
            component: ProductEditComponent
          },
          {
            path: 'users',
            component: UserListComponent
          },
          {
            path: 'user/new',
            component: UserEditComponent
          },
          {
            path: 'user/import',
            component: UserImportComponent
          },
          {
            path: 'user/:id',
            component: UserEditComponent
          },
          {
            path: 'sales-point',
            component: SalesPointComponent
          },
          {
            path: 'cash-point',
            component: CashPointComponent
          },
          {
            path: 'self-service-point',
            component: SelfServicePointComponent
          },
          {
            path: '',
    //        redirectTo: 'home',
            pathMatch: 'full',
            component: NavbarComponent,
            children: [
              {
                path: '',
                component: HomeComponent
              }
            ]
          },
          {
            path: '**',
            component: HomeComponent
          }
        ])
        */
  ],
  entryComponents: [WaitDialog, WaitIndicatorComponent],
  providers: [BackendServiceProvider, ConfigService, FlashMessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')); // Or whatever path you placed mdi.svg at
  }
}
