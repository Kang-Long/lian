var menuBtn = document.querySelector('.nav button');
var menuList = document.querySelector('.nav ul');
menuBtn.onclick = function () {
    if (menuList.classList.contains('extend')) {
        menuList.classList.remove('extend')
    } else {
        menuList.classList.add('extend')
    }
}

var picUl = document.querySelector('#pic > ul');

var current = 0;
var timer = setInterval(function () {
    current++;
    picUl.style.transform = "translateX(-" + current % 3 * 100 + 'vw' + ")"
    // if (current === 2) {
    //     current = -1;
    // }
}, 3000);