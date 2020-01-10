import '../../../../core/brayleinosplash/polyfill';
import { convertNodeListToArray } from '../../../../core/brayleinosplash/utils';

function _initData(instance) {
  const _instance = instance;
  _instance.data = {
    list: convertNodeListToArray(_instance.elements.target.children),
    last: 0,
  };

  if (_instance.data.list.length >= _instance.setting.limit) {
    _instance.data.list.map((x, index) => {
      if (index >= _instance.setting.limit) {
        x.style.display = 'none';
      } else {
        x.style.display = null;
        x.style.display = '';
      }
      return x;
    });
    _instance.data.last = _instance.setting.limit - 1;
    if (_instance.data.last >= _instance.data.list.length - 1) {
      _instance.data.last = _instance.data.list.length;
      _instance.elements.btn.style.display = 'none';
    } else {
      _instance.elements.btn.style.display = '';
    }
  } else {
    _instance.data.list.map((x, index) => {
      x.style.display = null;
      x.style.display = '';
      return x;
    });
    _instance.elements.btn.style.display = 'none';
  }
}

function _initEvent(instance) {
  const _instance = instance;

  _instance.elements.btn.addEventListener('click', (e) => {
    if (_instance.elements.btn === e.target) {
      e.preventDefault();
      e.stopPropagation();

      _instance.data.list.map((x, index) => {
        if (index > (_instance.data.last + _instance.setting.add)) {
          x.style.display = 'none';
        } else {
          x.style.display = null;
          x.style.display = '';
        }
        return x;
      });
      _instance.data.last += _instance.setting.add;
      if (_instance.data.last >= _instance.data.list.length - 1) {
        _instance.data.last = _instance.data.list.length;
        _instance.elements.btn.style.display = 'none';
      }
    }
  }, false);
}

function _bindPublicMethod(instance) {
  instance.reset = () => {
    _initData(instance);
  };
}
class BlsDataLoadMore {
  constructor(setting) {
    const defaultSetting = {
      selector: 'button[data-bls-loadmore]',
      events: {
        initialized() {},
        initializedAll() {},
      },
    };

    const s = Object.assign({}, defaultSetting, setting || {});
    this.setting = s;
    this.setting.limit = parseFloat(this.setting.limit);
    this.setting.add = parseFloat(this.setting.add);
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

      obj.setting.limit = parseFloat(obj.setting.limit);
      obj.setting.add = parseFloat(obj.setting.add);

      obj.elements = {
        btn: x,
        target: document.querySelector(x.dataset.target),
      };

      _initData(obj);
      _initEvent(obj);
      _bindPublicMethod(obj);

      $this.instances.push(obj);

      if (typeof obj.setting.events.initialized === 'function') obj.setting.events.initialized(obj);

      return obj;
    });

    if (typeof $this.setting.events.initializedAll === 'function') $this.setting.events.initializedAll(els);
  }
}
export default BlsDataLoadMore;
