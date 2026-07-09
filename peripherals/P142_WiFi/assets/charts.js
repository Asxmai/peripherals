// WiFi Embedded Guide - Charts
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var warn = style.getPropertyValue('--warn').trim();
  var error = style.getPropertyValue('--error').trim();
  var success = style.getPropertyValue('--success').trim();

  // ============================================================
  // Chart 1: WiFi TX Envelope (Time Domain)
  // ============================================================
  var chartTx = echarts.init(document.getElementById('chart-wifi-tx-envelope'), null, { renderer: 'svg' });

  var txTime = [];
  var txAmp = [];
  for (var i = 0; i < 10; i++) {
    txTime.push(i * 0.8);
    txAmp.push(i < 1 ? 0 : (i % 2 === 0 ? 0.5 : 0.7));
  }
  for (var i = 10; i < 18; i++) {
    txTime.push(i * 0.8);
    txAmp.push(0.8);
  }
  txTime.push(18 * 0.8); txAmp.push(0.9);
  txTime.push(19 * 0.8); txAmp.push(0.9);
  for (var i = 20; i < 60; i++) {
    txTime.push(i * 0.8);
    txAmp.push(1.0 + (Math.random() - 0.5) * 0.05);
  }
  txTime.push(60 * 0.8); txAmp.push(0.3);
  txTime.push(61 * 0.8); txAmp.push(0.0);

  chartTx.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true },
    grid: { left: 60, right: 30, top: 50, bottom: 50 },
    xAxis: {
      type: 'value', name: '时间 (μs)',
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    yAxis: {
      type: 'value', name: '幅度 (归一化)', min: 0, max: 1.3,
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [{
      type: 'line',
      data: txTime.map(function(t, i) { return [t, txAmp[i]]; }),
      smooth: false, lineStyle: { color: accent, width: 2 },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
        { offset: 0, color: accent + '40' }, { offset: 1, color: accent + '05' }
      ]}},
      itemStyle: { color: accent }, showSymbol: false,
      markArea: {
        silent: true,
        data: [
          [{ xAxis: 0, yAxis: 0, itemStyle: { color: accent + '10' }, label: { show: true, position: 'insideTop', formatter: 'STS', color: muted, fontSize: 10 }}, { xAxis: 8, yAxis: 1.3 }],
          [{ xAxis: 8, yAxis: 0, itemStyle: { color: accent2 + '10' }, label: { show: true, position: 'insideTop', formatter: 'LTS', color: muted, fontSize: 10 }}, { xAxis: 14.4, yAxis: 1.3 }],
          [{ xAxis: 14.4, yAxis: 0, itemStyle: { color: warn + '10' }, label: { show: true, position: 'insideTop', formatter: 'Signal', color: muted, fontSize: 10 }}, { xAxis: 16, yAxis: 1.3 }],
          [{ xAxis: 16, yAxis: 0, itemStyle: { color: success + '10' }, label: { show: true, position: 'insideTop', formatter: 'DATA', color: muted, fontSize: 10 }}, { xAxis: 48, yAxis: 1.3 }]
        ]
      }
    }]
  });
  window.addEventListener('resize', function() { chartTx.resize(); });

  // ============================================================
  // Chart 2: WiFi Spectrum (2.4GHz Channels)
  // ============================================================
  var chartSpec = echarts.init(document.getElementById('chart-wifi-spectrum'), null, { renderer: 'svg' });

  function genSpectrum(center, bandwidth, points) {
    var data = [];
    var start = 2400, end = 2500, step = (end - start) / points;
    for (var f = start; f <= end; f += step) {
      var x = (f - center) / (bandwidth / 2);
      var y = Math.abs(x) < 0.001 ? 1.0 : Math.abs(Math.sin(Math.PI * x) / (Math.PI * x));
      data.push([f, 20 * Math.log10(Math.max(y, 0.001))]);
    }
    return data;
  }

  chartSpec.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true },
    legend: { data: ['信道 1 (2412MHz)', '信道 6 (2437MHz)', '信道 11 (2462MHz)'], top: 5, textStyle: { color: ink, fontSize: 11 } },
    grid: { left: 60, right: 30, top: 45, bottom: 50 },
    xAxis: { type: 'value', name: '频率 (MHz)', min: 2400, max: 2500, nameTextStyle: { color: muted, fontSize: 12 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
    yAxis: { type: 'value', name: '功率 (dB)', min: -40, max: 5, nameTextStyle: { color: muted, fontSize: 12 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
    series: [
      { name: '信道 1 (2412MHz)', type: 'line', data: genSpectrum(2412, 22, 500), smooth: true, showSymbol: false, lineStyle: { color: accent, width: 2 }, areaStyle: { color: accent + '15' } },
      { name: '信道 6 (2437MHz)', type: 'line', data: genSpectrum(2437, 22, 500), smooth: true, showSymbol: false, lineStyle: { color: accent2, width: 2 }, areaStyle: { color: accent2 + '15' } },
      { name: '信道 11 (2462MHz)', type: 'line', data: genSpectrum(2462, 22, 500), smooth: true, showSymbol: false, lineStyle: { color: success, width: 2 }, areaStyle: { color: success + '15' } }
    ]
  });
  window.addEventListener('resize', function() { chartSpec.resize(); });

  // ============================================================
  // Chart 3: Constellation Diagram — ENHANCED abnormal
  // ============================================================
  var chartConst = echarts.init(document.getElementById('chart-constellation'), null, { renderer: 'svg' });

  var idealPoints = [], goodPoints = [], badPoints = [];
  var levels = [-7, -5, -3, -1, 1, 3, 5, 7];
  for (var ii = 0; ii < levels.length; ii++) {
    for (var jj = 0; jj < levels.length; jj++) {
      var ix = levels[ii] / 7, iy = levels[jj] / 7;
      idealPoints.push([ix, iy]);
      // Good: tight cluster
      goodPoints.push([ix + (Math.random() - 0.5) * 0.04, iy + (Math.random() - 0.5) * 0.04]);
      // Bad: VERY large scatter + rotation + DC offset
      var angle = (Math.random() - 0.5) * 0.5; // large rotation
      var bx = ix * Math.cos(angle) - iy * Math.sin(angle) + (Math.random() - 0.5) * 0.35 + 0.08;
      var by = ix * Math.sin(angle) + iy * Math.cos(angle) + (Math.random() - 0.5) * 0.35 - 0.05;
      badPoints.push([bx, by]);
    }
  }

  chartConst.setOption({
    animation: false,
    tooltip: { trigger: 'item', appendToBody: true },
    legend: { data: ['理想星座点', '正常信号 (EVM<3%)', '异常信号 (EVM>15%)'], top: 5, textStyle: { color: ink, fontSize: 11 } },
    grid: [
      { left: '8%', right: '55%', top: 50, bottom: 40 },
      { left: '55%', right: '8%', top: 50, bottom: 40 }
    ],
    xAxis: [
      { gridIndex: 0, type: 'value', min: -1.5, max: 1.5, name: 'I (左: 正常)', nameLocation: 'center', nameGap: 25, nameTextStyle: { color: muted, fontSize: 11 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
      { gridIndex: 1, type: 'value', min: -1.5, max: 1.5, name: 'I (右: 异常)', nameLocation: 'center', nameGap: 25, nameTextStyle: { color: muted, fontSize: 11 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } }
    ],
    yAxis: [
      { gridIndex: 0, type: 'value', min: -1.5, max: 1.5, name: 'Q', nameTextStyle: { color: muted, fontSize: 11 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
      { gridIndex: 1, type: 'value', min: -1.5, max: 1.5, name: 'Q', nameTextStyle: { color: muted, fontSize: 11 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } }
    ],
    series: [
      {
        name: '理想星座点', type: 'scatter', xAxisIndex: 0, yAxisIndex: 0,
        data: idealPoints, symbolSize: 10,
        itemStyle: { color: rule, borderColor: muted, borderWidth: 1 }, z: 1
      },
      {
        name: '正常信号 (EVM<3%)', type: 'scatter', xAxisIndex: 0, yAxisIndex: 0,
        data: goodPoints, symbolSize: 6,
        itemStyle: { color: accent, opacity: 0.8 }, z: 2
      },
      {
        name: '异常信号 (EVM>15%)', type: 'scatter', xAxisIndex: 1, yAxisIndex: 1,
        data: badPoints, symbolSize: 7,
        itemStyle: { color: error, opacity: 0.85, borderColor: '#991b1b', borderWidth: 1 }, z: 2
      }
    ]
  });
  window.addEventListener('resize', function() { chartConst.resize(); });

  // ============================================================
  // Chart 3a: Envelope Compare — Normal vs Abnormal
  // ============================================================
  var chartEnvComp = echarts.init(document.getElementById('chart-envelope-compare'), null, { renderer: 'svg' });

  // Normal envelope (flat top, clean edges)
  var envNormal = [], envAbnormal = [];
  for (var t = 0; t <= 50; t += 0.3) {
    var nVal;
    if (t < 2) nVal = t / 2;
    else if (t > 46) nVal = Math.max(0, (50 - t) / 4);
    else nVal = 1.0 + (Math.random() - 0.5) * 0.02;
    envNormal.push([t, nVal]);

    // Abnormal: visible ripple, power droop, slow edges, tail
    var aVal;
    if (t < 3) aVal = t / 3 * 0.65; // slow rise
    else if (t > 44 && t <= 48) aVal = 0.45 + Math.sin(t * 2.5) * 0.18; // heavy ripple zone
    else if (t > 48) aVal = Math.max(0, 0.25 * Math.exp(-(t - 48) * 0.4)); // long tail
    else {
      // Power droop + clearly visible ripple oscillation
      var droop = 1.0 - (t - 3) * 0.012;
      aVal = droop + Math.sin(t * 4.0) * 0.18 + (Math.random() - 0.5) * 0.04;
    }
    envAbnormal.push([t, aVal]);
  }

  // Find actual ripple peak near t=18 for marker placement
  var ripplePeakT = 18, ripplePeakV = 0;
  envAbnormal.forEach(function(p) {
    if (Math.abs(p[0] - 18) < 1 && p[1] > ripplePeakV) { ripplePeakV = p[1]; ripplePeakT = p[0]; }
  });
  // Find droop valley near t=30
  var droopT = 30, droopV = 2;
  envAbnormal.forEach(function(p) {
    if (Math.abs(p[0] - 30) < 1 && p[1] < droopV) { droopV = p[1]; droopT = p[0]; }
  });

  chartEnvComp.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true },
    legend: { data: ['正常包络', '异常包络 (电源纹波+PA非线性)'], top: 5, textStyle: { color: ink, fontSize: 11 } },
    grid: { left: 60, right: 30, top: 45, bottom: 50 },
    xAxis: { type: 'value', name: '时间 (μs)', nameTextStyle: { color: muted, fontSize: 12 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
    yAxis: { type: 'value', name: '幅度', min: 0, max: 1.3, nameTextStyle: { color: muted, fontSize: 12 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
    series: [
      {
        name: '正常包络', type: 'line', data: envNormal, smooth: false,
        lineStyle: { color: success, width: 2.5 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
          { offset: 0, color: success + '25' }, { offset: 1, color: success + '05' }
        ]}},
        showSymbol: false
      },
      {
        name: '异常包络 (电源纹波+PA非线性)', type: 'line', data: envAbnormal, smooth: false,
        lineStyle: { color: error, width: 2.5 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
          { offset: 0, color: error + '25' }, { offset: 1, color: error + '05' }
        ]}},
        showSymbol: false,
        markPoint: {
          symbol: 'pin',
          symbolSize: 50,
          data: [
            { coord: [droopT, droopV - 0.08], value: '跌落', itemStyle: { color: error }, label: { color: '#fff', fontSize: 10, fontWeight: 'bold' } },
            { coord: [ripplePeakT, ripplePeakV + 0.12], value: '纹波', itemStyle: { color: warn }, label: { color: '#fff', fontSize: 10, fontWeight: 'bold' } },
            { coord: [47, 0.55], value: '拖尾', itemStyle: { color: error }, label: { color: '#fff', fontSize: 10, fontWeight: 'bold' } }
          ]
        },
        markArea: {
          silent: true,
          data: [
            [{ xAxis: 14, yAxis: 0, itemStyle: { color: warn + '12' }, label: { show: true, position: 'insideTop', formatter: '纹波区域', color: warn, fontSize: 10, fontWeight: 'bold' }}, { xAxis: 24, yAxis: 1.3 }]
          ]
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chartEnvComp.resize(); });

  // ============================================================
  // Chart 3b: Spectrum Compare — Normal vs Abnormal
  // ============================================================
  var chartSpecComp = echarts.init(document.getElementById('chart-spectrum-compare'), null, { renderer: 'svg' });

  // Normal spectrum
  var specNormal = genSpectrum(2437, 22, 300);
  // Abnormal: frequency offset + wider bandwidth + higher sidelobes
  var specAbnormal = [];
  var start = 2400, end = 2500, step = 100 / 300;
  for (var f = start; f <= end; f += step) {
    var x = (f - 2441) / (28 / 2); // offset by 4MHz, wider bandwidth
    var y = Math.abs(x) < 0.001 ? 1.0 : Math.abs(Math.sin(Math.PI * x) / (Math.PI * x));
    // Add higher sidelobes (less decay)
    var db = 20 * Math.log10(Math.max(y, 0.001)) + 3; // slight boost
    specAbnormal.push([f, db]);
  }

  chartSpecComp.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true },
    legend: { data: ['正常频谱 (中心2437MHz)', '异常频谱 (频偏+4MHz, 展宽)'], top: 5, textStyle: { color: ink, fontSize: 11 } },
    grid: { left: 60, right: 30, top: 45, bottom: 50 },
    xAxis: { type: 'value', name: '频率 (MHz)', min: 2400, max: 2500, nameTextStyle: { color: muted, fontSize: 12 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
    yAxis: { type: 'value', name: '功率 (dB)', min: -40, max: 8, nameTextStyle: { color: muted, fontSize: 12 }, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
    series: [
      {
        name: '正常频谱 (中心2437MHz)', type: 'line', data: specNormal, smooth: true, showSymbol: false,
        lineStyle: { color: accent, width: 2.5 }, areaStyle: { color: accent + '15' },
        markLine: { silent: true, data: [{ xAxis: 2437, label: { formatter: '中心频率', color: accent, fontSize: 10 }, lineStyle: { color: accent, type: 'dashed' } }] }
      },
      {
        name: '异常频谱 (频偏+4MHz, 展宽)', type: 'line', data: specAbnormal, smooth: true, showSymbol: false,
        lineStyle: { color: error, width: 2.5, type: 'dashed' }, areaStyle: { color: error + '10' },
        markLine: { silent: true, data: [{ xAxis: 2441, label: { formatter: '偏移中心', color: error, fontSize: 10 }, lineStyle: { color: error, type: 'dashed' } }] }
      }
    ]
  });
  window.addEventListener('resize', function() { chartSpecComp.resize(); });

  // ============================================================
  // Chart 4: RSSI vs Throughput
  // ============================================================
  var chartRssi = echarts.init(document.getElementById('chart-rssi'), null, { renderer: 'svg' });

  var rssiData = [], throughputData = [];
  for (var r = -90; r <= -30; r += 2) {
    rssiData.push(r);
    var tp;
    if (r >= -50) tp = 50 + Math.random() * 5;
    else if (r >= -65) tp = 30 + (r + 65) / 15 * 20 + Math.random() * 3;
    else if (r >= -75) tp = 10 + (r + 75) / 10 * 20 + Math.random() * 2;
    else if (r >= -85) tp = Math.max(0, (r + 85) / 10 * 10 + Math.random() * 2);
    else tp = Math.random() * 1;
    throughputData.push(Math.round(tp * 10) / 10);
  }

  chartRssi.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true },
    legend: { data: ['吞吐量 (TCP)'], top: 5, textStyle: { color: ink, fontSize: 11 } },
    grid: { left: 60, right: 60, top: 50, bottom: 50 },
    xAxis: { type: 'category', data: rssiData.map(function(r) { return r + ''; }), name: 'RSSI (dBm)', nameTextStyle: { color: muted, fontSize: 12 }, nameLocation: 'center', nameGap: 35, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, interval: 4, formatter: function(v) { return v + 'dBm'; } }, splitLine: { show: false } },
    yAxis: [{ type: 'value', name: '吞吐量 (Mbps)', nameTextStyle: { color: muted, fontSize: 12 }, min: 0, max: 60, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } }],
    visualMap: { show: false, pieces: [{ lte: 10, color: success }, { gt: 10, lte: 22, color: accent }, { gt: 22, lte: 35, color: warn }, { gt: 35, color: error }], seriesIndex: 0 },
    series: [{
      name: '吞吐量 (TCP)', type: 'line',
      data: rssiData.map(function(r, i) { return [i, throughputData[i]]; }),
      smooth: true, lineStyle: { width: 3 },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
        { offset: 0, color: accent + '30' }, { offset: 1, color: accent + '05' }
      ]}},
      showSymbol: false,
      markLine: { silent: true, data: [
        { xAxis: 10, label: { formatter: '-70dBm', color: warn, fontSize: 10 }, lineStyle: { color: warn, type: 'dashed' } },
        { xAxis: 22, label: { formatter: '-50dBm', color: success, fontSize: 10 }, lineStyle: { color: success, type: 'dashed' } }
      ]}
    }]
  });
  window.addEventListener('resize', function() { chartRssi.resize(); });

  // ============================================================
  // Chart 5: Power Consumption by Mode
  // ============================================================
  var chartPower = echarts.init(document.getElementById('chart-power'), null, { renderer: 'svg' });

  var modes = ['Active TX', 'Active RX', 'Modem Sleep', 'Light Sleep', 'Deep Sleep', 'Power Down'];
  var currents = [350, 120, 15, 1.5, 0.015, 0.008];
  var colors = [error, warn, accent, accent2, success, muted];

  chartPower.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var v = params[0].value;
        var display = v >= 1 ? v.toFixed(0) + ' mA' : (v * 1000).toFixed(0) + ' uA';
        return params[0].name + '<br>电流: ' + display;
      }
    },
    grid: { left: 120, right: 60, top: 30, bottom: 40 },
    xAxis: { type: 'log', name: '电流 (mA)', nameTextStyle: { color: muted, fontSize: 12 }, min: 0.005, max: 1000, axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, formatter: function(v) { return v >= 1 ? v + 'mA' : (v * 1000).toFixed(0) + 'uA'; } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    yAxis: { type: 'category', data: modes.slice().reverse(), axisLine: { lineStyle: { color: rule } }, axisLabel: { color: ink, fontSize: 12, fontWeight: 600 }, splitLine: { show: false } },
    series: [{
      type: 'bar',
      data: currents.slice().reverse().map(function(v, i) {
        return { value: v, itemStyle: { color: colors.slice().reverse()[i], borderRadius: [0, 4, 4, 0] } };
      }),
      barWidth: 24,
      label: { show: true, position: 'right',
        formatter: function(p) { var v = p.value; return v >= 1 ? v.toFixed(0) + ' mA' : (v * 1000).toFixed(0) + ' uA'; },
        color: ink, fontSize: 11, fontWeight: 600
      }
    }]
  });
  window.addEventListener('resize', function() { chartPower.resize(); });

})();
