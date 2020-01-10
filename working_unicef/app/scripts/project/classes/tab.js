import BlsTab from '../../../../core/brayleinosplash/plugins/bls_tabs/bls_tabs';
import { _getClosestClass, _fireEvent } from './helper_class';
import { convertNodeListToArray } from '../../../../core/brayleinosplash/utils';

function radioAction(element) {
  let tabActive = element.target.querySelector('.donation-tab__panel.active');
  let radioBtn = tabActive.querySelectorAll('input');
  radioBtn.forEach(e => {
    e.addEventListener('change', (event) => {
      if (event.target.checked) {
        tabActive.querySelector('.radio-group.active').classList.remove('active');
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
}

function directPage() {
  let donateNumber = 'RM120';
  let form = document.querySelector('.donation-tab__panel.active form');
  let index = convertNodeListToArray(document.querySelectorAll('.donation-tab__panel form')).indexOf(form);
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
              // form.addEventListener('click', (event) => {
              //   eventAction(event);
              // })
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

class TabGeneral {
  constructor() {
    this.selector = '[data-plain-tabs]';
    this.target = document.querySelector(this.selector);
    this.sliderContent = [];
    this.activeIndex = 0;
    this.selectMobile = null;
  }

  init() {
    const $this = this;
    if (!$this.target) {
      return;
    }

    // $this.selectMobile = new SelectTabMobile({
    //   selector: '[data-plain-tabs] [data-select-tabm]'
    // });
    
    $this.tab = new BlsTab({
      selector: '[data-plain-tabs] [data-tabs]',
      events: {
        initialized(instance) {
          radioAction($this);
        },
        initializedAll() {
          directPage();
        },
        afterOpen() {
          radioAction($this);
          setTimeout( () => {
            _fireEvent('resize');
            // }

          }, 10);
          directPage();
        },
      }
    });

    window.addEventListener('load', function () {
      // setTimeout(() => {
      //   const tabs = _getClosestClass($this.target, '.milestones__tabs');
      //   console.log('load Tabs inline', tabs);
      //   if(tabs) {
      //     tabs.classList.remove('no-click');
      //   }
      // }, 350);
    });

    return $this;
  }
}
export default TabGeneral;
