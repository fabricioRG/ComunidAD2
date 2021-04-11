import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private _modalService: NgbModal) { }

  // tipo mensaje = true -> confirm
  // tipo mensaje = false -> info
  async openModal(
    msjHeader: any,
    msjBody: any,
    msjTitleBody: any,
    tipoMensaje: boolean
  ): Promise<boolean> {
    var resultado = false;
    const modal = this._modalService.open(ActiveModalComponent);
    modal.componentInstance.modalHeader = msjHeader;
    modal.componentInstance.modalBodyTitle = msjTitleBody;
    modal.componentInstance.modalBody = msjBody;
    if (tipoMensaje) {
      modal.componentInstance.confirmModal = true;
    } else {
      modal.componentInstance.infoModal = true;
    }

    return await modal.result
      .then(
        (result) => {
          return true;
        },
        (reason) => {
          return false;
        }
      )
      .catch((error) => {
        return false;
      });
  }
}
