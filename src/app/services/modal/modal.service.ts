import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private _modalService: NgbModal) { }

// tipo mensaje = true -> confirm
// tipo mensaje = false -> info
  openModal(msjHeader: string, msjBody: string, msjTitleBody:string, tipoMensaje: boolean):string{
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = msjHeader;
    modal.componentInstance.modalBodyTitle = msjTitleBody;
    modal.componentInstance.modalBody = msjBody;
    if(tipoMensaje){
      modal.componentInstance.confirmModal = true;
    }else{
      modal.componentInstance.infoModal = true;
    }
    

    modal.result.then((result) => {
        console.log("result: "+result)     
        return result;
    }, (reason) => {
      console.log("reason: "+reason)
      return reason;
    }).catch( (error) => {
      
    });

    return 'NADA';
    
  }
}
