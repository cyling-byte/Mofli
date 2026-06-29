let now = new Date();
const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const Year = now.getFullYear();
const NowMonth = now.getMonth();
const BackToday = document.getElementById('back-today');

// 點擊按鈕
document.getElementById('back').addEventListener('click', () => {
    now.setMonth(now.getMonth() - 1);
    history();
});

document.getElementById('next').addEventListener('click', () => {
    now.setMonth(now.getMonth() + 1);
    history();
});

BackToday.addEventListener('click', () => {
    now.setMonth(NowMonth);
    history();
})
history();


function history() {
    const month = now.getMonth();
    const date = now.getDate();
    let days = document.getElementById('days');
    //設定日曆月份
    document.getElementById('month').textContent = `${Year} ${Months[month]}`;
    //設定日期
    const FirstDay = new Date(Year, month, 1).getDay(); // 取得月份第一天是星期幾
    const TotalDay = new Date(Year, month + 1, 0).getDate(); // 取得當月的總天數


    let infoDay = [];
    infoDay = days;
    infoDay.innerHTML = '';


    // 判斷當月第一天前面須補幾個空格
    for (let i = 0; i < FirstDay; i++) {
        infoDay.innerHTML += `<div class = 'empty'></div>`;
    }

    // for迴圈跑出當月日期
    for (let i = 1; i <= TotalDay; i++) {
        infoDay.innerHTML += `<div id='${i}'>${i}</div>`;
        if (month === NowMonth && i === date) {
            document.getElementById(i).classList.add('dateBgc');
        }
    }

    if (month !== NowMonth) {
        BackToday.style.display = 'block';
    } else {
        BackToday.style.display = 'none';
    }
}
