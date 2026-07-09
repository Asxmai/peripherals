(function() {
  function initCharts() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var danger = style.getPropertyValue('--danger').trim();
  var success = style.getPropertyValue('--success').trim();
  var warning = style.getPropertyValue('--warning').trim();

  // ========== Chart 1: Current Consumption Comparison ==========
  var chartCurrent = echarts.init(document.getElementById('chart-current'), null, { renderer: 'svg' });
  chartCurrent.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var d = params[0];
        var v = d.value;
        var label;
        if (v >= 1000) label = (v/1000).toFixed(1) + ' mA';
        else if (v >= 1) label = v.toFixed(0) + ' µA';
        else label = (v*1000).toFixed(0) + ' nA';
        return '<strong>' + d.name.replace(/\n/g, ' ') + '</strong><br/>' + label;
      }
    },
    grid: {
      left: '3%', right: '6%', bottom: '8%', top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Run\n(80MHz)', 'Sleep\n(80MHz)', 'LP Run\n(100kHz)', 'LP Sleep', 'Stop 1', 'Stop 2', 'Standby\n(RTC ON)', 'Standby\n(RTC OFF)', 'Shutdown'],
      axisLabel: {
        fontSize: 11,
        color: ink,
        interval: 0,
        lineHeight: 16
      },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'log',
      name: '电流 (µA)',
      nameTextStyle: { color: muted, fontSize: 11, padding: [0, 0, 0, 40] },
      min: 0.05,
      axisLabel: {
        color: muted,
        fontSize: 10,
        formatter: function(v) {
          if (v >= 1000) return (v/1000).toFixed(0) + ' mA';
          if (v >= 1) return v.toFixed(0) + ' µA';
          return (v*1000).toFixed(0) + ' nA';
        }
      },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [{
      name: '典型电流',
      type: 'bar',
      barWidth: '50%',
      data: [
        { value: 8000, itemStyle: { color: accent } },
        { value: 2960, itemStyle: { color: accent } },
        { value: 42, itemStyle: { color: accent2 } },
        { value: 33, itemStyle: { color: accent2 } },
        { value: 6, itemStyle: { color: success } },
        { value: 4, itemStyle: { color: success } },
        { value: 1, itemStyle: { color: warning } },
        { value: 0.05, itemStyle: { color: warning } },
        { value: 0.064, itemStyle: { color: danger } }
      ],
      label: {
        show: true,
        position: 'top',
        fontSize: 10,
        color: ink,
        formatter: function(p) {
          var v = p.value;
          if (v >= 1000) return (v/1000).toFixed(1) + ' mA';
          if (v >= 1) return v.toFixed(0) + ' µA';
          return (v*1000).toFixed(0) + ' nA';
        }
      },
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      }
    }]
  });
  window.addEventListener('resize', function() { chartCurrent.resize(); });

  // ========== Chart 2: Power-up Waveform Comparison ==========
  var chartPowerup = echarts.init(document.getElementById('chart-powerup'), null, { renderer: 'svg' });

  // Generate data using value axis (x = time in µs)
  var normalData = [];
  var abnormalData = [];
  var resetData = [];

  for (var i = 0; i <= 200; i++) {
    var t = i * 0.5; // 0 to 100 µs

    // Normal: smooth monotonic rise
    var vNormal = 3.3 * (1 - Math.exp(-t / 25));
    normalData.push([t, parseFloat(vNormal.toFixed(3))]);

    // Abnormal: dip during rise
    var vAbnormal = 3.3 * (1 - Math.exp(-t / 25));
    if (t > 35 && t < 60) {
      vAbnormal -= 1.2 * Math.exp(-Math.pow((t - 47) / 6, 2));
    }
    if (vAbnormal < 0) vAbnormal = 0;
    abnormalData.push([t, parseFloat(vAbnormal.toFixed(3))]);

    // Looping reset: sawtooth
    var cycle = t % 25;
    var vReset;
    if (cycle < 12) {
      vReset = 3.3 * (1 - Math.exp(-cycle / 5));
    } else {
      vReset = 3.3 * Math.exp(-(cycle - 12) / 3);
    }
    resetData.push([t, parseFloat(vReset.toFixed(3))]);
  }

  chartPowerup.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var s = '时间: ' + params[0].value[0].toFixed(1) + ' µs<br/>';
        params.forEach(function(p) {
          s += '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:4px;"></span>';
          s += p.seriesName + ': ' + p.value[1].toFixed(2) + ' V<br/>';
        });
        return s;
      }
    },
    legend: {
      data: ['正常上电', '非单调上升', '循环复位'],
      top: 5,
      textStyle: { color: ink, fontSize: 12 },
      itemWidth: 25,
      itemHeight: 3
    },
    grid: {
      left: '3%', right: '4%', bottom: '12%', top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '时间 (µs)',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: { color: muted, fontSize: 11 },
      min: 0,
      max: 100,
      axisLabel: { color: muted, fontSize: 10 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '电压 (V)',
      nameTextStyle: { color: muted, fontSize: 11 },
      min: 0,
      max: 4,
      axisLabel: { color: muted, fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [
      {
        name: '正常上电',
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 3, color: success },
        data: normalData,
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#059669', type: 'dashed', width: 1, opacity: 0.5 },
          label: { show: true, position: 'insideEndTop', fontSize: 9, color: success },
          data: [
            { yAxis: 3.3, label: { formatter: 'VDD = 3.3V' } }
          ]
        }
      },
      {
        name: '非单调上升',
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 2.5, color: danger, type: 'dashed' },
        data: abnormalData,
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: { color: danger },
          label: { show: true, formatter: '凹陷', fontSize: 9, color: danger, position: 'bottom' },
          data: [
            { coord: [47, 1.6] }
          ]
        }
      },
      {
        name: '循环复位',
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 2, color: warning, type: 'dotted' },
        data: resetData,
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: warning, type: 'dashed', width: 1, opacity: 0.5 },
          label: { show: true, position: 'insideEndTop', fontSize: 9, color: warning },
          data: [
            { yAxis: 2.0, label: { formatter: 'BOR 阈值 ~2.0V' } }
          ]
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chartPowerup.resize(); });

  // ========== Chart 3: Transient Response ==========
  var chartTransient = echarts.init(document.getElementById('chart-transient'), null, { renderer: 'svg' });

  var voltageData = [];
  var currentData = [];

  for (var i = 0; i <= 300; i++) {
    var t = i * 0.33; // 0 to ~100 µs

    // Current waveform: step increase at t=30µs, step decrease at t=70µs
    var current;
    if (t < 30) current = 5;
    else if (t < 70) current = 25;
    else current = 5;

    // Voltage response
    var vBase = 3.3;
    var v;
    if (t >= 29 && t < 32) {
      v = vBase - 0.4 * Math.exp(-(t - 29) / 1.5) * Math.sin((t - 29) * 2);
    } else if (t >= 32 && t < 38) {
      v = vBase - 0.15 * Math.exp(-(t - 32) / 2);
    } else if (t >= 69 && t < 72) {
      v = vBase + 0.3 * Math.exp(-(t - 69) / 1.5) * Math.sin((t - 69) * 2);
    } else if (t >= 72 && t < 78) {
      v = vBase + 0.1 * Math.exp(-(t - 72) / 2);
    } else {
      v = vBase;
    }
    voltageData.push([parseFloat(t.toFixed(1)), parseFloat(v.toFixed(3))]);
    currentData.push([parseFloat(t.toFixed(1)), current]);
  }

  chartTransient.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var s = '时间: ' + params[0].value[0].toFixed(1) + ' µs<br/>';
        params.forEach(function(p) {
          var unit = p.seriesIndex === 0 ? ' V' : ' mA';
          s += '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:4px;"></span>';
          s += p.seriesName + ': ' + p.value[1].toFixed(2) + unit + '<br/>';
        });
        return s;
      }
    },
    legend: {
      data: ['VDD 电压', '负载电流'],
      top: 5,
      textStyle: { color: ink, fontSize: 12 },
      itemWidth: 25,
      itemHeight: 3
    },
    grid: {
      left: '3%', right: '4%', bottom: '12%', top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '时间 (µs)',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: { color: muted, fontSize: 11 },
      min: 0,
      max: 100,
      axisLabel: { color: muted, fontSize: 10 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '电压 (V)',
        nameTextStyle: { color: muted, fontSize: 11 },
        min: 2.5,
        max: 4.0,
        axisLabel: { color: muted, fontSize: 10 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      {
        type: 'value',
        name: '电流 (mA)',
        nameTextStyle: { color: muted, fontSize: 11 },
        min: 0,
        max: 35,
        axisLabel: { color: muted, fontSize: 10 },
        axisLine: { show: false },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'VDD 电压',
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 2.5, color: accent },
        data: voltageData,
        markArea: {
          silent: true,
          itemStyle: { color: danger, opacity: 0.06 },
          label: { show: true, fontSize: 9, color: danger, position: 'insideTop' },
          data: [
            [{ xAxis: 29.7, name: '电压凹陷' }, { xAxis: 38.0 }],
            [{ xAxis: 69.0, name: '电压过冲' }, { xAxis: 78.0 }]
          ]
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: success, type: 'dashed', width: 1, opacity: 0.4 },
          label: { show: true, position: 'insideEndTop', fontSize: 9, color: success },
          data: [
            { yAxis: 3.3, label: { formatter: 'VDD = 3.3V' } }
          ]
        }
      },
      {
        name: '负载电流',
        type: 'line',
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: { width: 2, color: accent2, type: 'dashed' },
        areaStyle: { color: accent2, opacity: 0.08 },
        data: currentData,
        step: 'middle'
      }
    ]
  });
  window.addEventListener('resize', function() { chartTransient.resize(); });
  }

  if (document.readyState === 'complete') {
    requestAnimationFrame(initCharts);
  } else {
    window.addEventListener('load', function() {
      requestAnimationFrame(initCharts);
    });
  }
})();
