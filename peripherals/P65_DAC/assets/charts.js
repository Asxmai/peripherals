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

  // --- Chart: Waveforms comparison ---
  var waveEl = document.getElementById('chart-waveforms');
  if (waveEl) {
    var waveChart = echarts.init(waveEl, null, { renderer: 'svg' });
    var N = 200;
    var xData = [];
    var sineData = [];
    var triData = [];
    var sawData = [];
    for (var i = 0; i < N; i++) {
      xData.push(i);
      sineData.push(+(2047 + 2047 * Math.sin(2 * Math.PI * i / N)).toFixed(1));
      // Triangle
      var triPhase = (i % N) / N;
      var triVal = triPhase < 0.5 ? (triPhase * 2 * 4095) : ((1 - triPhase) * 2 * 4095);
      triData.push(+triVal.toFixed(1));
      // Sawtooth
      sawData.push(+(i / N * 4095).toFixed(1));
    }
    waveChart.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: { data: ['正弦波', '三角波', '锯齿波'], top: 10, textStyle: { color: ink } },
      grid: { left: 70, right: 30, top: 50, bottom: 40 },
      xAxis: {
        type: 'category', data: xData, name: '采样点',
        nameTextStyle: { color: muted },
        axisLabel: { color: muted, interval: 49 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value', name: 'DAC 值', min: 0, max: 4095,
        nameTextStyle: { color: muted },
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '正弦波', type: 'line', data: sineData, smooth: false, symbol: 'none',
          lineStyle: { width: 2.5, color: accent }
        },
        {
          name: '三角波', type: 'line', data: triData, smooth: false, symbol: 'none',
          lineStyle: { width: 2, color: accent2 }
        },
        {
          name: '锯齿波', type: 'line', data: sawData, smooth: false, symbol: 'none',
          lineStyle: { width: 2, color: warn }
        }
      ]
    });
    window.addEventListener('resize', function() { waveChart.resize(); });
  }

  // --- Chart: Abnormal waveforms ---
  var abnEl = document.getElementById('chart-abnormal');
  if (abnEl) {
    var abnChart = echarts.init(abnEl, null, { renderer: 'svg' });
    var N2 = 120;
    var xData2 = [];
    var normalSine = [];
    var clippedSine = [];
    var noisySine = [];
    var glitchedSine = [];
    var steppedSine = [];
    for (var j = 0; j < N2; j++) {
      xData2.push(j);
      var base = 2047 + 1800 * Math.sin(2 * Math.PI * j / N2);
      normalSine.push(+base.toFixed(1));

      // Clipped
      var clipped = Math.max(500, Math.min(3600, base));
      clippedSine.push(+clipped.toFixed(1));

      // Noisy
      var noise = (Math.random() - 0.5) * 400;
      noisySine.push(+(base + noise).toFixed(1));

      // Glitched
      var glitch = base;
      if (j === 30 || j === 75 || j === 105) glitch = base + 1500;
      if (j === 31 || j === 76 || j === 106) glitch = base - 800;
      glitchedSine.push(+glitch.toFixed(1));

      // Stepped (lower resolution)
      var stepped = Math.round(base / 512) * 512;
      steppedSine.push(+stepped.toFixed(1));
    }
    abnChart.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: {
        data: ['正常波形', '削顶饱和', '叠加噪声', '毛刺尖峰', '阶梯效应'],
        top: 5, textStyle: { color: ink, fontSize: 11 }
      },
      grid: [
        { left: 70, right: '52%', top: 50, height: '35%' },
        { left: '55%', right: 30, top: 50, height: '35%' },
        { left: 70, right: '52%', top: '58%', height: '35%' }
      ],
      xAxis: [
        { type: 'category', data: xData2, gridIndex: 0, axisLabel: { show: false }, axisLine: { lineStyle: { color: rule } }, name: '正常 vs 削顶', nameTextStyle: { color: muted, fontSize: 11 }, nameLocation: 'start' },
        { type: 'category', data: xData2, gridIndex: 1, axisLabel: { show: false }, axisLine: { lineStyle: { color: rule } }, name: '正常 vs 噪声', nameTextStyle: { color: muted, fontSize: 11 }, nameLocation: 'start' },
        { type: 'category', data: xData2, gridIndex: 2, axisLabel: { color: muted, interval: 29 }, axisLine: { lineStyle: { color: rule } }, name: '正常 vs 毛刺 / 阶梯', nameTextStyle: { color: muted, fontSize: 11 }, nameLocation: 'start' }
      ],
      yAxis: [
        { type: 'value', gridIndex: 0, min: 0, max: 4095, axisLabel: { color: muted, fontSize: 10 }, splitLine: { lineStyle: { color: rule, type: 'dashed' } }, axisLine: { lineStyle: { color: rule } } },
        { type: 'value', gridIndex: 1, min: 0, max: 4095, axisLabel: { color: muted, fontSize: 10 }, splitLine: { lineStyle: { color: rule, type: 'dashed' } }, axisLine: { lineStyle: { color: rule } } },
        { type: 'value', gridIndex: 2, min: 0, max: 4095, axisLabel: { color: muted, fontSize: 10 }, splitLine: { lineStyle: { color: rule, type: 'dashed' } }, axisLine: { lineStyle: { color: rule } } }
      ],
      series: [
        {
          name: '正常波形', type: 'line', data: normalSine, symbol: 'none', xAxisIndex: 0, yAxisIndex: 0,
          lineStyle: { width: 2, color: accent }
        },
        {
          name: '削顶饱和', type: 'line', data: clippedSine, symbol: 'none', xAxisIndex: 0, yAxisIndex: 0,
          lineStyle: { width: 2, color: error, type: 'dashed' }
        },
        {
          name: '叠加噪声', type: 'line', data: noisySine, symbol: 'none', xAxisIndex: 1, yAxisIndex: 1,
          lineStyle: { width: 1.5, color: warn }
        },
        {
          name: '毛刺尖峰', type: 'line', data: glitchedSine, symbol: 'none', xAxisIndex: 2, yAxisIndex: 2,
          lineStyle: { width: 2, color: error }
        },
        {
          name: '阶梯效应', type: 'line', data: steppedSine, symbol: 'none', xAxisIndex: 2, yAxisIndex: 2,
          lineStyle: { width: 2, color: accent2, type: 'dotted' },
          step: 'end'
        }
      ]
    });
    window.addEventListener('resize', function() { abnChart.resize(); });
  }

  // --- Chart: SNR comparison ---
  var snrEl = document.getElementById('chart-snr');
  if (snrEl) {
    var snrChart = echarts.init(snrEl, null, { renderer: 'svg' });
    var bits = [8, 10, 12, 14, 16, 18, 20, 24];
    var snrValues = bits.map(function(b) { return +(6.02 * b + 1.76).toFixed(1); });
    snrChart.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true, formatter: function(p) { return p[0].name + '-bit DAC<br/>SNR = ' + p[0].value + ' dB'; } },
      grid: { left: 70, right: 40, top: 30, bottom: 50 },
      xAxis: {
        type: 'category', data: bits.map(function(b) { return b + '-bit'; }),
        axisLabel: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: 'value', name: 'SNR (dB)', min: 40,
        nameTextStyle: { color: muted },
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [{
        type: 'bar', data: snrValues, barWidth: '50%',
        itemStyle: {
          color: function(params) {
            var colors = [accent + '66', accent + '77', accent + '88', accent + '99', accent + 'aa', accent + 'bb', accent + 'cc', accent];
            return colors[params.dataIndex] || accent;
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true, position: 'top', color: ink, fontSize: 11,
          formatter: '{c} dB'
        }
      }]
    });
    window.addEventListener('resize', function() { snrChart.resize(); });
  }
})();
