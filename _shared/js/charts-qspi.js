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

  // --- Chart: Radar comparison of storage interfaces ---
  var radarEl = document.getElementById('chart-radar');
  if (!radarEl) return;

  var radarChart = echarts.init(radarEl, null, { renderer: 'svg' });

  radarChart.setOption({
    animation: false,
    tooltip: {
      appendToBody: true,
      trigger: 'item',
      backgroundColor: bg2,
      borderColor: rule,
      textStyle: { color: ink, fontSize: 12 }
    },
    legend: {
      data: ['SPI', 'QSPI', 'OSPI', 'I2C', 'SD/eMMC'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 },
      itemWidth: 14,
      itemHeight: 10
    },
    radar: {
      indicator: [
        { name: '带宽', max: 100 },
        { name: '引脚效率', max: 100 },
        { name: 'XIP支持', max: 100 },
        { name: '成本优势', max: 100 },
        { name: '设计简易度', max: 100 },
        { name: '容量扩展性', max: 100 }
      ],
      center: ['50%', '48%'],
      radius: '65%',
      axisName: {
        color: muted,
        fontSize: 12
      },
      splitArea: {
        areaStyle: { color: ['transparent'] }
      },
      splitLine: {
        lineStyle: { color: rule }
      },
      axisLine: {
        lineStyle: { color: rule }
      }
    },
    series: [{
      type: 'radar',
      symbolSize: 4,
      data: [
        {
          value: [12, 50, 20, 90, 95, 30],
          name: 'SPI',
          lineStyle: { color: muted, width: 2 },
          areaStyle: { color: muted + '22' },
          itemStyle: { color: muted }
        },
        {
          value: [50, 75, 80, 85, 80, 50],
          name: 'QSPI',
          lineStyle: { color: accent, width: 3 },
          areaStyle: { color: accent + '33' },
          itemStyle: { color: accent }
        },
        {
          value: [95, 55, 95, 60, 55, 60],
          name: 'OSPI',
          lineStyle: { color: accent2, width: 2 },
          areaStyle: { color: accent2 + '22' },
          itemStyle: { color: accent2 }
        },
        {
          value: [2, 95, 0, 95, 90, 15],
          name: 'I2C',
          lineStyle: { color: warn, width: 2 },
          areaStyle: { color: warn + '22' },
          itemStyle: { color: warn }
        },
        {
          value: [80, 45, 0, 50, 50, 95],
          name: 'SD/eMMC',
          lineStyle: { color: '#ec4899', width: 2 },
          areaStyle: { color: '#ec489922' },
          itemStyle: { color: '#ec4899' }
        }
      ]
    }]
  });

  window.addEventListener('resize', function() { radarChart.resize(); });
})();
