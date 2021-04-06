import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { ModalService } from './modal.service';

export class MockNgbModalRef {
  componentInstance = {
    prompt: undefined,
    title: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('ModalService', () => {
  let service: ModalService;
  let ngbmodal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ModalService, NgbModal],
    });
    ngbmodal = TestBed.inject(NgbModal);
    service = new ModalService(ngbmodal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('openResultconfirm', () => {
    var result = service.openModal('a', 'a', 'a', true);
    expect(result).toBeTruthy();
  });
  it('openResultinfo', () => {
    var result = service.openModal('a', 'a', 'a', false);
    expect(result).toBeTruthy();
  });

  it('openResultt', () => {
    var spy = spyOn(ngbmodal, 'open');
    var result = service.openModal('a', 'a', 'a', false);
    expect(spy).toHaveBeenCalled();
  });
});
