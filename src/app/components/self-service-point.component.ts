import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Cart, Identifiable, Product, User} from 'app/models';
import {BackendService, ConfigService} from 'app/services';
import {GlobalInput, KeyCode} from 'app/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatStepper, MatTableDataSource} from '@angular/material';
import {CartItem} from '../models/cart-item';

declare var jQuery: any;

@Component({
  selector: 'self-service-point',
  templateUrl: '../templates/self-service-point.html',
  providers: []
})
export class SelfServicePointComponent extends GlobalInput implements OnInit, OnDestroy {
  identifier_input = '';
  cart: Cart;
  user: User;
  wait_identifier = false;
  wait_checkout = false;
  isLinear = false;
//  @ViewChild('modal') feedback_modal: ElementRef;
  mode = 0;
  fun: boolean;
  identifier_dirty = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  sessionTimeout: NodeJS.Timer;
  dataSource: MatTableDataSource<CartItem>;
  ELEMENT_DATA: CartItem[] = [new CartItem('prodName', 55, 12, 500)];
  @ViewChild('matStepper') private stepper: MatStepper;
  @ViewChild('userInput') private userInput: Input;

  constructor(private backend_service: BackendService,
              private config_service: ConfigService,
              //              private flash_message_service: FlashMessageService,
              public snackBar: MatSnackBar,
              private _formBuilder: FormBuilder) {
    super();
    this.cart = new Cart();
    this.fun = config_service.getConfig()['fun'];
    this.dataSource = new MatTableDataSource<CartItem>(this.ELEMENT_DATA);
//    this.stepper.selectionChange.subscribe(item => item.prop)
  }

  ngOnInit(): void {
    this.startCaptureInput();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  startSessionTimeout() {
    setTimeout(() => {
      this.abort();
    }, 15000);
    return;
  }

  clearTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
  }

  ngOnDestroy(): void {
    this.stopCaptureInput();
  }

