/**
  * This is the main entry point for a project
* */
import App from '../../../core/brayleinosplash/app';
import BlsDropdown from '../../../core/brayleinosplash/plugins/bls_dropdown/bls_dropdown';
import BlsSelection from '../../../core/brayleinosplash/plugins/bls_selection/bls_selection';
import BlsScript from '../../../core/brayleinosplash/plugins/bls_script/bls_script';
import BlsScrollTo from './classes/bls_data-scrollto';
import { _getClosestClass } from './classes/helper_class';

import '../../scss/app.scss';

const setting = {
  name: 'UICEF Website',
  breakpoints: [768, 992, 1200],
};

window.app = new App(setting);
const html = document.querySelector('html');

window.app.ready(() => {
  // Define custom code for each project below.
  // window.WebFontConfig = {
  //   google: {
  //     families: ['Comfortaa:300,400,700&display=swap'],
  //   },
  // };
  window.app.loadFont();

  const menuMain = new BlsDropdown({
    selector: '.hamburger-menu[data-bls-dropdown]',
    position: {
      mode: 'fixed',
      location: 'top',
    },
    events: {
      beforeOpen() {
        if (html.classList.contains('ios')) {
          window.app.iosTopWindow = window.scrollY;
        }
      },
      afterOpen() {
        html.classList.add('menu-opened');
      },
      afterClose(instance) {
        html.classList.remove('menu-opened');
        instance.elements.wrapper.classList.remove('pos-top');
        if (html.classList.contains('ios')) {
          window.scrollTo(0, window.app.iosTopWindow);
        }
      },
    },
  });

  const menuLocation = new BlsDropdown({
    selector: '[name="btnLocation"][data-bls-dropdown]',
  });
  const blsFormSelect = document.querySelector('[data-bls-selection]');
  const selection = new BlsSelection({
    selector: '[data-bls-selection]',
    placeholder: blsFormSelect ? blsFormSelect.getAttribute('title') : '',
    events: {
      initializedAll(instance) {
        instance.forEach(e => {
          e.parentElement.classList.add('form-control');
        });
      },
      initialized(instance) {
        if (instance.value) {
          instance.elements.btn.innerText = instance.value;
        }else {
          instance.elements.btn.innerText = instance.setting.placeholder;
        }

      },
      afterSelect(instance) {
        let selectText = instance.elements.btn;
        selectText.innerText = instance.value;
      }
    }
  });

  if (window.location.pathname.indexOf('donate-form') > -1) {
    const searchParam = window.location.search;
    if (searchParam) {
      let donateValue = searchParam.split('?')[1];
      const labelSelect = document.querySelectorAll('.form-donate .form-donate__type--value');
      const donateVal = document.querySelector('input.donateValue');
      const index = parseInt(localStorage.getItem('indexForm'));
      if (index === 1) donateVal.parentElement.classList.add('one-time');
     setTimeout(() => {
      localStorage.clear();
     },1000);
      document.querySelector('.form-donate .form-donate__type--value.active').classList.remove('active');
      if (donateValue.indexOf('other') > -1) {
        donateVal.value = donateValue.split('M')[1];
        donateVal.focus();
        labelSelect.forEach(el => {
          if ( el.innerText === 'Other amount') {
            el.classList.add('active');
          }
        });

      }else {
        donateVal.value = donateValue.split('M')[1];
        labelSelect.forEach(el => {
          if ( el.innerText === donateValue.split('M')[1]) {
            el.classList.add('active');
          }
        });
      }
    }
  }
  if (window.screen.width < 992) {
    window.addEventListener('scroll', (e) => {
      const btnTop = document.querySelector('.to-top');
      if (window.scrollY > 240) {
        btnTop.classList.add('active');
      } else {
        btnTop.classList.remove('active');
      }
    });
  }

  const _btnGetInTouchScroll = new BlsScrollTo();

  [window.app.menu] = menuMain;
  [window.app.menuLocation] = menuLocation;
  [window.app.headerInTouch] = _btnGetInTouchScroll;

  if (document.querySelector('#itemTemplatePath') !== null) {
    window.app.templatePath = document.querySelector('#itemTemplatePath').value;
  }  

  // convertNodeListToArray(window.app.menu.elements.menu.querySelectorAll('.nav-main__link')).map((x) => {
  //   if (x.getAttribute('href') === window.location.pathname) {
  //     x.parentElement.classList.add('selected');
  //   }
  //   return x;
  // });

  // convertNodeListToArray(window.app.menuLocation.elements.menu.querySelectorAll('.nav-location__link')).map((x) => {
  //   if (x.getAttribute('href').indexOf(window.location.hostname) !== -1) {
  //     x.parentElement.classList.add('active');
  //     window.app.menuLocation.elements.control.textContent = x.textContent;
  //   } else {
  //     x.parentElement.classList.remove('active');
  //   }
  //   return x;
  // });

  return app;
});

window.app.load(() => {
  const scripts = new BlsScript();
  window.app.scripts = scripts;
});

// window.app.resize(() => {
//   if (window.app.Site.viewport > 1) {
//     window.app.menu.close();
//   }
// });
