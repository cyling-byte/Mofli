

// == 手機版--漢堡選單 =====================================
$('#btn-hamburger').on('click', function () {
    const target = $(this).closest('nav');
    target.find('div.nav-a').toggleClass('_enter');

});



// == 手機版--子選單 ============================================
$('div.tabs').closest('a').on('click', function (e) {
    // e.preventDefault();

    const target = $(this).closest('li');
    activeSmoothEntry(target, 'ul.sub-project');
    const iconItem = target.find('.fa-caret-down');
    activeRotate(iconItem);
});



// == icon--旋轉 =============================================
function activeRotate(icon) {
    icon.toggleClass('_rotate');
}


// == 平滑出現 =======================================
function activeSmoothEntry(item, target) {
    item.find(target).slideToggle(600);
}

