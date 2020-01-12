import blsValidation from '../../../../core/brayleinosplash/plugins/bls_validation/bls_validation';
import { convertNodeListToArray, ajaxRequest, loadTemplate, processTemplate } from '../../../../core/brayleinosplash/utils';
import { _getClosestClass, _serialize } from './helper_class';
import { _processCallModal } from './../widgets/call_modal';

function callApi(form, status) {
  const method = form.getAttribute('method');
  const action = form.getAttribute('action');

  let data = _serialize(form).split('&');
  let obj = {};
  for(var key in data)
  {
      obj[data[key].split("=")[0]] = encodeURI(data[key].split("=")[1]);
  }
  obj.form_name = obj.first_name + obj.family_name;
  obj.phone_no = obj.phone_id + obj.phone_no;
  obj.donation_status = status;
  const callAjax = ajaxRequest({method: method, url:action, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(obj)});
  callAjax.then((res) => {
    let result = JSON.parse(res);
      if (result.result == 'OK') {
        // if (status == 'Publish') {
          // let dataPublish = _serialize(form).split('&');
          // let objPublish = {};
          // for(var key in dataPublish)
          // {
          //     obj[dataPublish[key].split("=")[0]] = encodeURI(dataPublish[key].split("=")[1]);
          // }
          // objPublish.donation_status = status;
          obj.id = result.data.id;
        }
        callApiSubmit(form, obj);

      // }
      form.reset();
  }).catch(err => {
    console.log(err);
  })
}

function callApiSubmit(form, obj) {
  const callAjaxPublish = ajaxRequest({method: method, url: 'https://unicefint.brayleinosplash.com/api/unicef/SubmitForm',headers: {'Content-Type': 'application/json'}, body: JSON.stringify(obj)});

  callAjaxPublish.then((res)=> {
    let rs = JSON.parse(res);
    if (rs.result == 'OK') {
      if (obj.donation_status == 'Publish') {
        const resultMessage = `<p><strong>Thank you! Your response has been submitted.</strong></p><p>Thank you for your interest in UNICEF.</p>`;
        popupMessage('.form-donate', resultMessage);
      }
    }else {
      if (obj.donation_status == 'Publish') {
        const resultMessage = rs.result;
        popupMessage('.form-donate',resultMessage );
      }
    }
  }).catch(err => {
    console.log(err);
  })
}

function popupMessage(form, message) {;
  // call modal after submit successful
 _processCallModal(form, message);
}

function checkValid(form) {
  let errMessage = [];
  const field = form.querySelectorAll('.error');
  field.forEach(f => {
    (f.innerText !== "") ? errMessage.push(f.innerText):"";
  })
  return errMessage;

}

class validateForm {
  constructor() {
    this.target = document.querySelector('[data-donate-validate]');
  }
  init() { 
    const $this = this;
    if (!$this.target) {
      return;
    }

    $this.validationForm = new blsValidation({
        selector: '[data-donate-validate]',
        events: {
          initialized(instance) {
            const donateValue = instance.elements.form.querySelector('.donateValue');
            const listDonaValue = instance.elements.form.querySelectorAll('.form-donate__type--value');
            const radioCheck  = instance.elements.form.querySelector('.form-donate__receive .form-check-input');
            listDonaValue.forEach(value => {
              value.addEventListener('click', () => {
                if (!value.classList.contains('active')) {
                  instance.elements.form.querySelector('.form-donate__type--value.active').classList.remove('active');
                  value.classList.add('active');
                }
                if (value.innerText == 'Other amount') {
                  donateValue.value = '';
                  donateValue.focus();
                } else {
                  donateValue.value = value.innerText;
                }
              });
            });

            radioCheck.addEventListener('change', (e) => {
              let receiveAddress = document.querySelector('.form-donate__address');
              if (e.target.checked) {
                receiveAddress.classList.add('active')
              }else {
                if (receiveAddress.classList.contains('active'))   receiveAddress.classList.remove('active')
              }
            });

          },
          initializedAll (instance) {
            let submit = instance[0].querySelector('.btn-submit');
            let error = instance[0].querySelectorAll('.form-group .error');
            let fieldInput = instance[0].querySelectorAll('input, select');

            let errMessage = [];
            fieldInput.forEach(field => {
              field.addEventListener('change', (event) => {
                errMessage = [];
                error.forEach(err => {
                  errMessage.push(err.innerText);
                });
                if ( event.target.getAttribute('name') =='phone_no'  || event.target.getAttribute('name') == 'email') {
                  let errorDiv = event.target.parentElement.querySelector('.error');
                  if (!errorDiv || !errorDiv.innerText  || errorDiv.innerText == '') {
                    //callAPI
                    callApi(instance[0], 'Draf');
                  }
                }
              });
            });

            submit.addEventListener('click', (event) => {
                fieldInput.forEach(field => {
                  field.focus();
                });
                error.forEach(err => {
                  errMessage.push(err.innerText);
                });
                const err = checkValid(instance[0]);
                if (err.length === 0) {
                  callApi(instance[0], 'Publish');
                  // popupMessage(instance[0], '<strong>Thank you!</strong><br/> Your response has been submitted.');
                  instance[0].reset();
                }
            });
          },

        }
    });
    return $this;
  }
}
export default validateForm;