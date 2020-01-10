
class Helper {
  static _getClosestClass(elem, selector) {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function(s) {
              var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                  i = matches.length;
              while (--i >= 0 && matches.item(i) !== this) {}
              return i > -1;
          };
    }
  
    // Get the closest matching element
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
    }
    return null;
  }

  static _getIndex(elements, activeClass) {
    if (!elements) {
      return;
    }
    for (let i = 0, len = elements.length; i < len; i++) {
      if (elements[i].classList.contains(activeClass)) {
        return i;
      }
    }
  }

  static _checkCurrentBreakpoint(currentWidth, listBreakpoint) {
    let current = null;
  
    if(listBreakpoint.length) {
      if(currentWidth > listBreakpoint[0].breakpoint) {
        return null;
      }
      listBreakpoint.map(item => {
        if(currentWidth <= item.breakpoint) {
          current = item;
        }
      });
    }
    return current;
  }


  static _fireEvent(eventName) {

    if (typeof(Event) === 'function') {
      // modern browsers
       window.dispatchEvent(new Event(eventName));
    } else {
        // for IE and other old browsers
        // causes deprecation warning on modern browsers
        var evt = window.document.createEvent('UIEvents'); 
        evt.initUIEvent(eventName, true, false, window, 0); 
        window.dispatchEvent(evt);
    }
  }
  
  
  
  static _serialize(form) {
    if(!form) {
      return false;
    }
    let rs = [];
    
    const convertNodeListToArray = (nodeList) => {
      if (Array.from) {
        return Array.from(nodeList);
      }
      return Array.prototype.slice.call(nodeList);
    }
    
    
    let elements = form.elements;
    if(elements.length) {
      
      elements = convertNodeListToArray(elements);
      
      elements = elements.filter(field => {
        return field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button';
      }).map(field => {
        if (field.type === 'select-multiple') {
          for (var n = 0; n < field.options.length; n++) {
            if (!field.options[n].selected) continue;
            rs.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
          }
        }else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
          rs.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
        }
      })
      return rs.join('&');
    }
    return rs;
  }
}

export default Helper;

export const { _getClosestClass } = Helper;
export const { _getIndex } = Helper;
export const { _checkCurrentBreakpoint } = Helper;
export const { _fireEvent } = Helper;
export const { _serialize } = Helper;
