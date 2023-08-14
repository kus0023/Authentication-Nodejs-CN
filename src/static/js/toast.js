document.addEventListener('DOMContentLoaded', function () {
    let toastElList = [].slice.call(document.querySelectorAll('.toast'))

    let option = {
        delay: 5000
    }

    let toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl, option)
    })

    toastList.forEach(e=>{
        e.show();
    })
}, false);