(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart 1: I3C Data Rate Comparison ---
  var chartRate = echarts.init(document.getElementById('chart-rate'), null, { renderer: 'svg' });
  chartRate.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var p = params[0];
        return p.name + '<br/>' + p.marker + ' ' + p.value + ' Mbps';
      }
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '8%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['I2C FM', 'I2C FM+', 'I3C SDR', 'HDR-DDR', 'HDR-TSP', 'HDR-TSL'],
      axisLabel: {
        color: muted,
        fontFamily: 'WorkSans',
        fontSize: 12
      },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'value',
      name: 'Mbps',
      nameTextStyle: { color: muted, fontFamily: 'WorkSans', fontSize: 11 },
      axisLabel: { color: muted, fontFamily: 'JetBrainsMono', fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: [
        { value: 0.4, itemStyle: { color: muted } },
        { value: 1, itemStyle: { color: muted } },
        { value: 12.5, itemStyle: { color: accent } },
        { value: 25, itemStyle: { color: accent } },
        { value: 37.5, itemStyle: { color: accent2 } },
        { value: 37.5, itemStyle: { color: accent2 } }
      ],
      barWidth: '50%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c} Mbps',
        color: ink,
        fontFamily: 'JetBrainsMono',
        fontSize: 11
      },
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      }
    }]
  });
  window.addEventListener('resize', function() { chartRate.resize(); });

  // --- Chart 2: I3C vs I2C Actual Parameter Comparison (Grouped Bar) ---
  var chartCompare = echarts.init(document.getElementById('chart-compare'), null, { renderer: 'svg' });
  chartCompare.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['I3C', 'I2C'],
      bottom: 10,
      textStyle: { color: ink, fontFamily: 'WorkSans', fontSize: 12 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [
        '最大时钟频率\n(MHz)',
        '有效数据速率\n(Mbps)',
        '总线电容\n(pF)',
        '电压等级\n(种)',
        '中断方式\n(额外引脚数)',
        '错误检测\n(协议级)',
        '热插拔',
        '多主交接\n(标准化)'
      ],
      axisLabel: {
        color: muted,
        fontFamily: 'WorkSans',
        fontSize: 10,
        interval: 0,
        lineHeight: 14
      },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'value',
      name: '数值（归一化评分）',
      nameTextStyle: { color: muted, fontFamily: 'WorkSans', fontSize: 10 },
      axisLabel: { color: muted, fontFamily: 'JetBrainsMono', fontSize: 10 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      max: 100
    },
    series: [
      {
        name: 'I3C',
        type: 'bar',
        data: [
          { value: 100, label: { show: true, position: 'top', formatter: '12.5 MHz', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 100, label: { show: true, position: 'top', formatter: '37.5 Mbps', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 12, label: { show: true, position: 'top', formatter: '50 pF', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 100, label: { show: true, position: 'top', formatter: '3种', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 100, label: { show: true, position: 'top', formatter: 'IBI(0引脚)', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 100, label: { show: true, position: 'top', formatter: '校验+CRC', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 100, label: { show: true, position: 'top', formatter: '支持', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 100, label: { show: true, position: 'top', formatter: '标准化', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } }
        ],
        barWidth: '30%',
        itemStyle: { color: accent, borderRadius: [3, 3, 0, 0] }
      },
      {
        name: 'I2C',
        type: 'bar',
        data: [
          { value: 8, label: { show: true, position: 'top', formatter: '1 MHz', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 3, label: { show: true, position: 'top', formatter: '3.4 Mbps', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 100, label: { show: true, position: 'top', formatter: '400 pF', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 50, label: { show: true, position: 'top', formatter: '2种', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 0, label: { show: true, position: 'top', formatter: '需GPIO', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 0, label: { show: true, position: 'top', formatter: '无', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 0, label: { show: true, position: 'top', formatter: '不支持', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } },
          { value: 0, label: { show: true, position: 'top', formatter: '非标准', fontSize: 9, fontFamily: 'JetBrainsMono', color: ink } }
        ],
        barWidth: '30%',
        itemStyle: { color: muted, borderRadius: [3, 3, 0, 0] }
      }
    ]
  });
  window.addEventListener('resize', function() { chartCompare.resize(); });
})();
