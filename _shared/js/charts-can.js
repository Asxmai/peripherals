(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var accent3 = style.getPropertyValue('--accent3').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart: Baud Rate vs Max Distance ---
  var chartEl = document.getElementById('chart-baud-distance');
  if (chartEl) {
    var chart = echarts.init(chartEl, null, { renderer: 'svg' });
    chart.setOption({
      animation: false,
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        backgroundColor: '#ffffff',
        borderColor: rule,
        textStyle: { color: ink, fontFamily: 'WorkSans' },
        formatter: function(params) {
          var d = params[0];
          return '<strong>' + d.name + '</strong><br/>最大总线长度: ' + d.value + ' m';
        }
      },
      grid: {
        top: 40,
        right: 40,
        bottom: 50,
        left: 70
      },
      xAxis: {
        type: 'category',
        data: ['1 Mbps', '500 kbps', '250 kbps', '125 kbps', '50 kbps', '20 kbps', '10 kbps'],
        axisLabel: {
          color: muted,
          fontFamily: 'JetBrainsMono',
          fontSize: 11
        },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: 'value',
        name: '最大总线长度 (m)',
        nameTextStyle: {
          color: muted,
          fontFamily: 'WorkSans',
          fontSize: 12,
          padding: [0, 0, 0, 40]
        },
        axisLabel: {
          color: muted,
          fontFamily: 'JetBrainsMono',
          fontSize: 11
        },
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: [40, 100, 250, 500, 1000, 2000, 5000],
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: accent },
            { offset: 1, color: accent2 }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: ink,
          fontFamily: 'JetBrainsMono',
          fontSize: 11,
          formatter: '{c} m'
        }
      }]
    });
    window.addEventListener('resize', function() { chart.resize(); });
  }
})();
