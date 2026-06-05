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
        tension: 0.1,
        borderJoinStyle: 'miter'
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
        tension: 0.1,
        borderJoinStyle: 'miter'
    }
});

//月曆---------------------------------------------------------
let currentDate = new Date();
const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const englishMonth = Months[currentDate.getMonth()];

    // 設定標題年月
    document.getElementById('month-year').textContent = `${englishMonth}`;

    // 該月第一天是星期幾 (0-6)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // 該月總天數
    const totalDays = new Date(year, month + 1, 0).getDate();

    const daysContainer = document.getElementById('days-container');
    daysContainer.innerHTML = '';

    // 填補上個月的空白天數
    for (let i = 0; i < firstDayIndex; i++) {
        daysContainer.innerHTML += `<div class="empty"></div>`;
    }

    // 填入當月日期
    for (let i = 1; i <= totalDays; i++) {
        daysContainer.innerHTML += `<div>${i}</div>`;
    }
}

// 切換月份按鈕
document.getElementById('prev-btn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();



//快速紀錄打開按鈕

let KvBtn = document.getElementById('kv-btn');
let BtnInfo = document.getElementsByClassName('btn-info');
KvBtn.addEventListener('click',()=>{
    if(KvBtn.value === 'open'){
        KvBtn.value = 'close';
        BtnInfo[0].classList.add('open');
    }else{
        KvBtn.value = 'open';
        BtnInfo[0].classList.remove('open');
    }
},false);