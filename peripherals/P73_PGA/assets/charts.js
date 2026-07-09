(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var accentLight = '#EFF6FF';
  var accent2Light = '#ECFEFF';
  var success = '#059669';
  var warn = '#D97706';
  var danger = '#DC2626';

  // --- Chart: Bandwidth vs Gain ---
  var chartBw = echarts.init(document.getElementById('chart-bandwidth'), null, { renderer: 'svg' });
  chartBw.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true },
    grid: { left: 60, right: 30, top: 40, bottom: 50 },
    xAxis: {
      type: 'category',
      data: ['x1', 'x2', 'x4', 'x8', 'x16', 'x32', 'x64'],
      name: 'PGA 增益',
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLabel: { color: ink, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'value',
      name: '-3dB 带宽 (MHz)',
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    series: [{
      type: 'bar',
      data: [13, 6.5, 3.25, 1.625, 0.813, 0.406, 0.203],
      barWidth: '50%',
      itemStyle: {
        color: function(params) {
          var colors = [accent, accent, accent2, accent2, warn, warn, danger];
          return colors[params.dataIndex];
        },
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        formatter: function(p) { return p.value.toFixed(2) + ' MHz'; },
        color: ink,
        fontSize: 11
      }
    }]
  });
  window.addEventListener('resize', function() { chartBw.resize(); });

  // --- Chart: Radar - Internal vs External PGA ---
  var chartRadar = echarts.init(document.getElementById('chart-radar'), null, { renderer: 'svg' });
  chartRadar.setOption({
    animation: false,
    tooltip: { appendToBody: true },
    legend: {
      data: ['MCU 内置 PGA', '外部精密 PGA'],
      bottom: 0,
      textStyle: { color: ink, fontSize: 13 },
      itemGap: 20
    },
    radar: {
      indicator: [
        { name: '精度', max: 100 },
        { name: '带宽', max: 100 },
        { name: '噪声性能', max: 100 },
        { name: '成本优势', max: 100 },
        { name: 'PCB 面积', max: 100 },
        { name: '功耗', max: 100 },
        { name: '集成度', max: 100 },
        { name: '灵活性', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 4,
      center: ['50%', '45%'],
      radius: '60%',
      nameGap: 30,
      axisName: { color: ink, fontSize: 13 },
      splitLine: { lineStyle: { color: rule } },
      splitArea: { areaStyle: { color: [bg2, accentLight] } },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [40, 35, 40, 90, 95, 85, 95, 45],
          name: 'MCU 内置 PGA',
          lineStyle: { color: accent, width: 2 },
          areaStyle: { color: accent + '22' },
          itemStyle: { color: accent }
        },
        {
          value: [95, 80, 90, 30, 30, 50, 20, 90],
          name: '外部精密 PGA',
          lineStyle: { color: accent2, width: 2 },
          areaStyle: { color: accent2 + '22' },
          itemStyle: { color: accent2 }
        }
      ]
    }]
  });
  window.addEventListener('resize', function() { chartRadar.resize(); });

  // --- Chart: Compare bar - Internal vs External ---
  var chartCompare = echarts.init(document.getElementById('chart-compare'), null, { renderer: 'svg' });
  chartCompare.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true },
    legend: {
      data: ['MCU 内置 PGA', '外部精密 PGA'],
      bottom: 10,
      textStyle: { color: ink, fontSize: 12 }
    },
    grid: { left: 100, right: 30, top: 30, bottom: 60 },
    xAxis: {
      type: 'value',
      name: '评分 (满分100)',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: ['精度', '带宽', '噪声', 'CMRR', 'PSRR', '成本', '面积', '集成度'],
      axisLabel: { color: ink, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [
      {
        name: 'MCU 内置 PGA',
        type: 'bar',
        data: [40, 35, 40, 55, 55, 90, 95, 95],
        barWidth: '35%',
        itemStyle: { color: accent, borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: 'right', color: muted, fontSize: 10 }
      },
      {
        name: '外部精密 PGA',
        type: 'bar',
        data: [95, 80, 90, 90, 95, 30, 30, 20],
        barWidth: '35%',
        itemStyle: { color: accent2, borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: 'right', color: muted, fontSize: 10 }
      }
    ]
  });
  window.addEventListener('resize', function() { chartCompare.resize(); });

  // --- Chart: Sensor PGA Gain ---
  var chartSensor = echarts.init(document.getElementById('chart-sensor'), null, { renderer: 'svg' });
  chartSensor.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var p = params[0];
        var ranges = {
          '热电偶': '64 ~ 128x',
          '应变片': '32 ~ 128x',
          '电流检测': '8 ~ 32x',
          '温度传感器': '1 ~ 8x',
          '压力传感器': '16 ~ 64x',
          '心电 ECG': '100 ~ 1000x'
        };
        return p.name + '<br/>推荐增益范围: ' + (ranges[p.name] || '');
      }
    },
    grid: { left: 100, right: 50, top: 30, bottom: 30 },
    xAxis: {
      type: 'value',
      name: '推荐增益 (倍)',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLabel: { color: muted, fontSize: 11 },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: ['温度传感器', '电流检测', '压力传感器', '应变片', '热电偶', '心电 ECG'],
      axisLabel: { color: ink, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [
      {
        name: '最小增益',
        type: 'bar',
        stack: 'gain',
        data: [1, 8, 16, 32, 64, 100],
        barWidth: '45%',
        itemStyle: { color: 'transparent' }
      },
      {
        name: '增益范围',
        type: 'bar',
        stack: 'gain',
        data: [7, 24, 48, 96, 64, 900],
        barWidth: '45%',
        itemStyle: {
          color: function(params) {
            var colors = [success, accent, accent2, accent, warn, danger];
            return colors[params.dataIndex];
          },
          borderRadius: [0, 4, 4, 0],
          opacity: 0.8
        },
        label: {
          show: true,
          position: 'right',
          formatter: function(p) {
            var labels = ['1~8x', '8~32x', '16~64x', '32~128x', '64~128x', '100~1000x'];
            return labels[p.dataIndex];
          },
          color: ink,
          fontSize: 11
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chartSensor.resize(); });
})();
