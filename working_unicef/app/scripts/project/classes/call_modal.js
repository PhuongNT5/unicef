import BlsModal from '../../../../core/brayleinosplash/plugins/bls_modal/bls_modal';
import '../../../../core/brayleinosplash/plugins/bls_modal/bls_modal.scss';

class CallModal {
    constructor() {
      this.target = document.querySelectorAll('[data-form-result-modal]');
    }
    

    init() {
      let $this = this;
      this.resultModal = '';
      this.targetModal = '';
      if (!$this.target) {
        return;
      }
      this.modal = new BlsModal({
          selector : `${this.targetModal} [data-form-result-modal]`,
          events: {
            beforeOpen(e) {
              e.elements.modalContent.innerHTML = `<div class="bls-modal__body"><p>${$this.resultModal}</p></di>`;
            }
          }
      });
      return this;
    }
}

export default CallModal;