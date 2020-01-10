import CallModal from '../classes/call_modal';

export const _processCallModal = (targetModal, message) => { 
    const callModal = new CallModal();
    callModal.init();
    callModal.resultModal = message;
    callModal.targetModal = targetModal;
    setTimeout(() => {
        callModal.modal[0].open();
    },500);
}
