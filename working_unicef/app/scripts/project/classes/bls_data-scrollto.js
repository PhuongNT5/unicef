import '../../../../core/brayleinosplash/polyfill';
import { convertNodeListToArray, scrollToElement } from '../../../../core/brayleinosplash/utils';

function _initEvent(instance) {
  instance.elements.btn.addEventListener('click', (e) => {
    if (e.currentTarget === instance.elements.btn) {
      e.preventDefault();
      if (instance.elements.target !== null) {
        scrollToElement(instance.elements.target);
      } else {
        window.location.href = instance.elements.link;
      }
    }
  });
}

class BlsScrollTo {
  constructor(setting) {
    const defaultSetting = {
      selector: '[data-bls-scrollto]',
      events: {
        initialized() {},
        initializedAll() {},
      },
    };

    const s = Object.assign({}, defaultSetting, setting || {});
    this.setting = s;
    this.instances = [];
    this.init(s);

    return this.instances;
  }

  init(setting) {
    const $this = this;
    const els = convertNodeListToArray(document.querySelectorAll(setting.selector));

    els.map((x) => {
      const obj = {};
      const s = Object.assign({}, $this.setting, x.dataset || {});
      obj.setting = s;

      obj.elements = {
        btn: x,
        target: document.querySelector(x.dataset.target),
        link: x.href,
      };

      _initEvent(obj);

      $this.instances.push(obj);

      if (typeof obj.setting.events.initialized === 'function') obj.setting.events.initialized(obj);

      return obj;
    });

    if (typeof $this.setting.events.initializedAll === 'function') $this.setting.events.initializedAll(els);
  }
}

export default BlsScrollTo;
