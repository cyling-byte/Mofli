

// == 手機版--漢堡選單 =====================================
$('#btn-hamburger').on('click', function () {
    const target = $(this).closest('nav');
    target.find('div.nav-a').toggleClass('_enter');

});



// == 手機版--子選單 ============================================
$('div.tabs').closest('a').on('click', function (e) {
    // e.preventDefault();

    const target = $(this).closest('li');
    activeSmoothEntry(target, 'ul.sub-project', 600);
    const iconItem = target.find('.fa-caret-down');
    activeRotate(iconItem);
});


// == 寵物選擇點擊事件 =================================
$('div.item').on('click', function () {
    const HasClass = $(this).hasClass('_click');
    if (HasClass) {
        return;
    }
    $('div.item').removeClass('_click');
    $(document).find('.pet-card-indi').find('img').attr('src', './images/fp-nofill.svg');
    $(this).addClass('_click');
    $(this).find('.pet-card-indi').find('img').attr('src', './images/footprint-dark.svg');
});


// == icon--旋轉 =============================================
function activeRotate(icon) {
    icon.toggleClass('_rotate');
}


// == 平滑出現 =======================================
function activeSmoothEntry(item, target, time) {
    item.find(target).slideToggle(time);
}

