var wrapper = document.querySelector('.wrapper');

wrapper.onclick = function (e) {
    console.log(e.target)
    if(e.target.tagName === 'LI') {
        e.target.classList.add('active');
        wrapper.classList.add('activewrapper')
    }else if(e.target.classList.contains('close')) {
        wrapper.classList.remove('activewrapper');
        var parent = getLiparent(e.target);
        parent.classList.remove('active')
    }
}

function getLiparent(node) {
    var parent = node.parentNode;
    while(!parent.classList.contains('item') && parent !== document) {
        parent = parent.parentNode;
    }
    return parent;
}