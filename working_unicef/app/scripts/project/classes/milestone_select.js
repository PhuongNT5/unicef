import { convertNodeListToArray } from '../../../../core/brayleinosplash/utils';

function _getElementTextActive(instance) {
  const text = instance.elements.target.querySelector('span');
  const liActive = instance.elements.list.querySelector('li.active');
  const liText = liActive.innerText;
  text.innerText = liText;

}

function _bindEventClick(instance) {
  const text = instance.elements.target.querySelector('span');
  const li = instance.elements.list.querySelectorAll('li');
  const ul = instance.elements.list;
  const target = instance.elements.target;
  li.forEach(el => {
    el.addEventListener('click', () => {
      text.innerText = el.innerText;
      ul.classList.add('fade');
      target.classList.remove('is-open');
    });
  });

  target.addEventListener('click', () => {
    ul.classList.toggle('fade');
    target.classList.toggle('is-open');
  });
}

function _bindPublic(instance) {
  instance.elements.list.classList.add('fade');
}

class SelectTabMobile {
  constructor(setting) {
    const defaultSetting = {
      selector: '[data-select-tabm]',
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
    
    if (!els) {
      return;
    }
    els.map((x) => {
      const obj = {};
      const s = Object.assign({}, $this.setting, x.dataset || {});
      const list = x.nextElementSibling;
      obj.setting = s;

      obj.elements = {
        target: x,
        list: list
      };

      _getElementTextActive(obj);
      _bindEventClick(obj);
      _bindPublic(obj);


      $this.instances.push(obj);

      if (typeof obj.setting.events.initialized === 'function') obj.setting.events.initialized(obj);

      return obj;
    });

    if (typeof $this.setting.events.initializedAll === 'function') $this.setting.events.initializedAll(els);
  }
}
export default SelectTabMobile;
