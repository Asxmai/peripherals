// STM32 TIM Guide - Waveform Charts (v3 - vertically offset waveforms)
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var warn = '#D97706';
  var error = '#DC2626';
  var success = '#059669';

  function squareWave(period, highRatio, totalPoints, amplitude) {
    var data = [];
    var highPoints = Math.floor(period * highRatio);
    for (var i = 0; i < totalPoints; i++) {
      var phase = i % period;
      data.push(phase < highPoints ? amplitude : 0);
    }
    return data;
  }

  // === Chart 1: Standard PWM Waveform ===
  var el1 = document.getElementById('chart-pwm-normal');
  if (el1) {
    var chart1 = echarts.init(el1, null, { renderer: 'svg' });
    var period = 100, dutyCycle = 0.4, totalPts = 300;
    var pwmData = squareWave(period, dutyCycle, totalPts, 3.3);
    var xData = [];
    for (var i = 0; i < totalPts; i++) xData.push(i);

    chart1.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      grid: { left: 70, right: 40, top: 50, bottom: 55 },
      title: { text: 'PWM 参数: T=10μs, f=100kHz, 占空比=40%', left: 'center', top: 5, textStyle: { fontSize: 12, color: ink, fontWeight: 'normal' } },
      xAxis: { type: 'category', data: xData, name: '时间 (μs)', nameLocation: 'center', nameGap: 35, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, interval: 49, formatter: function(v) { return (v * 0.1).toFixed(0); } }, splitLine: { show: false } },
      yAxis: { type: 'value', name: '电压 (V)', min: -0.3, max: 4, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
      series: [{
        type: 'line', data: pwmData, showSymbol: false, lineStyle: { color: accent, width: 2.5 }, areaStyle: { color: accent + '18' },
        markLine: { silent: true, symbol: 'none', lineStyle: { color: muted, type: 'dashed', width: 1 }, label: { color: muted, fontSize: 10, position: 'insideEndTop' }, data: [{ yAxis: 3.3, label: { formatter: 'V_H = 3.3V' } }, { yAxis: 0, label: { formatter: 'V_L = 0V' } }] },
        markArea: { silent: true, data: [[{ xAxis: 0, itemStyle: { color: accent + '12' }, label: { show: true, position: 'insideTop', formatter: 'Ton = 4μs', color: accent, fontSize: 10, offset: [0, 5] } }, { xAxis: Math.floor(period * dutyCycle) }], [{ xAxis: Math.floor(period * dutyCycle), itemStyle: { color: warn + '10' }, label: { show: true, position: 'insideTop', formatter: 'Toff = 6μs', color: warn, fontSize: 10, offset: [0, 5] } }, { xAxis: period }]] }
      }]
    });
    window.addEventListener('resize', function() { chart1.resize(); });
  }

  // === Chart 2: Input Capture ===
  var el2 = document.getElementById('chart-ic-freq');
  if (el2) {
    var chart2 = echarts.init(el2, null, { renderer: 'svg' });
    var sigPeriod = 80, sigData = squareWave(sigPeriod, 0.5, 240, 3.3);
    var xData2 = [];
    for (var i = 0; i < 240; i++) xData2.push(i);

    chart2.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      title: { text: '捕获原理: 两次上升沿之间的 CNT 差值 = Δ', left: 'center', top: 5, textStyle: { fontSize: 12, color: ink, fontWeight: 'normal' } },
      grid: { left: 70, right: 40, top: 50, bottom: 55 },
      xAxis: { type: 'category', data: xData2, name: '时间', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, interval: 79 }, splitLine: { show: false } },
      yAxis: { type: 'value', min: -0.3, max: 4, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
      series: [{
        type: 'line', data: sigData, showSymbol: false, lineStyle: { color: accent, width: 2.5 },
        markLine: { silent: true, symbol: ['triangle', 'triangle'], symbolSize: 8, lineStyle: { color: error, type: 'solid', width: 2 }, label: { show: false }, data: [[{ coord: [0, 0] }, { coord: [0, 3.3] }], [{ coord: [sigPeriod, 0] }, { coord: [sigPeriod, 3.3] }]] },
        markArea: { silent: true, itemStyle: { color: error + '10' }, data: [[{ xAxis: 0, label: { show: true, position: 'insideTop', formatter: '↑ 捕获1: CCR1 = CNT₁', color: error, fontSize: 10, offset: [0, 8] } }, { xAxis: sigPeriod, label: { show: true, position: 'insideTop', formatter: '↑ 捕获2: CCR2 = CNT₂   → f = TIM_CLK/(PSC+1)/Δ', color: error, fontSize: 10, offset: [0, 8] } }]] }
      }]
    });
    window.addEventListener('resize', function() { chart2.resize(); });
  }

  // === Chart 5: Abnormal Waveform (VERTICALLY OFFSET - 3 separate sub-grids) ===
  var el5 = document.getElementById('chart-abnormal');
  if (el5) {
    var chart5 = echarts.init(el5, null, { renderer: 'svg' });
    var abPeriod = 100, totalAb = 300;

    var normalData = squareWave(abPeriod, 0.4, totalAb, 3.3);

    var glitchData = squareWave(abPeriod, 0.4, totalAb, 3.3);
    for (var i = 0; i < totalAb; i++) {
      var phase = i % abPeriod;
      if (phase === Math.floor(abPeriod * 0.4) || phase === Math.floor(abPeriod * 0.4) + 1) glitchData[i] = 4.5;
      if (phase === 0 || phase === 1) glitchData[i] = -0.8;
    }

    var shootHigh = [], shootLow = [];
    for (var i = 0; i < totalAb; i++) {
      var phase = i % abPeriod;
      // Perfectly complementary: no dead time, no overlap
      if (phase < Math.floor(abPeriod * 0.4)) {
        shootHigh.push(3.3); shootLow.push(0);
      } else {
        shootHigh.push(0); shootLow.push(3.3);
      }
    }
    // Offset shootLow up by 4V for clear separation
    var shootLowOffset = shootLow.map(function(v) { return v + 4; });

    chart5.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      title: { text: '异常波形对比: 正常 vs 毛刺 vs 直通', left: 'center', top: 5, textStyle: { fontSize: 12, color: ink, fontWeight: 'normal' } },
      legend: { data: ['正常 PWM', '毛刺波形', '上管 (直通)', '下管 (直通, 上移)'], top: 28, textStyle: { color: ink, fontSize: 10 } },
      grid: [
        { left: 70, right: 40, top: 65, height: '14%' },
        { left: 70, right: 40, top: '28%', height: '14%' },
        { left: 70, right: 40, top: '52%', height: '22%' }
      ],
      xAxis: [
        { type: 'category', data: Array.from({length: totalAb}, function(_, i) { return i; }), gridIndex: 0, show: false },
        { type: 'category', data: Array.from({length: totalAb}, function(_, i) { return i; }), gridIndex: 1, show: false },
        { type: 'category', data: Array.from({length: totalAb}, function(_, i) { return i; }), gridIndex: 2, name: '时间', nameLocation: 'center', nameGap: 25, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, interval: 99 }, splitLine: { show: false } }
      ],
      yAxis: [
        { gridIndex: 0, min: -1, max: 5, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, fontSize: 10 }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
        { gridIndex: 1, min: -1, max: 5, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, fontSize: 10 }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
        { gridIndex: 2, min: -1, max: 8, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, fontSize: 10 }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } }
      ],
      series: [
        { name: '正常 PWM', type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: normalData, showSymbol: false, lineStyle: { color: success, width: 2.5 } },
        { name: '毛刺波形', type: 'line', xAxisIndex: 1, yAxisIndex: 1, data: glitchData, showSymbol: false, lineStyle: { color: warn, width: 2.5 } },
        { name: '上管 (直通)', type: 'line', xAxisIndex: 2, yAxisIndex: 2, data: shootHigh, showSymbol: false, lineStyle: { color: accent, width: 2.5 } },
        { name: '下管 (直通, 上移)', type: 'line', xAxisIndex: 2, yAxisIndex: 2, data: shootLowOffset, showSymbol: false, lineStyle: { color: accent2, width: 2.5 } }
      ],
      graphic: [
        { type: 'text', left: 75, top: 72, style: { text: '正常: 干净方波', fill: success, fontSize: 11, fontWeight: 'bold' } },
        { type: 'text', left: 75, top: '29%', style: { text: '异常: 边沿毛刺 (EMI/地弹)', fill: warn, fontSize: 11, fontWeight: 'bold' } },
        { type: 'text', left: 75, top: '53%', style: { text: '异常: 上下管直通 (无死区, 下管上移)', fill: error, fontSize: 11, fontWeight: 'bold' } }
      ]
    });
    window.addEventListener('resize', function() { chart5.resize(); });
  }

})();
