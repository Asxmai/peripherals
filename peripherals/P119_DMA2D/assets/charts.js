// assets/charts.js
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

  // --- Chart: Performance ---
  var chartPerf = echarts.init(document.getElementById('chart-performance'), null, { renderer: 'svg' });
  chartPerf.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var tip = params[0].name + '<br/>';
        params.forEach(function(p) {
          tip += p.marker + ' ' + p.seriesName + ': ' + p.value + ' ms<br/>';
        });
        return tip;
      }
    },
    legend: {
      data: ['RGB565 (16bpp)', 'ARGB8888 (32bpp)'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    grid: {
      top: 40,
      left: 60,
      right: 30,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      data: ['320×240', '480×272', '640×480', '800×480', '1024×600', '1024×768'],
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'value',
      name: '传输耗时 (ms)',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [
      {
        name: 'RGB565 (16bpp)',
        type: 'bar',
        data: [0.4, 0.8, 1.5, 2.6, 4.8, 6.2],
        itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
        barWidth: '30%',
        barGap: '20%'
      },
      {
        name: 'ARGB8888 (32bpp)',
        type: 'bar',
        data: [0.8, 1.6, 3.0, 5.2, 9.6, 12.4],
        itemStyle: { color: accent2, borderRadius: [4, 4, 0, 0] },
        barWidth: '30%'
      }
    ]
  });
  window.addEventListener('resize', function() { chartPerf.resize(); });

  // --- Chart: AMTCR ---
  var chartAmtcr = echarts.init(document.getElementById('chart-amtcr'), null, { renderer: 'svg' });
  chartAmtcr.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true
    },
    legend: {
      data: ['DMA2D 传输耗时', 'LTDC 闪烁风险'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    grid: {
      top: 40,
      left: 60,
      right: 30,
      bottom: 60
    },
    xAxis: {
      type: 'category',
      name: 'AMTCR TIME 值',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: { color: muted, fontSize: 11 },
      data: ['0', '16', '32', '64', '96', '128', '192', '255'],
      axisLabel: { color: muted, fontSize: 11, interval: 0 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { alignWithLabel: true }
    },
    yAxis: [
      {
        type: 'value',
        name: '传输耗时 (ms)',
        nameTextStyle: { color: muted, fontSize: 11 },
        axisLabel: { color: muted, fontSize: 11 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      {
        type: 'value',
        name: '闪烁风险 (%)',
        nameTextStyle: { color: muted, fontSize: 11 },
        axisLabel: { color: muted, fontSize: 11 },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { show: false },
        max: 100
      }
    ],
    series: [
      {
        name: 'DMA2D 传输耗时',
        type: 'line',
        data: [2.6, 3.0, 3.5, 4.5, 5.6, 6.8, 9.2, 12.0],
        lineStyle: { color: accent, width: 2 },
        itemStyle: { color: accent },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: { color: accent + '15' }
      },
      {
        name: 'LTDC 闪烁风险',
        type: 'line',
        yAxisIndex: 1,
        data: [85, 70, 55, 35, 22, 12, 5, 2],
        lineStyle: { color: error, width: 2, type: 'dashed' },
        itemStyle: { color: error },
        symbol: 'diamond',
        symbolSize: 8,
        areaStyle: { color: error + '10' }
      }
    ]
  });
  window.addEventListener('resize', function() { chartAmtcr.resize(); });
})();
