// assets/charts.js
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart 1: GPIO Current Drive Capability Comparison ---
  var chartCurrent = echarts.init(document.getElementById('chart-current'), null, { renderer: 'svg' });
  chartCurrent.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var tip = '<strong>' + params[0].name + '</strong><br/>';
        params.forEach(function(p) {
          tip += p.marker + ' ' + p.seriesName + ': ' + p.value + ' mA<br/>';
        });
        return tip;
      }
    },
    legend: {
      data: ['单引脚最大灌电流', '单引脚最大拉电流', '端口总电流上限'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 11 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['STM32F4', 'STM32L4', 'STM32H7', 'ESP32', 'NXP LPC', 'ATmega328'],
      axisLabel: { color: ink, fontSize: 11, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '电流 (mA)',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [
      {
        name: '单引脚最大灌电流',
        type: 'bar',
        barWidth: '20%',
        data: [25, 25, 25, 40, 20, 40],
        itemStyle: { color: accent, borderRadius: [3, 3, 0, 0] }
      },
      {
        name: '单引脚最大拉电流',
        type: 'bar',
        barWidth: '20%',
        data: [25, 25, 25, 28, 20, 40],
        itemStyle: { color: accent2, borderRadius: [3, 3, 0, 0] }
      },
      {
        name: '端口总电流上限',
        type: 'bar',
        barWidth: '20%',
        data: [150, 100, 200, 160, 100, 200],
        itemStyle: { color: muted + '66', borderRadius: [3, 3, 0, 0] }
      }
    ]
  });
  window.addEventListener('resize', function() { chartCurrent.resize(); });

  // --- Chart 2: GPIO Toggle Speed & Edge Time ---
  var chartSpeed = echarts.init(document.getElementById('chart-speed'), null, { renderer: 'svg' });
  chartSpeed.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var tip = '<strong>' + params[0].name + '</strong><br/>';
        params.forEach(function(p) {
          var unit = p.seriesName.indexOf('频率') >= 0 ? ' MHz' : ' ns';
          tip += p.marker + ' ' + p.seriesName + ': ' + p.value + unit + '<br/>';
        });
        return tip;
      }
    },
    legend: {
      data: ['最大翻转频率', '上升时间 (10%-90%)', '下降时间 (10%-90%)'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 11 }
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['低速 (Low)', '中速 (Medium)', '高速 (High)', '超高速 (Very High)'],
      axisLabel: { color: ink, fontSize: 11, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '频率 (MHz)',
        nameTextStyle: { color: accent, fontSize: 11 },
        axisLabel: { color: accent, fontSize: 10 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      {
        type: 'value',
        name: '时间 (ns)',
        nameTextStyle: { color: accent2, fontSize: 11 },
        axisLabel: { color: accent2, fontSize: 10 },
        axisLine: { show: false },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '最大翻转频率',
        type: 'bar',
        barWidth: '30%',
        data: [2, 25, 50, 100],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: accent },
            { offset: 1, color: accent + '66' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '上升时间 (10%-90%)',
        type: 'line',
        yAxisIndex: 1,
        data: [120, 25, 10, 5],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: accent2, width: 2.5 },
        itemStyle: { color: accent2 }
      },
      {
        name: '下降时间 (10%-90%)',
        type: 'line',
        yAxisIndex: 1,
        data: [100, 20, 8, 4],
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: { color: '#D97706', width: 2.5 },
        itemStyle: { color: '#D97706' }
      }
    ]
  });
  window.addEventListener('resize', function() { chartSpeed.resize(); });

})();
