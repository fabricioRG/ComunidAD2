import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-active-modal',
  templateUrl: './active-modal.component.html',
  styleUrls: ['./active-modal.component.css']
})
export class ActiveModalComponent implements OnInit {

  modalHeader: string;
  modalBodyTitle: string;
  modalBody: string;
  confirmModal: false;
  infoModal: false;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}