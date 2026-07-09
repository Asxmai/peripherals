# 嵌入式外设技术手册 | Embedded Peripherals Guide

面向嵌入式系统工程师的外设学习资源库，提供全面的技术指南和实用参考。

## 项目简介

本项目是一个系统化的嵌入式外设学习资料库，涵盖了微控制器（MCU）中常见的各类外设模块。每个外设都配有详细的技术指南，包含工作原理、配置方法、代码示例和实际应用案例，帮助工程师快速掌握外设开发技能。

所有文档以 HTML 页面形式提供，支持在线浏览，具有响应式设计和深色/浅色主题切换功能。

## 项目特性

- **全面的外设覆盖**：包含 40+ 种常用外设模块
- **详细的技术文档**：每个外设配有完整的技术指南
- **丰富的可视化**：使用 Mermaid 流程图和 ECharts 图表
- **响应式设计**：支持桌面和移动设备浏览
- **深色/浅色主题**：一键切换，保护视力
- **离线可用**：所有资源本地化，无需网络连接

## 外设分类

### 通信接口

| 外设 | 说明 | 文档 |
|------|------|------|
| USART | 通用同步异步串行口 | [查看](./peripherals/P1_USART/usart-guide.html) |
| I2C | 集成电路总线 | [查看](./peripherals/P2_I2C/i2c-complete-guide.html) |
| SPI | 串行外设接口 | [查看](./peripherals/P3_SPI/spi-technical-reference.html) |
| I3C | 改进型集成电路总线 | [查看](./peripherals/P4_I3C/i3c-technical-reference.html) |
| CAN | 控制器局域网总线 | [查看](./peripherals/P5_CAN/can-bus-guide.html) |
| Ethernet MAC | 以太网媒体访问控制 | [查看](./peripherals/P7_Ethernet_MAC/ethernet-mac-guide.html) |
| USB | 通用串行总线 | [查看](./peripherals/P6_USB/usb-embedded-guide.html) |
| LIN | 本地互联网络 | [查看](./peripherals/P14_LIN/lin-protocol-guide.html) |
| IrDA | 红外数据通信 | [查看](./peripherals/P15_IrDA/irda-technical-guide.html) |
| RS485 | 差分串行通信 | [查看](./peripherals/P8_RS485/rs485-guide.html) |
| SDIO/SDMMC | 安全数字输入输出 | [查看](./peripherals/P11_SDIO_SDMMC/sdio-sdmmc-guide.html) |
| QSPI | 四线串行外设接口 | [查看](./peripherals/P9_QSPI/qspi-technical-guide.html) |
| OSPI | 八线串行外设接口 | [查看](./peripherals/P10_OSPI/ospi-technical-reference.html) |
| I2S | 集成电路间声音 | [查看](./peripherals/P12_I2S/i2s-embedded-guide.html) |
| SAI | 串行音频接口 | [查看](./peripherals/P13_SAI/sai-reference-guide.html) |
| LVDS | 低压差分信号 | [查看](./peripherals/P23_LVDS/lvds-technical-guide.html) |
| MIPI DSI | 移动产业处理器接口显示 | [查看](./peripherals/P120_MIPI_DSI/mipi-dsi-guide.html) |
| MIPI CSI-2 | 移动产业处理器接口摄像头 | [查看](./peripherals/P121_MIPI_CSI_2/mipi-csi2-guide.html) |
| DPI | 显示像素接口 | [查看](./peripherals/P123_DPI/dpi-embedded-guide.html) |

### 无线通信

| 外设 | 说明 | 文档 |
|------|------|------|
| BLE | 低功耗蓝牙 | [查看](./peripherals/P141_BLE/ble-embedded-guide.html) |
| WiFi | 无线局域网 | [查看](./peripherals/P142_WiFi/wifi-embedded-guide.html) |
| Zigbee | 低功耗网状网络 | [查看](./peripherals/P143_Zigbee/zigbee-embedded-guide.html) |
| NFC | 近场通信 | [查看](./peripherals/P145_NFC/nfc-embedded-guide.html) |
| GNSS | 全球导航卫星系统 | [查看](./peripherals/P147_GNSS/gnss-embedded-guide.html) |

