
// == 取得日期標題 ==========================================================
function getWeekDates() {
    const WeekDates = [];
    const dayNames = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
    const today = new Date(); // 取得今天日期
    const currentDay = today.getDay(); // 取得今天星期幾
    const getSunday = new Date(today);
    // console.log(getSunday);
    getSunday.setDate(today.getDate() - currentDay); // 取得這周星期日的日期
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(getSunday);
        nextDay.setDate(getSunday.getDate() + i); // 取得這周所有日期
        // console.log(nextDay);

        WeekDates.push({
            dateStr: `${nextDay.getMonth() + 1}/${nextDay.getDate()}`, // 取得日期
            dayName: `${dayNames[i]}`
        });
    }
    // console.log(getSunday);
    return WeekDates;
}

// console.log(getWeekDates());

let stateTable = document.getElementById('stateTable');
const stateName = ['精神', '食慾', '活動', '排便'];
const summaryName = document.getElementById('summaryName');

function renderTable() {
    let weekDates = getWeekDates();
    let htmlContent = '';
    htmlContent += `<div></div>`;

    // == 渲染日期標題 ====================================================================
    weekDates.forEach(date => {
        htmlContent += `<div class = "title-date">${date.dateStr}<br>${date.dayName}</div>`;
    });

    // == 選染狀態列 =================================================================
    stateName.forEach(state => {
        htmlContent += `<div class="state-txt">${state}</div>`;
        for (let i = 0; i < 7; i++) {
            const storageKey = `${state}-${i}`;
            let saveImgSrc = localStorage.getItem(storageKey);
            let nullImgSrc = './images/mood-plus.svg"';
            if (saveImgSrc) {
                nullImgSrc = saveImgSrc;
            }
            htmlContent += `
                        <div class="state-input ">
                                <button class="btn-state-cell" data-type = "${state}" data-day="${i}">
                                    <span class"moodPlus">
                                        <img src="${nullImgSrc}" alt="" >
                                    </span>
                                </button>
                                <div class="state-panel" >
                                    <img src="./images/mood-smile.svg" alt="" class="btn-mood">
                                    <img src="./images/mood-empty.svg" alt="" class="btn-mood">
                                    <img src="./images/mood-sad.svg" alt="" class="btn-mood">
                                </div>
                        </div>
                    `;
        }
    });
    stateTable.innerHTML = htmlContent;
}

renderTable();
updateSummaryChart(); //  剛開網頁先統計並填滿長條圖

// == 點擊按鈕出現狀態列 =======================================================
let stateCellBtns = document.querySelectorAll('.btn-state-cell');
// console.log(stateCellBtns);
stateCellBtns.forEach(function (Btns) {
    Btns.addEventListener('click', function (e) {
        // console.log(this);
        e.stopPropagation(); // 阻止事件冒泡
        const onPanel = this.closest('.state-input').querySelector('.state-panel');

        // == 移除非當前面板的 _on =========================================
        document.querySelectorAll('.state-panel').forEach(panel => {
            if (panel !== onPanel) {
                panel.classList.remove('_onPanel');
            }
        });
        this.closest('.state-input').querySelector('.state-panel').classList.toggle('_onPanel');
    });
});

// // == 點擊空白處讓panel關閉 ==============================================
document.addEventListener('click', function () {
    document.querySelectorAll('.state-panel').forEach(item => {
        item.classList.remove('_onPanel');
    });
});

// == 渲染狀態 =============================================================
let btnMoods = document.querySelectorAll('.btn-mood');

btnMoods.forEach(function (mood) {
    let moodPlus = document.getElementsByClassName('moodPlus');
    // let btn = this.querySelector('.btn-state-cell');
    mood.addEventListener('click', function (e) {
        e.preventDefault();

        const stateInput = this.closest('.state-input');
        let target = stateInput.querySelector('.btn-state-cell img');
        target.src = this.src;

        // == 存入localstorage =========================================
        let currentBtn = stateInput.querySelector('.btn-state-cell');
        let type = currentBtn.getAttribute('data-type');
        let day = currentBtn.getAttribute('data-day');

        let stateKey = `${type}-${day}`;
        localStorage.setItem(stateKey, mood.src);
        // console.log(localStorage);
        updateSummaryChart();
    });
});

let currentCategoryIndex = 0;
summaryName.innerText = stateName[currentCategoryIndex]; // 初始化名稱

// 點擊左箭頭
document.querySelector('.summary-switcher ._back').addEventListener('click', function () {
    currentCategoryIndex = (currentCategoryIndex - 1 + stateName.length) % stateName.length;
    summaryName.innerText = stateName[currentCategoryIndex];
    updateSummaryChart(); //  切換了名稱，長條圖立刻重新計算
});

// 點擊右箭頭
document.querySelector('.summary-switcher ._next').addEventListener('click', function () {
    currentCategoryIndex = (currentCategoryIndex + 1) % stateName.length;
    summaryName.innerText = stateName[currentCategoryIndex];
    updateSummaryChart(); //  切換了名稱，長條圖立刻重新計算
});

function updateSummaryChart() {
    // A. 取得當前大卡片顯示哪一個分類（例如："精神"）
    const currentCategory = summaryName.innerText.trim();

    // 準備三個計數器來算天數
    let goodDays = 0;
    let neutralDays = 0;
    let badDays = 0;

    // B. 跑 0~6 迴圈，撈出這 7 天在 localStorage 的資料
    for (let i = 0; i < 7; i++) {
        const storageKey = `${currentCategory}-${i}`;
        const saveImgSrc = localStorage.getItem(storageKey);

        if (saveImgSrc) {
            // 💡 根據你儲存的圖片檔名，判斷使用者選了哪種表情
            if (saveImgSrc.includes('mood-smile.svg')) {
                goodDays++;
            } else if (saveImgSrc.includes('mood-empty.svg')) {
                neutralDays++;
            } else if (saveImgSrc.includes('mood-sad.svg')) {
                badDays++;
            }
        }
    }

    // C. 計算百分比（分母是 7 天）
    const goodPercent = (goodDays / 7) * 100;
    const neutralPercent = (neutralDays / 7) * 100;
    const badPercent = (badDays / 7) * 100;

    // D. 渲染天數文字到 HTML 畫面中
    document.getElementById('countGood').innerText = goodDays;
    document.getElementById('countNeutral').innerText = neutralDays;
    document.getElementById('countBad').innerText = badDays;

    // E. 🌟 動態設定長條圖的寬度（寬度會隨著百分比變化而填滿）
    document.getElementById('barGood').style.width = `${goodPercent}%`;
    document.getElementById('barNeutral').style.width = `${neutralPercent}%`;
    document.getElementById('barBad').style.width = `${badPercent}%`;
}


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

document.querySelectorAll('.schedule-date').forEach(item => {
    // console.log(item);
    item.addEventListener('click', function () {
        // console.log(this);

        $(this).closest('.schedule-list').find('.schedule-item').slideToggle(600);
        $(this).closest('.schedule-list').find('.schedule-date').toggleClass('_open');
    });
});


// == 今日任務完成樣式 =========================================
let toDoCheck = document.querySelectorAll('.todo-check');
toDoCheck.forEach(item => {

    item.addEventListener('click', function () {
        const checked = this.closest('.list-style');
        // const checkedIcon = checked.querySelector('')
        let checkState = checked.getAttribute('data-check');
        
        checked.classList.toggle('_finish');
        

        if (checkState !== 'true') {
            
            checked.dataset.check = 'true';
        } else {
            
            checked.dataset.check = 'false';
        }
        // console.log(checkState);
    });
});