# JVM的发展历程

## Sun Classic VM

- 早在1996年Java1.0版本的时候，Sun公司发布了一款名为`Sun Classic VM`的Java虚拟机，它同时也是世界上第一款商用Java虚拟机，JDK1.4时完全被淘汰
- 这款虚拟机内部只提供解释器
- 如果使用JIT编译器，就需要进行外挂，但是一旦使用了JIT编译器，JIT就会接管虚拟机的执行系统，解释器就不再工作。解释器和编译器不能配合工作
- 现在hotspot内置了此虚拟机

 

## Exact VM

- 为了解决上一个虚拟机问题，jdk1.2时，sun提供了此虚拟机
- Exact Memory Management : 准确式内存管理
  - 也可以叫`Non-Conservative/Accurate Memory Mangement`
  - 虚拟机可以知道内存中某个位置的数据具体时什么类型
- 具备现代高性能虚拟机的雏形
  - 热点探测
  - 编译器与解释器混合工作模式
- 只在`Solaris`平台短暂使用，其他平台上还是`classic vm`
  - 英雄气短，终被`Hotspot`虚拟机替换



## HotSpot VM

- HotSpot历史
  - 最初由一家名为`Longview Technologies`的小公司设计
  - 1997年，此公司被`Sun`收购，2009年，`Sun`被`Oracle`收购
  - `JDK1.3`时，`HotSpot VM` 成为默认虚拟机
- 目前`HotSpot`占有绝对的市场地位，称霸武林
  - 不管时现在仍在广泛使用的JDK6,还是使用比较多的`JDK8`中，默认虚拟机都是`HotSpot`
  - `Sun/Oracle JDK`和`OpenJDK`的默认虚拟机
- 从服务器、桌面到移动端、嵌入式都有应用
- 名称中`HotSpot`指的就是它的热点代码探测技术
  - 通过计数器找找到最具编译价值代码，触发即使编译或者栈上替换
  - 通过编译器与解释器协同工作，在最优化的程序响应时间与最佳执行性能中取得平衡



## JRockit

- 专注于服务器端应用
  - 它可以不太关注程序启动速度，因此`JRockit`内部不包含解释器实现，全部代码靠即使编译器编译后执行
- 大量的行业基准测试显示，`JRockit JVM`是世界上最快的`VM`
  - 使用`JRockit`产品，客户已经体验到了显著的性能提升(一些超过了70%)和硬件成本的减少(50%)
- 优势
  - `JRockit`面向延迟敏感型应用的解决方案`JRockit Real Time`提供以毫秒或微妙级别的`JVM`响应时间，适合财务、军事指挥、电信网络的需要
  - `MissionControl`服务套件，它是一组以极低的开销来监控、管理和分析生产环境中的应用程序工具
- 2008年，`BEA`被`Oracle`收购
- `Oracle`表达了整合两大优秀虚拟机的工作，大致在`JDK8`中完成，整合的方式是在`HotSpot`的基础上，移植`JRockit`的优秀特性



## J9

- 全称 `IBM Technology for Java Virtual Machine` ,简称`IT4J` ,内部代号`J9`
- 市场定位与`HotSpot`接近，服务器端、桌面应用、嵌入式等多用途`VM`
- 广泛用于`IBM`的各种`Java`产品，目前有影响力的三大商用虚拟机之一
- 2017年左右，IBM发布了开源`J9 VM`,命名为`OpenJ9`,交给`Eclipse`基金会管理，也成为`Eclipse OpenJ9`



## KVM和CDC/CLDC HotSpot

- `Oracle`在`Java ME`产品线上的两款虚拟机为: `CDC/CLDC HotSpot Implementation VM`
- `KVM`(`Kilobyte`) 是`CLDC-HI`早期产品
- 目前移动领域地位尴尬，智能手机被`Android`和`IOS`二分台天下
- `KVM`简单、轻量、高度可移植，面向更低端的设备上还维持自己的一片市场
  - 智能控制器、传感器
  - 老人手机、经济欠发达地区的功能手机
- 所有虚拟机的原则：一次编译、到处运行

## Azul VM

- `Azul VM`和`BEA Liquid VM`是与特定硬件平台绑定，软硬件配合的专有虚拟机（高性能Java虚拟机中的战斗机）
- `Azul VM`是`Azul Systems`公司在`HotSpot`基础上进行大量改进，运行于`Azxul Systems`公司的专有硬件`Vega`系统上的`Java`虚拟机
- 每个`Azul VM`实例都可以管理至少数十个`CPU`和数百`GB`内存的硬件资源，并提供在巨大内存范围内实现可控`GC`时间的垃圾回收器、专有硬件优化的线程调度等优秀特性
- 2010年，`Azul Systems`公司开始从硬件转向软件，发布了自己的`Zing JVM`,可以通过`x86`平台上提供接近于`Vega`系统的特性



## Liquid VM

- 高性能Java虚拟机中战斗机
- BEA公司开发，直接运行在自家`Hypervisor`系统上
- `Liquid VM`即时现在的`JRockit VE(Virtual Edition)`，`Liquid VM`不需要操作系统的支持，自己本身实现了一个专用操作系统的必要功能，如线程调度、文件系统、网络支持等
- 随着`JRockit`虚拟机终止发布，`Liquid VM`项目也停止了 



## Apache Harmony

- Apache曾经推出过与`JDK1.5`和`JDK1.6`兼容的Java运行平台 **`Apache Harmony`**
- IBM和Intel联合开发的开源JVM，受到同样开源的`OpenJDK`的压制，Sun坚决不让Harmony获得JCP认证，最终于2011年退役，IBM转而参与OpenJDK
- 虽然目前并没有Apache Harmony被大规模商用的案例，但是它的Java类库代码吸纳进了Android SDK

## Microsoft JVM

- 微软为了在IE3浏览器中支持Java Applets,开发了Microsoft JVM
- 只能在windows平台下运行，是当时Windows下性能最好的Java vm



## TaobaoJVM

- 基于OpenJDK HotSpot VM 国内第一个优化、深度定制且开源的高性能服务器版Java虚拟机
  - 创新的GCIH(GC invisible heap) 技术实现了off-heap，将声明周期较长的Java对象从heap中移到heap之外，并且GC不能管理GCIH内部的Java对象，以此达到降低GC的回收频率和提升GC的回收效率的目的
  - GCIH中的对象还能再多个Java虚拟机进程中实现共享
  - 使用`crc32`指令实现`JVM intrinsic`降低JNI的调用开销
  - `PMU hardware`的java profiling tool和诊断协助功能
  - 针对大数据场景的ZenGC
- 硬件严重依赖`intel`的CPU，损失了兼容性，但提高了性能