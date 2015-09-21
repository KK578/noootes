window.addEventListener('toast-message', function (event) {
    var detail = event.detail;

    var toast = document.getElementById('noootes-toast');
    toast.text = detail.message;
    toast.show();
});
