import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ModalService, NgbModal],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('callOpenComponent', async () => {
  //   const ng = TestBed.get(NgbModal);
  //   const yesNoDialogSpy = spyOn(ng, 'open').and.returnValue(
  //     new Promise<boolean>((resolve, reject) => {
  //       resolve(true);
  //     })
  //   );

  //   await service.openModal('a', 'a', 'a', true);

  //   await expect(yesNoDialogSpy).toHaveBeenCalled();
  // });
});
