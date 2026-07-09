(function() {
  function initCharts() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart: Bandwidth Requirements ---
  var chartBandwidth = echarts.init(document.getElementById('chart-bandwidth'), null, { renderer: 'svg' });
  chartBandwidth.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var tip = '<strong>' + params[0].name + '</strong><br/>';
        params.forEach(function(p) {
          tip += p.marker + ' ' + p.seriesName + ': <strong>' + p.value + ' Gbps</strong><br/>';
        });
        return tip;
      }
    },
    legend: {
      data: ['YUV422 8bit', 'RAW10', 'RAW12'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    grid: {
      left: '3%', right: '4%', bottom: '15%', top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['720p@30fps', '1080p@30fps', '1080p@60fps', '4K@30fps', '4K@60fps', '8K@30fps'],
      axisLabel: { color: muted, fontSize: 11, rotate: 15 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '带宽需求 (Gbps)',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [
      {
        name: 'YUV422 8bit',
        type: 'bar',
        data: [1.1, 4.0, 8.0, 16.0, 32.0, 128.0],
        itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
        barGap: '10%'
      },
      {
        name: 'RAW10',
        type: 'bar',
        data: [1.4, 5.0, 10.0, 20.0, 40.0, 160.0],
        itemStyle: { color: accent2, borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'RAW12',
        type: 'bar',
        data: [1.6, 6.0, 12.0, 24.0, 48.0, 192.0],
        itemStyle: { color: '#D97706', borderRadius: [4, 4, 0, 0] }
      }
    ]
  });
  window.addEventListener('resize', function() { chartBandwidth.resize(); });

  // --- Chart: UI Values ---
  var chartUI = echarts.init(document.getElementById('chart-ui'), null, { renderer: 'svg' });
  chartUI.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var p = params[0];
        return '<strong>' + p.name + '</strong><br/>' +
               p.marker + ' UI = <strong>' + p.value + ' ns</strong><br/>' +
               '<span style="color:#6B7280;font-size:11px">UI = 1 / 数据速率</span>';
      }
    },
    grid: {
      left: '3%', right: '4%', bottom: '8%', top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0.5 Gbps', '1.0 Gbps', '1.5 Gbps', '2.5 Gbps', '4.5 Gbps', '6.0 Gbps', '8.5 Gbps'],
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: 'UI (ns)',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 4.0, itemStyle: { color: accent } },
          { value: 2.0, itemStyle: { color: accent } },
          { value: 1.33, itemStyle: { color: accent } },
          { value: 0.8, itemStyle: { color: accent2 } },
          { value: 0.44, itemStyle: { color: accent2 } },
          { value: 0.33, itemStyle: { color: '#D97706' } },
          { value: 0.24, itemStyle: { color: '#D97706' } }
        ],
        barWidth: '50%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} ns',
          color: ink,
          fontSize: 11,
          fontWeight: 600
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chartUI.resize(); });
  }

  if (document.readyState === 'complete') {
    requestAnimationFrame(initCharts);
  } else {
    window.addEventListener('load', function() {
      requestAnimationFrame(initCharts);
    });
  }
})();
