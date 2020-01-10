import TabGeneral from '../classes/tab';

const tabGeneral = new TabGeneral();
tabGeneral.init();
if(window.app) {
  window.app = {...window.app, tabGeneral};
}