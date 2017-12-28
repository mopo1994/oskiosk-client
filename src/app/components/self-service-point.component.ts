import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";

declare var jQuery:any;

import { Cart, User, Identifiable, Product } from "app/models";
import { BackendService, ConfigService, FlashMessageService } from "app/services";
import { GlobalInput, KeyCode } from "app/utils";


@Component({
    selector: 'self-service-point',
    templateUrl: '../templates/self-service-point.html',
    providers: []
})
export class SelfServicePointComponent extends GlobalInput implements OnInit, OnDestroy{
    identifier_input: string = '';
    cart: Cart;
    user: User;
    wait_identifier: boolean = false;
    wait_checkout: boolean = false;
    @ViewChild('modal') feedback_modal:ElementRef;
    modal_heading: string;
    modal_text: string;
    modal_progress_class: string = 'w-0';
    mode: number = 0;
    fun: boolean;

    constructor(
        private backend_service: BackendService,
        private config_service: ConfigService,
        private flash_message_service: FlashMessageService
    ) {
        super();
        this.cart = new Cart();
        this.fun = config_service.getConfig()['fun'];
    }

    ngOnInit(): void {
        this.startCaptureInput();
    }

    ngOnDestroy(): void {
        this.stopCaptureInput();
    }

    onLiteralInput(literal: string){
        this.identifier_input += literal;
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    onSpecialKeyInput(keyCode: number): void {
        switch(keyCode){
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

    confirmInput(): void {
        this.wait_identifier = true;
        this.backend_service.getItemByIdentifier(this.identifier_input)
            .subscribe(
                item => {
                    this.wait_identifier = false;
                    this.processItem(item);
                },
                error => {
                    this.wait_identifier = false;
                    console.error(error);
                    this.flash_message_service.flash('Nicht gefunden! Es existiert kein Produkt oder Kunde mit diesem Barcode.', 'flash-huge alert-danger');
                }
            );
        this.identifier_input = '';
    }

    processItem(item: Identifiable): void {
        if(item instanceof Product){
            if(!this.user){
                this.flash_message_service.flash('Bitte scanne zuerst deine ID Karte! Du hast ein Produkt gescannt, musst aber zuerst eine ID Karte scannen.', 'flash-huge alert-danger');
                return;
            }
            this.cart.addToCart(item.name, item.pricings[0]); // hackedyhack ... select proper pricing instead
            this.updateCart();
        }
        else if(item instanceof User){
            if(this.user){
                this.flash_message_service.flash('Bereits eingeloggt! Du hast bereits eine ID Karte gescannt. Wenn du den Kunden ändern möchtest brich bitte die Transaktion ab.', 'flash-huge alert-danger');
                return;
            }
            this.user = item;
            this.cart.user_id = item.id;
            this.updateCart();
            this.mode = 1;
        }
    }

    updateCart(): void {
        this.backend_service.createOrUpdateCart(this.cart).subscribe(
            cart => this.cart = cart,
            error => {
                console.error(error);
                this.flash_message_service.flash('Warenkorb Update fehlgeschlagen! Der Warenkorb konnte nicht geupdated werden, möglicherweise ist das Produkt nicht länger verfügbar.', 'flash-huge alert-danger');
            }
        );
    }

    payCart(): void {
        this.wait_checkout = true;
        this.backend_service.payCart(this.cart).subscribe(
            transaction => {
                this.wait_checkout = false;
                this.thankYou();
            },
            error => {
                console.error(error);
                this.flash_message_service.flash('Warenkorb bezahlen fehlgeschlagen! Der Server hat die Transaktion nicht akzeptiert; möglicherweise hast du nicht ausreichend Guthaben.', 'flash-huge alert-danger');
            }
        );
    }

    thankYou(): void {
        this.mode = 2;
        this.user.balance -= this.cart.totalSum();

        setTimeout(() => {
            this.cart = new Cart();
            this.user = null;
            this.mode = 0;
        }, 5000);
    }

    abort(): void {
        this.flash_message_service.flash('The checkout process has been aborted.', 'flash-huge alert-warning');
        this.cart = new Cart();
        this.user = null;
        this.mode = 0;
    }

/*
    modalDisplay(heading: string, text: string): void {
        this.modal_heading = heading;
        this.modal_text = text;
        this.modal_progress_class = 'w-0';
        jQuery(this.feedback_modal.nativeElement).modal('show');
        setTimeout(() => {
            this.modal_progress_class = 'w-25';
        }, 1000);
        setTimeout(() => {
            this.modal_progress_class = 'w-50';
        }, 2000);
        setTimeout(() => {
            this.modal_progress_class = 'w-75';
        }, 3000);
        setTimeout(() => {
            this.modal_progress_class = 'w-100';
            jQuery(this.feedback_modal.nativeElement).modal('hide');
        }, 4000);
    }
*/
}
