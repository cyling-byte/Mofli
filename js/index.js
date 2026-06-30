
// == 取得日期標題 ==========================================================
function getWeekDates() {
    const WeekDates = [];
    const dayNames = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
    const today = new Date();
    const currentDay = today.getDay();
    const getSunday = new Date(today);

    getSunday.setDate(today.getDate() - currentDay);
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(getSunday);
        nextDay.setDate(getSunday.getDate() + i);

        WeekDates.push({
            dateStr: `${nextDay.getMonth() + 1}/${nextDay.getDate()}`,
            dayName: `${dayNames[i]}`
        });
    }
    return WeekDates;
}

let stateTable = document.getElementById('stateTable');
const stateName = ['精神', '食慾', '活動', '排便'];

function renderTable() {
    let weekDates = getWeekDates();
    let htmlContent = '';
    htmlContent += `<div></div>`;

    // == 渲染日期標題（🌟 幫每一天加上 data-day 索引） ==========================
    weekDates.forEach((date, index) => {
        htmlContent += `<div class="title-date" data-day="${index}">${date.dateStr}<br>${date.dayName}</div>`;
    });

    // == 渲染狀態列（🌟 幫每個儲存格加上 data-day 與 data-type） ==================
    stateName.forEach(state => {
        htmlContent += `<div class="state-txt">${state}</div>`;
        for (let i = 0; i < 7; i++) {
            const storageKey = `${state}-${i}`;
            let saveImgSrc = localStorage.getItem(storageKey);
            let nullImgSrc = './images/mood-plus.svg'; // 💡 幫你修正了原本多出來的雙引號
            if (saveImgSrc) {
                nullImgSrc = saveImgSrc;
            }
            htmlContent += `
                <div class="state-input" data-day="${i}" data-type="${state}">
                    <button class="btn-state-cell" data-type="${state}" data-day="${i}">
                        <span class="moodPlus">
                            <img src="${nullImgSrc}" alt="">
                        </span>
                    </button>
                    <div class="state-panel">
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

// == 🌟 手機版左右按鈕切換邏輯（直接複製貼上） ===================================
let currentActiveDay = 4; // 預設顯示 6/4 (四) 這一天（索引值為 4）

function switchMobileDay() {
    // 1. 先把所有人身上的當前顯示類別拔掉
    $('#stateTable > div').removeClass('current');

    // 2. 只把當天符合 data-day 的 5 個元素（1個日期 + 4個狀態儲存格）集體加上 .current
    $(`#stateTable > div[data-day="${currentActiveDay}"]`).addClass('current');
}

// 網頁載入時先執行一次
switchMobileDay();

// 綁定你的左右切換按鈕（請確保你 HTML 上的按鈕 id 叫 nextBtn 和 prevBtn）
$('#nextBtn').on('click', function () {
    if (currentActiveDay < 6) {
        currentActiveDay++;
        switchMobileDay();
    }
});

$('#prevBtn').on('click', function () {
    if (currentActiveDay > 0) {
        currentActiveDay--;
        switchMobileDay();
    }
});
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

// // == 點擊空白處讓panel關閉 ===============================
document.addEventListener('click', function () {
    document.querySelectorAll('.state-panel').forEach(item => {
        item.classList.remove('_onPanel');
    });
});

// == 渲染狀態 ========================================================
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


// == 月曆 ===========================================================
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


//== 展開近期行程 =============================================
document.querySelectorAll('.schedule-date').forEach(item => {

    item.addEventListener('click', function () {

        const listItem = $(this).closest('.schedule-list');
        let iconItem = listItem.find('.fa-caret-down');

        activeSmoothEntry(listItem, '.schedule-item', 600);
        listItem.find('.schedule-date').toggleClass('_open');
        activeRotate(iconItem);

    });
});


// == 今日任務完成樣式 =========================================
let toDoCheck = document.querySelectorAll('.todo-check');

toDoCheck.forEach(item => {

    item.addEventListener('click', function () {
        const checked = this.closest('.list-style');
        let iconChange = checked.querySelector('.fa-circle');
        checked.classList.toggle('_finish');

        if (iconChange.title !== 'true') {
            iconChange.innerHTML = `<i class="fa-solid fa-circle-check icon-style" ></i>`;
            iconChange.title = 'true';
        } else {
            iconChange.innerHTML = `<i class="fa-regular fa-circle icon-style"></i>`;
            iconChange.title = 'false';
        }
        // console.log(checkState);
    });
});





// == 手機板-新增事件 ========================================
$('#addEvent').on('click', function () {
    const target = $(this).closest('div.date-board').find('div.drawer');
    target.css('display', 'block');
    setTimeout(function () {
        target.addClass('_show');
    }, 20);


});

// == 手機版-點擊關閉按鈕 ===================================
$('#btn-close').on('click', function () {
    const target = $(this).closest('div.date-board').find('div.drawer');
    target.removeClass('_show');
    setTimeout(function () {
        target.css('display', 'none');
    }, 400);
    $(window).on('resize', function () {
        let windowWidth = $(window).width();
        if (windowWidth >= 768) {
            $('.calendar').removeAttr('style');
        }
    });

});