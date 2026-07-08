(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart: Power Consumption by State ---
  var chartPower = echarts.init(document.getElementById('chart-power'), null, { renderer: 'svg' });
  chartPower.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var p = params[0];
        return p.name + '<br/>' + p.marker + ' ' + p.seriesName + ': <b>' + p.value + ' µA</b>';
      }
    },
    grid: {
      left: 140,
      right: 40,
      top: 30,
      bottom: 40
    },
    xAxis: {
      type: 'log',
      name: '电流 (µA) — 对数坐标',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11 },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: [
        'System OFF',
        'System ON (Idle)',
        '广播 (1s间隔)',
        '广播 (100ms间隔)',
        '连接 (100ms间隔)',
        '连接 (7.5ms间隔)',
        '射频发射 (0dBm)',
        '射频接收'
      ],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: ink, fontSize: 12 },
      splitLine: { show: false }
    },
    series: [{
      name: '平均电流',
      type: 'bar',
      data: [1.5, 2.5, 4.8, 30, 20, 200, 5500, 8000],
      barWidth: 20,
      itemStyle: {
        color: function(params) {
          var colors = [
            accent2,
            accent2 + 'cc',
            accent,
            accent + 'cc',
            accent + '99',
            '#D97706',
            '#DC2626',
            '#DC2626cc'
          ];
          return colors[params.dataIndex];
        },
        borderRadius: [0, 4, 4, 0]
      },
      label: {
        show: true,
        position: 'right',
        color: ink,
        fontSize: 11,
        formatter: function(params) {
          var v = params.value;
          if (v >= 1000) return (v / 1000).toFixed(1) + ' mA';
          return v + ' µA';
        }
      }
    }]
  });
  window.addEventListener('resize', function() { chartPower.resize(); });

  // --- Chart: Battery Life vs Advertising Interval ---
  var chartBattery = echarts.init(document.getElementById('chart-battery'), null, { renderer: 'svg' });
  var intervals = [100, 200, 500, 1000, 2000, 5000, 10000];
  var avgCurrent = [28, 15, 7.2, 4.8, 3.6, 2.8, 2.4];
  var batteryLife = intervals.map(function(t, i) {
    return Math.round(225000 / avgCurrent[i]); // hours, 225mAh CR2032
  });

  chartBattery.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var result = '广播间隔: ' + params[0].name + ' ms<br/>';
        params.forEach(function(p) {
          if (p.seriesName === '平均电流') {
            result += p.marker + ' ' + p.seriesName + ': <b>' + p.value + ' µA</b><br/>';
          } else {
            var years = (p.value / 8760).toFixed(1);
            result += p.marker + ' ' + p.seriesName + ': <b>' + p.value + ' h (' + years + ' 年)</b><br/>';
          }
        });
        return result;
      }
    },
    legend: {
      data: ['平均电流', '电池寿命 (CR2032)'],
      top: 0,
      textStyle: { color: ink, fontSize: 12 }
    },
    grid: {
      left: 70,
      right: 70,
      top: 50,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      data: intervals.map(function(v) { return v + ''; }),
      name: '广播间隔 (ms)',
      nameLocation: 'center',
      nameGap: 35,
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11 },
      splitLine: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '平均电流 (µA)',
        nameTextStyle: { color: accent, fontSize: 11 },
        axisLine: { lineStyle: { color: accent } },
        axisLabel: { color: accent, fontSize: 11 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      {
        type: 'value',
        name: '电池寿命 (小时)',
        nameTextStyle: { color: accent2, fontSize: 11 },
        axisLine: { lineStyle: { color: accent2 } },
        axisLabel: { color: accent2, fontSize: 11 },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '平均电流',
        type: 'bar',
        data: avgCurrent,
        barWidth: 30,
        itemStyle: {
          color: accent + '80',
          borderColor: accent,
          borderWidth: 1,
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: accent,
          fontSize: 10,
          formatter: '{c} µA'
        }
      },
      {
        name: '电池寿命 (CR2032)',
        type: 'line',
        yAxisIndex: 1,
        data: batteryLife,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: accent2, width: 2.5 },
        itemStyle: { color: accent2, borderColor: bg2, borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: accent2 + '30' },
              { offset: 1, color: accent2 + '05' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          color: accent2,
          fontSize: 10,
          formatter: function(params) {
            return Math.round(params.value / 8760) + '年';
          }
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chartBattery.resize(); });
})();
