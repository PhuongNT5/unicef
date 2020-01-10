import { getUrlQueryString } from '../../../../core/brayleinosplash/utils';
import BlsVideo from '../../../../core/brayleinosplash/plugins/bls_video/bls_video';
import { _getClosestClass } from './helper_class';

function _showFirstFrame(instance, id) {
  const parent = _getClosestClass(instance.elements.wrapper, '.banner-video');
  const imgWrapper = document.createElement('div');
  imgWrapper.classList.add('banner-video__img-wrapper');
  const img = document.createElement('img');
  img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  img.alt = 'first frame video';
  imgWrapper.appendChild(img);
  parent.appendChild(imgWrapper);
}

function _removeFrame(instance) {
  setTimeout( () => {
    const parent = _getClosestClass(instance.elements.wrapper, '.banner-video');
    const img = parent.querySelector('img');
    img.parentNode.removeChild(img);
  }, 500);
}

function _calculateHeightVideo(instance) {
  const parent = _getClosestClass(instance.elements.wrapper, '.banner-video');
  parent.style.height = `${instance.elements.wrapper.clientHeight}px`;
}

function _createBtnMute(instance) {
  const mute = document.createElement('div');
        mute.classList.add('banner-video__btn-mute');
  const img = document.createElement('div');
        img.className='icon-mute';
        // img.src = require('../../../assets/images/upload/mute.png');
        // img.alt = 'mute';

  mute.appendChild(img);
  const parent = _getClosestClass(instance.elements.wrapper, '.banner-video');
  parent.appendChild(mute);

  mute.addEventListener('click', () => {
    const isMute = instance.mute() ? 0 : 1;
    instance.mute(isMute);
  });
}

class BannerVideo {
  constructor() {
    this.videoBackground = document.querySelector('[data-video-background]');
    this.video = this.videoBackground ? this.videoBackground.querySelector('video') : '';
  }
  init() {
    
    const $this = this;

    if (!$this.videoBackground) {
      return;
    }
    const idVideo = getUrlQueryString('v', $this.video.getAttribute('src'));
    const _bVideo = new BlsVideo({
      selector: '[data-video-background] video',
      type: 'youtube',
      playerVars: {
        controls: 1,
        autoplay: 1,
        loop: 1,
        showinfo: 1,
        modestbranding: 1,
        rel: 0,
        autohide: 1,
        playsinline: true,
        mute: 1,
        version: 3,
        wmode: 'transparent',
        playlist: idVideo,
        playsinline: 1
      },
      events: {
        initialized(instance) {
          // show first frame of video
          _showFirstFrame(instance, idVideo);
        },
        initializedAll() {},
        ready(instance) {
          _calculateHeightVideo(instance);
          // _createBtnMute(instance);
          // remove first frame
          _removeFrame(instance);
          // setTimeout( () => {
          //   window.insplay = instance.play();
          // }, 300);
        },
        load(instance) {
        },
        beforePlay(instance) {
        },
        beforePause() {},
        afterEnd() {},
        lacking() {},
        playing() {},
        play() {},
        pause() {},
      }
    });
    $this.videoElement = _bVideo;
    return $this;
  }

  resize(instance) {
    window.addEventListener('resize', (e) => {
      const bVideo = instance.querySelector('.bls-video');
      const parent = _getClosestClass(instance, '.banner-video');
      parent.style.height = 'auto';
      parent.style.height = `${bVideo.clientHeight}px`;
    });
  }
}

export default BannerVideo;
