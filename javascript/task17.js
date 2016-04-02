/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

/* 用于渲染图表的数据
 *var chartData= {
 *  "北京": {day[],week[],month[]],
 */
var chartData= {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    var data = chartData[pageState.nowSelectCity][pageState.nowGraTime];
    var aqiChartWrap = document.getElementsByClassName("aqi-chart-wrap")[0];
    aqiChartWrap.innerHTML = "";
    aqiChartWrap.style.marginTop = "40px";
    aqiChartWrap.style.width = "100%";
    aqiChartWrap.style.display = "flex";
    aqiChartWrap.style.height = "500px";
    aqiChartWrap.style.flexDirection = "row";
    aqiChartWrap.style.alignItems = "flex-end";
    for(var i=0;i<data.length;i++) {
        var div = document.createElement("div");
        div.style.flex = "1";
        div.style.height = data[i] +"px"; 
        div.style.backgroundColor =  "#" + Math.random().toString(16).substring(2, 8);
        div.setAttribute("title", pageState.nowGraTime + " " +(i+1)+":  "+data[i]);
        aqiChartWrap.appendChild(div);
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
    var inputs = document.getElementsByTagName("input");
    var inputChecked;
    for (var i=0;i<inputs.length;i++) {
        if( inputs[i].checked == true) { 
            inputChecked = inputs[i].value;
        }
    }
    if( inputChecked != pageState.nowGraTime) {
        // 设置对应数据
        pageState.nowGraTime = inputChecked;
        // 调用图表渲染函数  
        renderChart();
   }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    var options = document.getElementsByTagName("option");
    var optionSelected;
    for(var i=0;i<options.length;i++) {
        if ( options[i].selected == true ) {
            optionSelected = options[i].innerHTML;
        }
    }
    // 确定是否选项发生了变化 
    if ( optionSelected != pageState.nowSelectCity) {
        // 设置对应数据,调用图标渲染函数。
        pageState.nowSelectCity = optionSelected;
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var input = document.getElementById("form-gra-time");
    input.onchange = function () {
        graTimeChange();
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
     // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
     var select = document.getElementById("city-select");
     for( attr in aqiSourceData ) {
        var option = document.createElement("option");
        option.innerHTML = attr;
        select.appendChild(option);
     }
     // 给select设置事件，当选项发生变化时调用函数citySelectChange
     select.onchange = function () {
        citySelectChange();
    }
}


/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式, 处理好的数据存到 chartData 中
    function average(array) {
        var num=0;
        for( var i=0;i<array.length;i++) {
            num += array[i];
        }
        return num/array.length;
    }
    for ( city in aqiSourceData ) {
        var day = [],
            week = [],
            month = [];
        for ( date in aqiSourceData[city] ) {
            day.push(aqiSourceData[city][date]);//选择day的chart数据;    
        }
        //下面是处理选择month的数据。
        var monthOne, monthTwo, monthThree,monthTotal;
        monthOne = average(day.slice(0,31));
        monthTwo = average(day.slice(31,60));
        monthThree = average(day.slice(60,91));
        month = [monthOne, monthTwo, monthThree];
        //下面是处理选择week的数据。
        monthTotal = [day.slice(0,31), day.slice(31,60), day.slice(60,91)];
        for (var i=0;i<monthTotal.length;i++) {
            var k=j=0;
            while (true) {
                var k = j+7 < monthTotal[i].length ? j+7 : monthTotal[i].length;
                week.push(average(monthTotal[i].slice(j,k)));
                j += 7;
                if( k == monthTotal[i].length) break;
            }
        }
        var cityObject = new Object();
        console.log(week.length);
        cityObject["day"]= day;
        cityObject["week"] = week;
        cityObject["month"] = month;
        chartData[city] = cityObject;
    }
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

window.onload = function () {
    init();
}