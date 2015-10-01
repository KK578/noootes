// Toast Listener
window.addEventListener('toast-message', function (event) {
    var detail = event.detail;

    var toast = document.getElementById('noootes-toast');
    toast.text = detail.message;
    toast.show();
});

// String Repeat Polyfill
if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        return new Array(count + 1).join(this);
    };
}
