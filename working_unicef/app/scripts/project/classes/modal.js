import BlsModal from '../../../../core/brayleinosplash/plugins/bls_modal/bls_modal';
import { _getClosestClass, _fireEvent } from './helper_class';
import { convertNodeListToArray } from '../../../../core/brayleinosplash/utils';

function directPage() {
  let donateNumber = 'RM120';
  let form = document.querySelector('form.donation-form');
  let index = convertNodeListToArray(document.querySelectorAll('form')).indexOf(form);
  localStorage.setItem('indexForm', index);
  if (form) {
      let radioBtn = form.querySelectorAll('.radio-group input');
      let isValid = true;
      radioBtn.forEach(e => {
        e.addEventListener('change', (event) => {
          if (event.target.checked) {
            if (event.target.value != 'Other') {
              let errorEl = form.querySelector('.error');
              if (errorEl)  errorEl.remove();
              donateNumber = event.target.value;
              isValid = true;
            }else {
              isValid = false;
              let valueOther = form.querySelector('.rmother');
              valueOther.addEventListener('change', (event) => {
                eventAction(event);
              });
              valueOther.addEventListener('focusout', (event) => {
                eventAction(event);
              });
              valueOther.addEventListener('input', (event) => {
                setTimeout(() => {
                  eventAction(event);
                },300);
              });
              form.addEventListener('click', (event) => {
                eventAction(event);
              })
            }
          } 
        });
      });

      function eventAction(event) {
        const value =event.target.value;
        if (parseInt(value) >= 50) {
          donateNumber = `otherRM${event.target.value}`;
          let errorEl = form.querySelector('.error');
          if (errorEl)  errorEl.remove();
          isValid = true;
        }else {
          isValid = false;
          checkError(form);
        }
      }
      function checkError(form) {
        let errorEl = form.querySelector('.error'); 
        if (!errorEl) {
          var divErr = document.createElement('div');
          divErr.classList.add('error');
          form.querySelector('.radio-group-input').append(divErr);
          divErr.innerHTML = form.querySelector('.radio-group-input .rmother').getAttribute('data-error-pattern');
        }
      }
      const btnDonate = form.querySelector('.btn-donate');
      if (btnDonate) {
        btnDonate.addEventListener('click', (event) => {
          if (isValid) {
            window.location.href ='/donate-form?' + donateNumber;
            let formDo = _getClosestClass(btnDonate, 'form');
            formDo.reset();
            
          }
        });
      }
  }
}

class BlsModalContent {
  constructor() {
    this.target = document.querySelector('[data-bls-modal-donate]');
  }
  init() { 
    const $this = this;
    if (!$this.target) {
      return;
    }

    $this.gallery = new BlsModal({
        selector: '[data-bls-modal-donate]',
        thumbnail: false,
        events: {
          initialized(instance) {

          },
          afterOpen(instance) {
            let radioBtn = instance.elements.modal.querySelectorAll('input');
            
            radioBtn.forEach(e => {
              e.addEventListener('click', (event) => {
                if (event.target.checked) {
                  instance.elements.modal.querySelector('.radio-group.active').classList.remove('active');
                  let parentGroup = event.target.parentElement.parentElement;
                  window.app.donateNumber = event.target.value;
                  if (parentGroup.classList.contains('radio-group-input')) {
                    parentGroup.parentElement.classList.add('active');
                    parentGroup.querySelector('.rmother').focus();
                  }
                  else {
                    parentGroup.classList.add('active');
                  }
                } 
              });
            });
            directPage();
          }
        }
    });
    return $this;
  }
}
export default BlsModalContent;