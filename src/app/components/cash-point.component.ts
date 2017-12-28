import { Component, OnInit, OnDestroy } from "@angular/core";

import { GlobalInput, KeyCode } from "app/utils";
import { BackendService, FlashMessageService } from "app/services";
import { User, Identifiable, Product } from "app/models";

@Component({
    selector: 'cash-point',
    templateUrl: '../templates/cash-point.html',
    providers: []
})
export class CashPointComponent extends GlobalInput implements OnInit, OnDestroy{
    identifier_input: string = '';
    user: User;
    wait_identifier: boolean = false;
    wait_checkout: boolean = false;
    deposit_custom: number;
    withdraw_custom: number;

    constructor(
        private backend_service: BackendService,
        private flash_message_service: FlashMessageService
    ) {
        super();
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

    onSpecialKeyInput(keyCode: number): void {
        switch(keyCode){
            case KeyCode.ENTER:
                if (this.identifier_input) this.confirmInput();
                break;
            case KeyCode.BACKSPACE:
                this.identifier_input = this.identifier_input.slice(0, -1);
                break;
        }
    }

    confirmInput(): void {
        this.wait_identifier = true;
        this.backend_service.getItemByIdentifier(this.identifier_input)
            .subscribe(
                item => {
                    this.wait_identifier = false;
                    this.processItem(item)
                },
                error => {
                    this.wait_identifier = false;
                    this.flash_message_service.flash('Unbekannter Barcode.', 'alert-danger');
                }
            );
        this.identifier_input = '';
    }

    processItem(item: Identifiable): void {
        if(item instanceof Product){
            this.flash_message_service.flash('Das ist keine KundenID.', 'alert-danger');
        }
        else if(item instanceof User){
            this.user = item;
            this.stopCaptureInput();
        }
    }

    deposit(amount: number): void {
        if(!amount) {
            this.flash_message_service.flash('Please specify the transaction amount!', 'alert-warning');
            return;
        }
        this.wait_checkout = true;
        this.backend_service.deposit(this.user, amount).subscribe(
            transaction => {
                this.flash_message_service.flash('Transaction created!', 'alert-success');
                this.wait_checkout = false;
                this.reset();
            },
            error => {
                this.flash_message_service.flash('Failed to create the transaction!', 'alert-danger');
                console.log(error);
            }
        );
    }

    abort(): void {
        this.flash_message_service.flash('Transaktion abgebrochen.', 'alert-warning');
        this.reset();
    }

    reset(): void {
        this.deposit_custom = null;
        this.withdraw_custom = null;
        this.user = null;
        this.startCaptureInput();
    }
}
