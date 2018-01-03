import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Identifier, Pricing, Product, Tag} from 'app/models';
import {BackendService, FlashMessageService} from 'app/services';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'product-edit',
  templateUrl: '../templates/product-edit.html',
  providers: []
})
export class ProductEditComponent implements OnInit {

  private product: Product;
  addOnBlur = true;
  separatorKeysCodes = [ENTER, COMMA];  // Enter, comma

  constructor(private backend_service: BackendService,
              private flash_message_service: FlashMessageService,
              private route: ActivatedRoute,
              private router: Router) {
  }


  addTagNew(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.product.addTag(new Tag(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTagNew(tag: any): void {
    console.log(tag);
    this.product.deleteTag(tag);
  }

  addIdentifierNew(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.product.addIdentifier(new Identifier(value.trim()));
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeIdentifierNew(identifier: any): void {
    this.product.deleteIdentifier(identifier);
  }

  addTag(): void {
    this.product.addTag(new Tag(''));
  }

  deleteTag(tag: Tag): void {
    this.product.deleteTag(tag);
  }

  addIdentifier(): void {
    this.product.addIdentifier(new Identifier(''));
  }

  deleteIdentifier(identifier: Identifier): void {
    this.product.deleteIdentifier(identifier);
  }

  addPricing(): void {
    this.product.addPricing(new Pricing(null, 0, 999999));
  }

  deletePricing(pricing: Pricing): void {
    this.product.deletePricing(pricing);
  }

  ngOnInit(): void {
    this.product = new Product(null, null);
    this.route
      .params
      .subscribe(paramMap => {
        const product_id = paramMap['id'];
        if (product_id) {
          this.backend_service.getProduct(+product_id)
            .subscribe(
              product => this.product = product,
              error => this.flash_message_service.flash('Failed to load product!', 'alert-danger')
            );
        }
      });
  }

  save(): void {
    this.backend_service.saveProduct(this.product)
      .subscribe(
        product => {
          this.flash_message_service.flash('Product saved!', 'alert-success');
          this.router.navigate(['/products']);
        },
        error => {
          this.flash_message_service.flash('Failed to save product!', 'alert-danger');
        }
      );
  }
}
