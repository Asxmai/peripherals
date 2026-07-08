(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart: Interface Comparison (Radar) ---
  var chartEl = document.getElementById('chart-interface-compare');
  if (!chartEl) return;

  var chart = echarts.init(chartEl, null, { renderer: 'svg' });
  chart.setOption({
    animation: false,
    tooltip: {
      appendToBody: true,
      trigger: 'item',
      backgroundColor: '#1a2332',
      borderColor: rule,
      textStyle: { color: '#e0e6ed', fontSize: 12 }
    },
    legend: {
      data: ['MII', 'RMII', 'GMII', 'RGMII'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    radar: {
      indicator: [
        { name: '最高速率', max: 5 },
        { name: '引脚效率', max: 5 },
        { name: '布线简易度', max: 5 },
        { name: '时钟频率', max: 5 },
        { name: '功耗效率', max: 5 },
        { name: '生态支持度', max: 5 }
      ],
      shape: 'polygon',
      splitNumber: 5,
      axisName: { color: ink, fontSize: 11 },
      splitLine: { lineStyle: { color: rule } },
      splitArea: { show: true, areaStyle: { color: [bg2, '#fff'] } },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [2, 2, 3, 2, 3, 5],
          name: 'MII',
          lineStyle: { color: muted, width: 2 },
          areaStyle: { color: muted + '22' },
          itemStyle: { color: muted }
        },
        {
          value: [2, 5, 5, 3, 4, 5],
          name: 'RMII',
          lineStyle: { color: accent, width: 2 },
          areaStyle: { color: accent + '22' },
          itemStyle: { color: accent }
        },
        {
          value: [5, 1, 1, 5, 2, 3],
          name: 'GMII',
          lineStyle: { color: '#e67e22', width: 2 },
          areaStyle: { color: '#e67e2222' },
          itemStyle: { color: '#e67e22' }
        },
        {
          value: [5, 4, 3, 5, 3, 4],
          name: 'RGMII',
          lineStyle: { color: accent2, width: 2 },
          areaStyle: { color: accent2 + '22' },
          itemStyle: { color: accent2 }
        }
      ]
    }]
  });

  window.addEventListener('resize', function() { chart.resize(); });
})();
