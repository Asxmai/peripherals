(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart: WiFi vs Zigbee Channel Overlap ---
  var chartOverlap = echarts.init(document.getElementById('chart-channel-overlap'), null, { renderer: 'svg' });

  // WiFi channels: 1(2412MHz), 6(2437MHz), 11(2462MHz) - each 22MHz bandwidth
  // Zigbee channels: 11(2405MHz) to 26(2480MHz) - each 5MHz, 2MHz bandwidth
  var wifiChannels = [
    { name: 'WiFi Ch1', center: 2412, bandwidth: 22 },
    { name: 'WiFi Ch6', center: 2437, bandwidth: 22 },
    { name: 'WiFi Ch11', center: 2462, bandwidth: 22 }
  ];

  var zigbeeChannels = [];
  for (var i = 11; i <= 26; i++) {
    zigbeeChannels.push({
      name: 'Zigbee Ch' + i,
      center: 2405 + (i - 11) * 5,
      bandwidth: 2
    });
  }

  // Create frequency axis data
  var freqStart = 2400;
  var freqEnd = 2485;
  var freqStep = 1;
  var freqData = [];
  for (var f = freqStart; f <= freqEnd; f += freqStep) {
    freqData.push(f);
  }

  // Generate WiFi power curves (Gaussian-like)
  function gaussianCurve(center, bandwidth, amplitude) {
    var sigma = bandwidth / 2.355;
    return freqData.map(function(f) {
      return amplitude * Math.exp(-0.5 * Math.pow((f - center) / sigma, 2));
    });
  }

  var wifiSeries = wifiChannels.map(function(ch, idx) {
    var colors = ['#DC2626', '#D97706', '#7C3AED'];
    return {
      name: ch.name,
      type: 'line',
      data: freqData.map(function(f, i) {
        return [f, gaussianCurve(ch.center, ch.bandwidth, 100)[i]];
      }),
      lineStyle: { width: 2, color: colors[idx] },
      itemStyle: { color: colors[idx] },
      areaStyle: { color: colors[idx], opacity: 0.08 },
      smooth: true,
      symbol: 'none',
      z: 1
    };
  });

  // Zigbee channel bars — each channel has 2MHz bandwidth, shown as rectangles
  var zigbeeData = zigbeeChannels.map(function(ch) {
    return {
      value: [ch.center, 25],
      itemStyle: {
        color: accent,
        opacity: 0.55,
        borderColor: accent,
        borderWidth: 1
      }
    };
  });

  var zigbeeSeries = {
    name: 'Zigbee 信道',
    type: 'bar',
    data: zigbeeData,
    barWidth: 8,
    z: 3
  };

  chartOverlap.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var freq = params[0].value[0];
        var lines = ['频率: ' + freq + ' MHz'];
        params.forEach(function(p) {
          if (p.seriesName !== 'Zigbee 信道') {
            lines.push(p.marker + ' ' + p.seriesName + ': ' + (p.value[1] > 0 ? '有信号' : '无'));
          }
        });
        return lines.join('<br>');
      }
    },
    legend: {
      data: wifiSeries.map(function(s) { return s.name; }).concat(['Zigbee 信道']),
      bottom: 0,
      textStyle: { color: ink, fontSize: 11 }
    },
    grid: {
      left: 60,
      right: 30,
      top: 30,
      bottom: 50
    },
    xAxis: {
      type: 'value',
      name: '频率 (MHz)',
      nameTextStyle: { color: muted, fontSize: 11 },
      min: 2400,
      max: 2485,
      axisLabel: { color: muted, fontSize: 10 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    yAxis: {
      type: 'value',
      name: '信号强度 (相对)',
      nameTextStyle: { color: muted, fontSize: 11 },
      max: 120,
      axisLabel: { color: muted, fontSize: 10 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: wifiSeries.concat([zigbeeSeries])
  });

  window.addEventListener('resize', function() { chartOverlap.resize(); });

  // --- Chart: Power Consumption Comparison ---
  var chartPower = echarts.init(document.getElementById('chart-power'), null, { renderer: 'svg' });

  chartPower.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var p = params[0];
        return p.name + '<br>典型电流: ' + p.value + ' µA';
      }
    },
    grid: {
      left: 100,
      right: 40,
      top: 30,
      bottom: 30
    },
    xAxis: {
      type: 'log',
      name: '电流 (µA, 对数坐标)',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: {
        color: muted,
        fontSize: 10,
        formatter: function(v) {
          if (v >= 1000) return (v/1000) + 'mA';
          return v + 'µA';
        }
      },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      min: 0.1,
      max: 50000
    },
    yAxis: {
      type: 'category',
      data: ['PM3 深度睡眠', 'PM2 睡眠', 'PM1 空闲', 'Active RX', 'Active TX'],
      axisLabel: { color: ink, fontSize: 11, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: [
        { value: 0.5, itemStyle: { color: '#059669' } },
        { value: 1, itemStyle: { color: '#10B981' } },
        { value: 1000, itemStyle: { color: '#D97706' } },
        { value: 20000, itemStyle: { color: '#DC2626' } },
        { value: 30000, itemStyle: { color: '#B91C1C' } }
      ],
      barWidth: 24,
      label: {
        show: true,
        position: 'right',
        color: ink,
        fontSize: 11,
        formatter: function(p) {
          if (p.value >= 1000) return (p.value/1000).toFixed(0) + ' mA';
          return p.value + ' µA';
        }
      }
    }]
  });

  window.addEventListener('resize', function() { chartPower.resize(); });
})();
