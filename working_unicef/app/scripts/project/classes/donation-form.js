import blsValidation from '../../../../core/brayleinosplash/plugins/bls_validation/bls_validation';

class donationForm {
  constructor() {
    this.target = document.querySelector('[data-donation-form]');
  }
  init() { 
    const $this = this;
    if (!$this.target) {
      return;
    }
    return $this;
  }
}
export default donationForm;