(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart: OSPI Throughput Comparison ---
  var chartEl = document.getElementById('chart-throughput');
  if (!chartEl) return;

  var chart = echarts.init(chartEl, null, { renderer: 'svg' });

  var categories = [
    'SPI\n(1线 SDR)',
    'QSPI\n(4线 SDR)',
    'OSPI\n(8线 SDR)',
    'OSPI\n(8线 DDR)',
    'OSPI DDR\n+ DMA + PHY',
    'OSPI DDR\n双Flash并联'
  ];

  var values = [12.5, 50, 100, 200, 283, 400];

  chart.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var d = params[0];
        return d.name.replace('\n', ' ') + '<br/>理论带宽: <strong>' + d.value + ' MB/s</strong>';
      }
    },
    grid: {
      left: 60,
      right: 30,
      top: 30,
      bottom: 80
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        fontSize: 11,
        color: muted,
        interval: 0,
        lineHeight: 16
      },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: 'MB/s',
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: values.map(function(v, i) {
        return {
          value: v,
          itemStyle: {
            color: i <= 1 ? muted : (i <= 3 ? accent : accent2),
            borderRadius: [4, 4, 0, 0]
          }
        };
      }),
      barWidth: '50%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c} MB/s',
        fontSize: 11,
        fontWeight: 600,
        color: ink
      }
    }]
  });

  window.addEventListener('resize', function() { chart.resize(); });
})();
