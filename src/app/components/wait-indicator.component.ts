import {Component, Inject, OnInit} from '@angular/core';
import {BackendService} from 'app/services';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {MatDialogRef} from '@angular/material/dialog/typings/dialog-ref';
import {isUndefined} from 'util';

@Component({
  selector: 'wait-indicator',
  templateUrl: '../templates/wait-indicator.html',
  providers: []
})
export class WaitIndicatorComponent implements OnInit {
  requestActive: boolean;
  currentDialog: MatDialogRef<WaitDialog>;

  constructor(
    public dialog: MatDialog,
    private backendService: BackendService) {
  }

  openDialog() {
    this.closeDialog();
    this.currentDialog = this.dialog.open(WaitDialog);
  }

  closeDialog() {
    if (!(isUndefined(this.currentDialog) || this.currentDialog === null)) {
      this.currentDialog.close();
    }
  }

  ngOnInit() {
    this.backendService.getRequestActive().subscribe(value => {
      this.requestActive = value;
      if (value) {
        this.openDialog();
      } else {
        this.closeDialog();
      }
    });
  }
}

@Component({
  selector: 'wait-dialog',
  templateUrl: '../templates/wait-dialog.html',
})
export class WaitDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
