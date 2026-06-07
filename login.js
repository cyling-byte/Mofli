
let remember = document.getElementById('remember');
let checkBox = document.getElementById('checkbox-img');
let OpenPsw = document.getElementById('openpsw');
const Submit = document.getElementById('submit');
let UserEmail = document.getElementById('user-email');
let UserPsw = document.getElementById('user-psw');


// 登入邏輯判斷
Submit.addEventListener('click', (e) => {
    e.preventDefault();
    if (UserEmail.value === 'mofli@gmail.com' && UserPsw.value === '111') {
        window.location.href = '/index.html';
        e.preventDefault();
    } else {
        window.alert('輸入錯誤');
    }
}, false);

//checkbox 樣式
remember.addEventListener('click', () => {
    if (checkBox.title === 'false') {
        checkBox.title = 'true';
        checkBox.src = './images/checkbox-true.svg';
    } else {
        checkBox.title = 'false';
        checkBox.src = './images/checkbox-false.svg'
    }
}, false);


// 顯示密碼邏輯判斷
OpenPsw.addEventListener('click', () => {
    if (OpenPsw.title === 'false') {
        OpenPsw.title = 'true';
        OpenPsw.src = './images/open.svg';
        UserPsw.type = 'text';
    } else {
        OpenPsw.title = 'false';
        OpenPsw.src = './images/closepsw.svg';
        UserPsw.type = 'password';
    }
}, false);