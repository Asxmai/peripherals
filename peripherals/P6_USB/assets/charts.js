(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var error = style.getPropertyValue('--error').trim();
  var warn = style.getPropertyValue('--warn').trim();

  // --- Chart: Eye Diagram ---
  var eyeEl = document.getElementById('chart-eye');
  if (!eyeEl) return;

  var chartEye = echarts.init(eyeEl, null, { renderer: 'svg' });

  // Generate simulated eye diagram data
  // Create multiple overlapping traces to simulate an eye pattern
  var traces = [];
  var numTraces = 40;
  var pointsPerTrace = 100;

  for (var t = 0; t < numTraces; t++) {
    var data = [];
    var phase = Math.random() * 0.3;
    var jitter = (Math.random() - 0.5) * 0.08;
    var noise = Math.random() * 0.15;
    for (var i = 0; i <= pointsPerTrace; i++) {
      var x = i / pointsPerTrace * 2; // 0 to 2 UI
      // Simulate NRZI-like transitions
      var y;
      var xn = x + jitter;
      if (xn < 0.5 + phase) {
        y = 1.0 + (Math.random() - 0.5) * noise;
      } else if (xn < 0.5 + phase + 0.1) {
        // Transition
        var t_norm = (xn - 0.5 - phase) / 0.1;
        y = 1.0 - t_norm * 2.0 + (Math.random() - 0.5) * noise;
      } else if (xn < 1.5 + phase) {
        y = -1.0 + (Math.random() - 0.5) * noise;
      } else if (xn < 1.5 + phase + 0.1) {
        var t_norm2 = (xn - 1.5 - phase) / 0.1;
        y = -1.0 + t_norm2 * 2.0 + (Math.random() - 0.5) * noise;
      } else {
        y = 1.0 + (Math.random() - 0.5) * noise;
      }
      data.push([x.toFixed(3), y.toFixed(3)]);
    }
    traces.push({
      type: 'line',
      showSymbol: false,
      lineStyle: {
        width: 1,
        color: 'rgba(37, 99, 235, 0.18)',
        opacity: 0.45
      },
      data: data,
      z: 1
    });
  }

  // Annotation lines: upper/lower eye boundaries + vertical eye height guide
  var eyeAnnotations = [
    // Upper eye boundary (y = +0.5V)
    {
      type: 'line', showSymbol: false,
      lineStyle: { width: 1.5, color: accent2, type: 'dashed' },
      data: [[0.7, 0.5], [1.3, 0.5]], z: 10
    },
    // Lower eye boundary (y = −0.5V)
    {
      type: 'line', showSymbol: false,
      lineStyle: { width: 1.5, color: accent2, type: 'dashed' },
      data: [[0.7, -0.5], [1.3, -0.5]], z: 10
    },
    // Vertical guide: eye height (right side, x=1.55)
    {
      type: 'line', showSymbol: false,
      lineStyle: { width: 2, color: accent2 },
      data: [[1.55, -0.5], [1.55, 0.5]], z: 10
    },
    // Vertical guide: eye height (left side, x=0.45)
    {
      type: 'line', showSymbol: false,
      lineStyle: { width: 2, color: accent2 },
      data: [[0.45, -0.5], [0.45, 0.5]], z: 10
    },
    // Horizontal guide: eye width (y=0, center of eye)
    {
      type: 'line', showSymbol: false,
      lineStyle: { width: 2, color: '#dc2626' },
      data: [[0.45, 0], [1.55, 0]], z: 10
    }
  ];

  chartEye.setOption({
    animation: false,
    backgroundColor: 'transparent',
    title: {
      text: 'USB 2.0 HS 信号眼图模拟',
      subtext: '叠加 40 条轨迹，展示眼高、眼宽、交叉电压等参数',
      left: 'center',
      top: 10,
      textStyle: { color: ink, fontSize: 14, fontFamily: 'sans-serif', fontWeight: 700 },
      subtextStyle: { color: muted, fontSize: 11 }
    },
    grid: {
      left: 60,
      right: 60,
      top: 80,
      bottom: 60
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 2,
      name: '时间 (UI)',
      nameLocation: 'center',
      nameGap: 35,
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: -1.5,
      max: 1.5,
      name: '幅度 (V)',
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11 },
      splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.3 } }
    },
    tooltip: {
      trigger: 'none',
      appendToBody: true
    },
    graphic: [
      // ── 眼高标注（垂直，右侧） ──
      {
        type: 'text',
        right: 2,
        top: '36%',
        style: {
          text: '↑',
          fill: accent2,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'sans-serif'
        }
      },
      {
        type: 'text',
        right: 0,
        top: '44%',
        style: {
          text: '眼高',
          fill: accent2,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'sans-serif'
        }
      },
      {
        type: 'text',
        right: 0,
        top: '50%',
        style: {
          text: '(垂直开口)',
          fill: accent2,
          fontSize: 10,
          fontFamily: 'sans-serif'
        }
      },
      {
        type: 'text',
        right: 2,
        top: '56%',
        style: {
          text: '↓',
          fill: accent2,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'sans-serif'
        }
      },
      // ── 眼宽标注（水平，底部） ──
      {
        type: 'text',
        left: 'center',
        top: '82%',
        style: {
          text: '←  眼宽（水平采样窗口）  →',
          fill: '#dc2626',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'sans-serif'
        }
      },
      // ── 交叉电压区标注 ──
      {
        type: 'text',
        left: 70,
        top: '28%',
        style: {
          text: '交叉电压区\n(信号翻转区域)',
          fill: warn,
          fontSize: 10,
          fontFamily: 'sans-serif'
        }
      },
      // ── 说明文字 ──
      {
        type: 'text',
        left: 70,
        bottom: 8,
        style: {
          text: '虚线 = 眼图边界（±0.5V）  |  红色水平线 = 眼宽测量位置（y=0）  |  青色垂直线 = 眼高测量位置',
          fill: muted,
          fontSize: 10,
          fontFamily: 'sans-serif'
        }
      }
    ],
    series: traces.concat(eyeAnnotations)
  });

  window.addEventListener('resize', function() { chartEye.resize(); });
})();
