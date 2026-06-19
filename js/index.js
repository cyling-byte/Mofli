let ShowMask = document.getElementsByClassName('mask');

let myChart = document.getElementById('myChart_Weight');
const label = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6'];
const data = {
    labels: label,
    datasets: [{
        label: '體重變化趨勢',
        data: ['7', '8.3', '7.5', '9.4', '6.6', '10.3'],
    }]
};

let chartWeight = new Chart(myChart, {
    type: 'line', //圖表類型
    data, //設定圖表資料
    options: {
        fill: false,
        borderColor: '#FF9F9F',
        tension: 0.4,
        borderJoinStyle: 'miter',
        maintainAspectRatio: false,
        // plugins: {
        //     legend: {
        //         display: false
        //     }
        // },
        aspectRatio: 1, // 數字越小，圖表越高
    }
});

let myChartBoold = document.getElementById('myChart_BloodSugar');
const BooldSuger_label = ['9:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
const BooldSuger_data = {
    labels: BooldSuger_label,
    datasets: [{
        label: '血糖變化趨勢',
        data: ['250', '180', '120', '110', '140', '190'],
    }]
};

let BooldSuger = new Chart(myChartBoold, {
    type: 'line', //圖表類型
    data: BooldSuger_data, //設定圖表資料
    options: {
        fill: false,
        borderColor: '#FF9F9F',
        tension: 0.4,
        borderJoinStyle: 'miter',
        maintainAspectRatio: false,
        // plugins: {
        //     legend: {
        //         display: false
        //     }
        // },
        aspectRatio: 1, // 數字越小，圖表越高
    }
});

//月曆---------------------------------------------------------
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


// 快速紀錄打開按鈕

// let KvBtn = document.getElementById('kv-btn');
// let BtnInfo = document.getElementsByClassName('btn-info');
// KvBtn.addEventListener('click', () => {
//     if (KvBtn.value === 'open') {
//         KvBtn.value = 'close';
//         BtnInfo[0].classList.add('open');
//         ShowMask[0].classList.add('show');
//     }
// }, false);


// 顯示更多行程按鈕

let MoreBtn = document.getElementById('morebtn');
let ViewMore = document.getElementById('more-sch');


let totalSchedule = [
    { schid: 1, schname: '施打疫苗', info: 'XXX寵物綜合醫院', date: '6/15', time: '上午 9:00' },
    { schid: 2, schname: '寵物美容', info: 'XXX寵物美容旅館', date: '6/27', time: '下午 3:00' },
    { schid: 3, schname: '健康檢查', info: 'OOO寵物綜合醫院', date: '7/1', time: '上午 10:00' },
    { schid: 4, schname: '事件4', info: 'OOO寵物綜合醫院', date: '7/1', time: '上午 10:00' },
    { schid: 5, schname: '事件5', info: 'OOO寵物綜合醫院', date: '7/1', time: '上午 10:00' },
    { schid: 6, schname: '事件6', info: 'OOO寵物綜合醫院', date: '7/1', time: '上午 10:00' },
];
const Close = `<button id = 'close' value="open">
                    <div>
                        <img src="./images/close.svg" alt="">
                    </div>
                </button>`;

MoreBtn.addEventListener('click', () => {
    if (MoreBtn.value === 'open') {
        MoreBtn.value = 'close';
        ViewMore.classList.add('open');
        ShowMask[0].classList.add('show');
    }
}, false);


function CloseMask(e) {
    ShowMask[0].addEventListener('click', () => {
        const OpenPanel = document.querySelector('.open');
        const ClosePanel = document.querySelector('button[value="close"]')
        if (OpenPanel) {
            OpenPanel.classList.remove('open');
            ShowMask[0].classList.remove('show');
        }
        if (ClosePanel) {
            ClosePanel.value = 'open';
        }
    }, false);
}

function showScheduleInfo() {
    let schHtml = '';
    let moreHtml = '';

    for (let i = 0; i < totalSchedule.length; i++) {
        let sch = totalSchedule[i];
        let schInfo = `<div class="schedule-txt">
                                    <div class="txt-left">
                                        <h4>${sch.schname}</h4>
                                        <p>${sch.info}</p>
                                    </div>
                                    <div class="txt-date">
                                        <p>${sch.date}</p>
                                        <p>${sch.time}</p>
                                    </div>
                                </div>`;
        if (i < 3) {
            schHtml += schInfo;
        } else {
            moreHtml += schInfo;
        }
    }
    document.getElementById('info').innerHTML = schHtml;
    document.getElementById('more-sch').innerHTML = Close + moreHtml;
}


showScheduleInfo();
CloseMask();