  onLiteralInput(literal: string) {
    this.identifier_input += literal;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onSpecialKeyInput(keyCode: number): void {
    switch (keyCode) {
      case KeyCode.ENTER:
        this.identifier_input ? this.confirmInput() : this.payCart();
        break;
      case KeyCode.BACKSPACE:
        this.identifier_input = this.identifier_input.slice(0, -1);
        break;
      case KeyCode.MULTIPLY:
        this.abort();
        break;
    }
  }

  openSnackBar(message: string, action?: string, type?: string) {
    const config = {
      panelClass: ['snack-bar'],
      duration: 2500,
    };
    // TODO: dafür sorgen, dass die verschiedenen Farben angezeigt werden
    if (type) {
      if (type === 'error') {
        config.panelClass = ['snack-bar-error'];
      } else if (type === 'warn') {
        config.panelClass = ['snack-bar-warn'];
      }
    }
    this.snackBar.open(message, action, config);
  }

  confirmInput(): void {
//    this.wait_identifier = true;
    this.openSnackBar(this.identifier_input);
    this.backend_service.getItemByIdentifier(this.identifier_input)
      .subscribe(
        item => {
//          this.wait_identifier = false;
          this.processItem(item);
          this.identifier_input = '';
        },
        error => {
//          this.wait_identifier = false;
          console.error(error);
          this.openSnackBar('Nicht gefunden! Es existiert kein Produkt oder Kunde mit diesem Barcode.', null, 'error');
//          this.flash_message_service.flash('Nicht gefunden! Es existiert kein Produkt oder Kunde mit diesem Barcode.',
//            'flash-huge alert-danger');
          this.identifier_input = '';
        }
      );
  }

  processItem(item: Identifiable): void {
    if (item instanceof Product) {
      if (!this.user) {
        this.openSnackBar('Bitte scanne zuerst deine ID Karte! Du hast ein Produkt gescannt, musst aber zuerst '
          + 'eine ID Karte scannen.', null, 'error');
//        this.flash_message_service.flash('Bitte scanne zuerst deine ID Karte! Du hast ein Produkt gescannt, musst aber zuerst '
//          + 'eine ID Karte scannen.', 'flash-huge alert-danger');
        return;
      }
      this.cart.addToCart(item.name, item.pricings[0]); // hackedyhack ... select proper pricing instead
      this.updateCart();
    } else if (item instanceof User) {
      if (this.user) {
        this.openSnackBar('Bereits eingeloggt! Du hast bereits eine ID Karte gescannt. Wenn du den Kunden ändern '
          + 'möchtest brich bitte die Transaktion ab.', null, 'error');
//        this.flash_message_service.flash('Bereits eingeloggt! Du hast bereits eine ID Karte gescannt. Wenn du den Kunden ändern '
//          + 'möchtest brich bitte die Transaktion ab.', 'flash-huge alert-danger');
        return;
      }
//      this.userInput.focus();
//      this.firstFormGroup = true;

//      this.userInputRef.nativeElement.focus();
      this.firstFormGroup.markAsDirty({
//        onlySelf: true
      });
      this.firstFormGroup.markAsTouched({
//        onlySelf: true
      });
      this.user = item;
      this.cart.user_id = item.id;
      this.updateCart();
      this.stepper.selected.completed = true;
      this.mode = 1;
      this.goToStepper(1);
//      this.isLinear = true;
      this.startSessionTimeout();
    }
  }

  updateCart(): void {
    this.backend_service.createOrUpdateCart(this.cart).subscribe(
      cart => this.cart = cart,
      error => {
        console.error(error);
        this.openSnackBar('Nicht gefunden! Es existiert kein Produkt oder Kunde mit diesem Barcode.', null, 'error');
//        this.flash_message_service.flash('Warenkorb Update fehlgeschlagen! Der Warenkorb konnte nicht geupdated werden, '
//          + 'möglicherweise ist das Produkt nicht länger verfügbar.', 'flash-huge alert-danger');
      }
    );
  }

  payCart(): void {
    this.wait_checkout = true;
    this.backend_service.payCart(this.cart).subscribe(
      transaction => {
        this.wait_checkout = false;
        this.thankYou();
        this.clearTimeout();
      },
      error => {
        console.error(error);
        this.openSnackBar('Warenkorb bezahlen fehlgeschlagen! Der Server hat die Transaktion nicht akzeptiert; '
          + 'möglicherweise hast du nicht ausreichend Guthaben.', null, 'error');
//        this.flash_message_service.flash('Warenkorb bezahlen fehlgeschlagen! Der Server hat die Transaktion nicht akzeptiert; '
//          + 'möglicherweise hast du nicht ausreichend Guthaben.', 'flash-huge alert-danger');
      }
    );
  }

  thankYou(): void {
    this.mode = 2;
    this.goToStepper(2);
    this.user.balance -= this.cart.totalSum();

    setTimeout(() => {
      this.cart = new Cart();
      this.user = null;
      this.mode = 0;
      this.goToStepper(0);
    }, 5000);
  }

  abort(): void {
//    this.flash_message_service.flash('The checkout process has been aborted.', 'flash-huge alert-warning');
    this.openSnackBar('Der Einkauf wurde abgebrochen.', null, 'alert');
    this.clearTimeout();
    this.cart = new Cart();
    this.user = null;
    this.goToStepper(0);
    this.mode = 0;
  }

  private clickedOnStepperByUser() {
    this.setStepper(2);
  }

  private setStepper(id: number) {
    this.stepper.selectedIndex = id;
  }

  private goToStepper(id: number) {
    if (this.stepper.selectedIndex === id) {
      return
    } else if (this.stepper.selectedIndex > id) {
      do {
        this.stepper.selected.completed = false;
        this.stepper.previous();
      } while (this.stepper.selectedIndex > id);
    } else if (this.stepper.selectedIndex < id) {
      do {
        this.stepper.selected.completed = true;
        this.stepper.next();
      } while (this.stepper.selectedIndex < id);
    }
  }
}
