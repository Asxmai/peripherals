// assets/charts.js
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var warn = style.getPropertyValue('--warn').trim();
  var danger = style.getPropertyValue('--danger').trim();

  // ========== Chart 1: Sampling Process ==========
  var chartSampling = echarts.init(document.getElementById('chart-sampling'), null, { renderer: 'svg' });
  (function() {
    var N = 500;
    var fSignal = 2;
    var sampleRate = 15; // samples per second
    var analogX = [], analogY = [];
    var samplePoints = [];

    for (var i = 0; i < N; i++) {
      var t = i / N * 3;
      analogX.push(+t.toFixed(4));
      analogY.push(+(Math.sin(2 * Math.PI * fSignal * t) * 0.8).toFixed(4));
    }

    var sampleInterval = N / (sampleRate * 3);
    for (var i = 0; i < N; i += Math.floor(sampleInterval)) {
      var t = i / N * 3;
      var v = +(Math.sin(2 * Math.PI * fSignal * t) * 0.8).toFixed(4);
      samplePoints.push([+t.toFixed(4), v]);
    }

    chartSampling.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: { data: ['模拟信号 (连续)', '采样点 (离散)'], top: 5, textStyle: { color: ink, fontSize: 12 } },
      grid: { left: 65, right: 30, top: 50, bottom: 50 },
      xAxis: {
        type: 'value', name: '时间 (s)', nameLocation: 'middle', nameGap: 32,
        nameTextStyle: { color: muted, fontSize: 12 },
        min: 0, max: 3,
        axisLabel: { color: muted, formatter: '{value}' },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value', name: '电压 (V)', nameLocation: 'middle', nameGap: 45,
        nameTextStyle: { color: muted, fontSize: 12 },
        min: -1.2, max: 1.2,
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '模拟信号 (连续)', type: 'line', data: analogX.map(function(x, i) { return [x, analogY[i]]; }),
          smooth: true, symbol: 'none',
          lineStyle: { color: accent, width: 2.5 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: accent + '18' }, { offset: 1, color: accent + '02' }] } }
        },
        {
          name: '采样点 (离散)', type: 'scatter',
          data: samplePoints,
          symbolSize: 12, symbol: 'circle',
          itemStyle: { color: danger, borderColor: '#fff', borderWidth: 2 },
          z: 10
        },
        {
          name: '采样保持', type: 'line',
          data: samplePoints,
          step: 'end', symbol: 'none',
          lineStyle: { color: danger, width: 1, type: 'dotted' },
          z: 5
        }
      ]
    });
    window.addEventListener('resize', function() { chartSampling.resize(); });
  })();

  // ========== Chart 2: Quantization Comparison ==========
  var chartQuant = echarts.init(document.getElementById('chart-quantization'), null, { renderer: 'svg' });
  (function() {
    var N = 120;
    var original = [], q8 = [], q4 = [], q2 = [], xData = [];
    for (var i = 0; i < N; i++) {
      var t = i / N * 4 * Math.PI;
      var v = Math.sin(t);
      xData.push(i);
      original.push(+v.toFixed(4));
      q8.push(+(Math.round(v * 3.5) / 3.5).toFixed(4));
      q4.push(+(Math.round(v * 1.5) / 1.5).toFixed(4));
      q2.push(+(v >= 0 ? 0.5 : -0.5).toFixed(4));
    }
    chartQuant.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: {
        data: ['原始信号 (连续)', '3-bit 量化 (8级)', '2-bit 量化 (4级)', '1-bit 量化 (2级)'],
        top: 5, textStyle: { color: ink, fontSize: 11 },
        itemGap: 20
      },
      grid: { left: 65, right: 30, top: 55, bottom: 50 },
      xAxis: {
        type: 'category', data: xData,
        name: '采样序号', nameLocation: 'middle', nameGap: 32,
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLabel: { color: muted, interval: 19 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value', name: '幅值',
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        min: -1.3, max: 1.3
      },
      series: [
        {
          name: '原始信号 (连续)', type: 'line', data: original,
          smooth: true, symbol: 'none',
          lineStyle: { color: ink, width: 2.5 },
          z: 10
        },
        {
          name: '3-bit 量化 (8级)', type: 'line', data: q8,
          step: 'middle', symbol: 'none',
          lineStyle: { color: accent, width: 2 },
          z: 5
        },
        {
          name: '2-bit 量化 (4级)', type: 'line', data: q4,
          step: 'middle', symbol: 'none',
          lineStyle: { color: accent2, width: 2 },
          z: 3
        },
        {
          name: '1-bit 量化 (2级)', type: 'line', data: q2,
          step: 'middle', symbol: 'none',
          lineStyle: { color: warn, width: 2, type: 'dashed' },
          z: 1
        }
      ]
    });
    window.addEventListener('resize', function() { chartQuant.resize(); });
  })();

  // ========== Chart 3: FFT Spectrum ==========
  var chartFFT = echarts.init(document.getElementById('chart-fft'), null, { renderer: 'svg' });
  (function() {
    var N = 256;
    var freqBins = [], signalMag = [], noiseMag = [];
    var signalFreq = 10;

    for (var i = 0; i < N / 2; i++) {
      freqBins.push(i);
      var mag = 0;
      if (i === signalFreq) mag = 100;
      else if (i === signalFreq * 2) mag = 12;
      else if (i === signalFreq * 3) mag = 5;
      else mag = +(Math.random() * 2.5 + 0.3).toFixed(2);
      signalMag.push(+mag.toFixed(2));
      noiseMag.push(i === signalFreq ? 0 : +(Math.random() * 2.5 + 0.3).toFixed(2));
    }

    chartFFT.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: { data: ['信号频谱', '噪声基底'], top: 5, textStyle: { color: ink, fontSize: 12 } },
      grid: { left: 65, right: 30, top: 50, bottom: 50 },
      xAxis: {
        type: 'category', data: freqBins,
        name: '频率 Bin (Bin 10 = 1kHz 基波)', nameLocation: 'middle', nameGap: 32,
        nameTextStyle: { color: muted, fontSize: 11 },
        axisLabel: { color: muted, interval: 15 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value', name: '幅度 (dB)',
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '信号频谱', type: 'bar', data: signalMag.map(function(v, i) {
            return {
              value: v,
              itemStyle: {
                color: i === signalFreq ? accent : (i === signalFreq * 2 ? accent2 : (i === signalFreq * 3 ? warn : rule))
              }
            };
          }),
          barWidth: '55%'
        },
        {
          name: '噪声基底', type: 'line', data: noiseMag,
          symbol: 'none', lineStyle: { color: danger + '88', width: 1.5, type: 'dashed' },
          markLine: {
            silent: true, symbol: 'none',
            lineStyle: { color: danger, type: 'solid', width: 1 },
            data: [{ yAxis: 3, label: { formatter: '噪声基底 ≈ 3dB', color: danger, fontSize: 10, position: 'insideEndTop' } }]
          }
        }
      ]
    });
    window.addEventListener('resize', function() { chartFFT.resize(); });
  })();

  // ========== Chart 4: Anomaly Waveforms ==========
  var chartAnomaly = echarts.init(document.getElementById('chart-anomaly'), null, { renderer: 'svg' });
  (function() {
    var N = 150;
    var xData = [];
    for (var i = 0; i < N; i++) xData.push(i);

    var normalNoise = xData.map(function(i) {
      var t = i / N * 4 * Math.PI;
      return +(Math.sin(t) + (Math.random() - 0.5) * 0.15).toFixed(3);
    });

    var periodic = xData.map(function(i) {
      var t = i / N * 4 * Math.PI;
      return +(Math.sin(t) + 0.35 * Math.sin(t * 6.5)).toFixed(3);
    });

    var aliasing = xData.map(function(i) {
      var t = i / N * 4 * Math.PI;
      return +(Math.sin(t * 0.7) + 0.25 * Math.sin(t * 3.1)).toFixed(3);
    });

    var codeJumps = xData.map(function(i) {
      var t = i / N * 4 * Math.PI;
      var v = Math.sin(t);
      if (i === 40 || i === 85 || i === 120) v += (Math.random() > 0.5 ? 1.2 : -1.2);
      return +(v + (Math.random() - 0.5) * 0.05).toFixed(3);
    });

    var dcOffset = xData.map(function(i) {
      var t = i / N * 4 * Math.PI;
      return +(Math.sin(t) + 0.6).toFixed(3);
    });

    var saturation = xData.map(function(i) {
      var t = i / N * 4 * Math.PI;
      var v = Math.sin(t) * 1.5;
      return +Math.max(-1, Math.min(1, v)).toFixed(3);
    });

    var labels = ['① 高频随机噪声', '② 周期性干扰 (50Hz纹波)', '③ 混叠 (Aliasing)', '④ 码值跳变 / 丢码', '⑤ 直流偏移', '⑥ 信号饱和 (削顶)'];
    var datasets = [normalNoise, periodic, aliasing, codeJumps, dcOffset, saturation];
    var colors = [accent, warn, danger, '#8B5CF6', accent2, '#EC4899'];

    var grids = [], xAxes = [], yAxes = [], series = [];
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 2; c++) {
        var idx = r * 2 + c;
        var leftPct = c === 0 ? 10 : 57;
        var topPct = r * 32 + 12;
        grids.push({ left: leftPct + '%', top: topPct + '%', width: '36%', height: '22%' });
        xAxes.push({
          type: 'category', gridIndex: idx, data: xData,
          axisLabel: { show: false }, axisTick: { show: false },
          axisLine: { lineStyle: { color: rule } },
          splitLine: { show: false }
        });
        yAxes.push({
          type: 'value', gridIndex: idx,
          axisLabel: { show: false },
          axisLine: { lineStyle: { color: rule } },
          splitLine: { lineStyle: { color: rule, type: 'dashed' } },
          min: -2, max: 2
        });

        var s = {
          name: labels[idx], type: 'line', data: datasets[idx],
          xAxisIndex: idx, yAxisIndex: idx,
          symbol: 'none', lineStyle: { color: colors[idx], width: 1.5 },
          markLine: undefined
        };

        if (idx === 4) {
          s.markLine = {
            silent: true, symbol: 'none',
            lineStyle: { color: danger, type: 'dashed', width: 1 },
            data: [{ yAxis: 0.6, label: { formatter: '偏移 +0.6', color: danger, fontSize: 9 } }]
          };
        } else if (idx === 5) {
          s.markLine = {
            silent: true, symbol: 'none',
            lineStyle: { color: danger, type: 'dashed', width: 1 },
            data: [
              { yAxis: 1, label: { formatter: '削顶', color: danger, fontSize: 9 } },
              { yAxis: -1, label: { formatter: '削底', color: danger, fontSize: 9 } }
            ]
          };
        }
        series.push(s);
      }
    }

    chartAnomaly.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      title: labels.map(function(l, i) {
        var r = Math.floor(i / 2), c = i % 2;
        return {
          text: l,
          left: c === 0 ? '10%' : '57%',
          top: (r * 32 + 7) + '%',
          textStyle: { color: colors[i], fontSize: 12, fontWeight: 600 }
        };
      }),
      grid: grids,
      xAxis: xAxes,
      yAxis: yAxes,
      series: series
    });
    window.addEventListener('resize', function() { chartAnomaly.resize(); });
  })();

  // ========== Chart 5: DMA Multi-Channel Timing ==========
  var chartDMA = echarts.init(document.getElementById('chart-dma-timing'), null, { renderer: 'svg' });
  (function() {
    var categories = ['TIM 触发信号', 'CH0 采样转换', 'CH1 采样转换', 'CH2 采样转换', 'DMA 数据搬运', 'CPU 空闲/处理'];
    var colors = [accent, accent2, '#8B5CF6', warn, '#EC4899', ink];
    var data = [];
    var cycleTime = 100;

    for (var cycle = 0; cycle < 4; cycle++) {
      var base = cycle * cycleTime;
      data.push({ name: categories[0], value: [0, base, base + 5, colors[0]] });
      data.push({ name: categories[1], value: [1, base + 8, base + 25, colors[1]] });
      data.push({ name: categories[2], value: [2, base + 28, base + 45, colors[2]] });
      data.push({ name: categories[3], value: [3, base + 48, base + 65, colors[3]] });
      data.push({ name: categories[4], value: [4, base + 68, base + 78, colors[4]] });
      data.push({ name: categories[5], value: [5, base + 80, base + 95, colors[5]] });
    }

    function renderItem(params, api) {
      var catIdx = api.value(0);
      var start = api.coord([api.value(1), catIdx]);
      var end = api.coord([api.value(2), catIdx]);
      var height = api.size([0, 1])[1] * 0.5;
      return {
        type: 'rect',
        shape: { x: start[0], y: start[1] - height / 2, width: end[0] - start[0], height: height, r: 3 },
        style: { fill: api.value(3), opacity: 0.85 },
        styleEmphasis: { opacity: 1 }
      };
    }

    chartDMA.setOption({
      animation: false,
      tooltip: {
        appendToBody: true,
        formatter: function(p) {
          return p.name + '<br/>起始: ' + p.value[1] + '  结束: ' + p.value[2] + '  耗时: ' + (p.value[2] - p.value[1]);
        }
      },
      grid: { left: 140, right: 30, top: 20, bottom: 45 },
      xAxis: {
        type: 'value', name: '时间 →', nameLocation: 'middle', nameGap: 28,
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      yAxis: {
        type: 'category', data: categories, inverse: true,
        axisLabel: { color: ink, fontSize: 12, width: 130, overflow: 'break' },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        splitLine: { show: false }
      },
      series: [{
        type: 'custom',
        renderItem: renderItem,
        encode: { x: [1, 2], y: 0 },
        data: data.map(function(d) { return { name: d.name, value: d.value }; })
      }]
    });
    window.addEventListener('resize', function() { chartDMA.resize(); });
  })();

  // ========== Chart 6: Filter Comparison ==========
  var chartFilter = echarts.init(document.getElementById('chart-filter'), null, { renderer: 'svg' });
  (function() {
    var N = 200;
    var xData = [];
    var clean = [], noisy = [], iir = [], avg = [], median = [];

    for (var i = 0; i < N; i++) {
      var t = i / N * 6 * Math.PI;
      xData.push(i);
      clean.push(+Math.sin(t).toFixed(4));
      noisy.push(+(Math.sin(t) + (Math.random() - 0.5) * 0.6).toFixed(4));
    }

    var iirOut = noisy[0];
    for (var i = 0; i < N; i++) {
      iirOut = 0.1 * noisy[i] + 0.9 * iirOut;
      iir.push(+iirOut.toFixed(4));
    }

    for (var i = 0; i < N; i++) {
      var sum = 0, cnt = 0;
      for (var j = Math.max(0, i - 5); j <= Math.min(N - 1, i + 5); j++) {
        sum += noisy[j]; cnt++;
      }
      avg.push(+(sum / cnt).toFixed(4));
    }

    for (var i = 0; i < N; i++) {
      var winArr = [];
      for (var j = Math.max(0, i - 3); j <= Math.min(N - 1, i + 3); j++) {
        winArr.push(noisy[j]);
      }
      winArr.sort(function(a, b) { return a - b; });
      median.push(+winArr[Math.floor(winArr.length / 2)].toFixed(4));
    }

    chartFilter.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: {
        data: ['原始信号', '含噪信号', 'IIR低通', '滑动平均', '中值滤波'],
        top: 5, textStyle: { color: ink, fontSize: 11 },
        itemGap: 18
      },
      grid: { left: 65, right: 30, top: 55, bottom: 50 },
      xAxis: {
        type: 'category', data: xData,
        name: '采样序号', nameLocation: 'middle', nameGap: 32,
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLabel: { color: muted, interval: 39 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value', name: '幅值',
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        { name: '原始信号', type: 'line', data: clean, symbol: 'none', lineStyle: { color: ink, width: 2.5, type: 'dashed' }, z: 1 },
        { name: '含噪信号', type: 'line', data: noisy, symbol: 'none', lineStyle: { color: rule, width: 1 }, z: 0 },
        { name: 'IIR低通', type: 'line', data: iir, symbol: 'none', lineStyle: { color: accent, width: 2.5 }, z: 2 },
        { name: '滑动平均', type: 'line', data: avg, symbol: 'none', lineStyle: { color: accent2, width: 2.5 }, z: 2 },
        { name: '中值滤波', type: 'line', data: median, symbol: 'none', lineStyle: { color: warn, width: 2.5 }, z: 2 }
      ]
    });
    window.addEventListener('resize', function() { chartFilter.resize(); });
  })();

})();