### 模拟外设

| 外设 | 说明 | 文档 |
|------|------|------|
| ADC | 模数转换器 | [查看](./peripherals/P64_ADC/adc-guide.html) |
| DAC | 数模转换器 | [查看](./peripherals/P65_DAC/dac-guide.html) |
| COMP | 比较器 | [查看](./peripherals/P66_COMP/comp-guide.html) |
| PGA | 可编程增益放大器 | [查看](./peripherals/P73_PGA/pga-embedded-guide.html) |

### 定时器与中断

| 外设 | 说明 | 文档 |
|------|------|------|
| TIM | 通用定时器 | [查看](./peripherals/P52_TIM/stm32-tim-guide.html) |
| IWDG | 独立看门狗 | [查看](./peripherals/P55_IWDG/stm32-iwdg-guide.html) |
| NVIC | 嵌套向量中断控制器 | [查看](./peripherals/P78_NVIC/nvic-embedded-guide.html) |
| EXTI | 外部中断 | [查看](./peripherals/P79_EXTI/exti-guide.html) |

### 存储与数据传输

| 外设 | 说明 | 文档 |
|------|------|------|
| FLASH | 闪存控制器 | [查看](./peripherals/P83_FLASH/flash-controller-guide.html) |
| DMA | 直接内存访问 | [查看](./peripherals/P80_DMA/dma-technical-guide.html) |
| DMA2D | 2D 图形加速器 | [查看](./peripherals/P119_DMA2D/stm32-dma2d-guide.html) |

### 系统控制

| 外设 | 说明 | 文档 |
|------|------|------|
| GPIO | 通用输入输出 | [查看](./peripherals/P136_GPIO/gpio-reference.html) |
| PWR/PMU | 电源管理单元 | [查看](./peripherals/P99_PWR_PMU/stm32-pwr-pmu-guide.html) |

## 快速开始

### 本地浏览

1. 克隆或下载本项目
```bash
git clone https://github.com/asxmai/peripherals.git
```

2. 打开主页
```bash
# 直接在浏览器中打开
start index.html

# 或使用本地服务器
python -m http.server 8000
# 访问 http://localhost:8000
```

### 在线浏览

访问 GitHub Pages：
```
https://asxmai.github.io/peripherals/
```

## 项目结构

```
project/
├── index.html                 # 主页（外设卡片导航）
├── _shared/                   # 共享资源
│   ├── fonts/                 # 字体文件
│   └── js/                    # JavaScript 库
│       ├── mermaid.min.js     # 流程图库
│       └── echarts.min.js     # 图表库
└── peripherals/               # 外设文档目录
    ├── P1_USART/              # USART 外设
    │   ├── usart-guide.html   # 技术指南
    │   └── assets/            # 资源文件
    ├── P2_I2C/
    ├── P3_SPI/
    └── ...                    # 其他外设
```

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式与主题（CSS 变量实现深色/浅色主题）
- **JavaScript** - 交互逻辑
- **Mermaid.js** - 流程图和时序图
- **ECharts** - 数据可视化图表
- **自定义字体** - Work Sans, JetBrains Mono

## 文档规范

每个外设文档遵循统一结构：

1. **概述** - 外设功能简介
2. **工作原理** - 核心机制和架构
3. **配置方法** - 寄存器配置和初始化
4. **代码示例** - 实际编程示例
5. **应用场景** - 典型应用案例
6. **常见问题** - FAQ 和故障排查

## 贡献指南

欢迎贡献！如果你发现错误或想改进文档：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 文档编写规范

- 使用中文编写，技术术语保留英文
- 代码示例需包含详细注释
- 图表使用 Mermaid 或 ECharts
- 遵循现有 HTML 模板结构
- 确保深色/浅色主题正常显示

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目问题：提交 Issue
- 技术讨论：开启 Discussion

## 致谢

感谢所有为嵌入式技术社区做出贡献的开发者。

---

**注意**：本项目为学习资料，实际开发请参考芯片官方参考手册。
