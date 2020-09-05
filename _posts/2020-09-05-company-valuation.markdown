---
layout:     post
title:      "DCF与PE模型企业估值"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-09-05 20:16:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - economy
---
## 一、DCF模型<br>

### 1.1、DCF模型定义<br>

　　DCF现金流量贴现法(Discounted Cash Flow Method)，即把企业未来特定期间内的预期现金流量还原为当前现值。由于企业价值的真髓还是它未来盈利的能力，只有当企业具备这种能力，它的价值才会被市场认同，因此理论界通常把现金流量贴现法作为企业价值评估的首选方法，在评估实践中也得到了大量的应用，并且已经日趋完善和成熟。<br>
　　定义公式如下：<br>
![object](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-09-05-economy/1.jpg?raw=true)<br>
　　其中，value为企业的估值，n为企业的寿命，CashFlow_t为企业在t时刻产生的现金流(n年内自由现金流的年增长Before_Cash_Flow_Rate)，r为反映预期现金流的折现率。<br>
　　简单示例如下图所示：<br>
![object](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-09-05-economy/2.jpg?raw=true)<br>
　　实际运用中，通常会采用两阶段价值模型(Two Stage Growth Model)，第一阶段是超常增长，第二阶段是永续增长。首先，逐年计算出第一阶段的自由现金流及其折现，然后对其第二阶段，估算一个永续价值，两阶段的折现值加总得出企业的估值，即预测期价值+后续期价值。定义公式如下：<br>
![object](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-09-05-economy/3.png?raw=true)<br>
　　其中，g为n年后自由现金增长率After_Cash_Flow_Rate。<br>
  
### 1.2、DCF模型优缺点<br>

　　现金流量贴现法作为评估企业内在价值的科学方法更适合并购评估的特点，很好的体现了企业价值的本质，并且现金流量贴现法最符合价值理论，能通过各种假设，反映企业管理层的管理水平和经验。但尽管如此，现金流量贴现法仍存在一些不足：首先从折现率的角度看，这种方法不能反映企业灵活性所带来的收益，这个缺陷也决定了它不能适用于企业的战略领域；其次这种方法没有考虑企业项目之间的相互依赖性，也没有考虑到企业投资项目之间的时间依赖性；第三，使用这种方法，结果的正确性完全取决于所使用的假设条件的正确性，在应用是切不可脱离实际。而且如果遇到企业未来现金流量很不稳定、亏损企业等情况，现金流量贴现法就无能为力了。<br>

## 二、PE模型定义<br>

### 2.1、PE模型定义<br>

　　PE(Price–earnings ratio)估值法，即市盈率估值，其计算公式为：市盈率P/E =每股市价/每股盈利<br>
　　其中，E表示最近12个月的每股盈利。<br>
  
### 2.2、PE模型优缺点<br>

　　PE模型简单易行，运用了近期的盈利估计，而近期的盈利估计一般比较准确。但盈利不等于现金，受会计影响较大。忽视了公司的风险，如高债务杠杆。同样的P/E，用了高债务杠杆得到的E与毫无债务杠杆得到的E是截然不同的。另外市盈率无法顾及远期盈利，对周期性及亏损企业估值困难。P/E估值忽视了摊销折旧、资本开支等维持公司运转的重要的资金项目。
  
## 三、java代码实现<br>

　　某位童鞋说不能光知道概念，要用起来才行。于是尝试最最基本简单的公式如何计算的，发现手算高次项有点麻烦，遂打开尘封已久的IDEA。以中兴通讯ZTE为实践例子，使用DCF模型与PE模型分别对企业进行估值计算。<br>

```
/**
 * 中兴PE模型与DCF模型估值
 *
 * @author ART
 * @since 2020-09-05 to 2020-09-06
 */
public class ZTESimulateValue {
    // ZTE 20200630财报每股现金流1.84元/股
    private static final double Cash_Flow_Unit_Stock = 1.84;

    // ZTE 总股本 单位：亿股
    private static final double Total_Stock_Num = 46.13;

    // 资产估值期限资产延续年限 单位：年
    private static final int Asset_Year = 10;

    // 折现率
    private static final double Discount_Rate = 0.08;

    // Asset_Year年内自由现金流增长率
    private static final double Before_Cash_Flow_Rate = 0.15;

    // Asset_Year年后自由现金增长率
    private static final double After_Cash_Flow_Rate = 0.03;

    // ZTE 20200904最新股价 单位：元  每股市价
    private static final double ZTE_Stock_Unit_Price = 37.48;

    // ZTE 2019财年每股盈利 单位：元/股
    private static final double ZTE_Stock_Unit_Profit_2019 = 1.1158;

    // ZTE最新4个季度每股盈利 单位：元/股
    private static final double ZTE_Stock_Unit_Profit_2020 = 1.1997;

    // ZTE 2019全年净利润 单位：亿元
    private static final double ZTE_Total_Profit_2019 = 51.48;

    // ZTE 2020最新4个季度净利润 单位：亿元
    private static final double ZTE_Total_Profit_2020 = 36.77 + 18.57;

    public static void main(String[] args) {
        // DCF模型计算中兴市值
        computeDCFModelForZTE();

        // PE模型计算中兴市值
        computePEModelForZTE();

    }

    /**
     * DCF模型计算
     */
    private static void computeDCFModelForZTE() {
        // 定义DCF模型ZTE的估值
        double ZTESum;
        // 第一部分：前Asset_Year年的自由现金流总和
        double totalFreeCashFlow = 0.0;
        // 第二部分：Asset_Year年后的永续现值
        double continueCashValue;
        // 当前ZTE自由现金流 单位：亿元
        double currentFreeCashFlowValue = Cash_Flow_Unit_Stock * Total_Stock_Num;

        for (int i = 1; i <= Asset_Year; i++) {
            totalFreeCashFlow = totalFreeCashFlow + currentFreeCashFlowValue * Math.pow((1 + Before_Cash_Flow_Rate), i-1) / Math.pow((1 + Discount_Rate), i);
        }

        continueCashValue = currentFreeCashFlowValue * Math.pow((1 + Before_Cash_Flow_Rate), Asset_Year - 1) * (1 + After_Cash_Flow_Rate) / (Discount_Rate - After_Cash_Flow_Rate) / Math.pow((1 + Discount_Rate), Asset_Year);

        ZTESum = totalFreeCashFlow + continueCashValue;
        System.out.println("采用简化DCF模型后，在" + Asset_Year + "年后ZTE的估值为：" + ZTESum + "亿元");
    }

    /**
     * PE模型计算
     */
    private static void computePEModelForZTE() {
        // 静态市盈率
        double staticPriceEarningsRatio = ZTE_Stock_Unit_Price / ZTE_Stock_Unit_Profit_2019;
        // 动态市盈率
        //double dynamicPriceEarningsRatio = ZTE_Stock_Unit_Price / ZTE_Stock_Unit_Profit_2019;
        // 滚动市盈率
        double rollPriceEarningsRatio = ZTE_Stock_Unit_Price / ZTE_Stock_Unit_Profit_2020;

        // 静态市盈率的ZTE估值
        double staticZTEMarketValue = staticPriceEarningsRatio * ZTE_Total_Profit_2019;
        // 滚动市盈率的ZTE估值
        double rollZTEMarketValue = rollPriceEarningsRatio * ZTE_Total_Profit_2020;

        System.out.println("采用PE模型，由静态市盈率估算ZTE的市值为：" + staticZTEMarketValue + "亿元");
        System.out.println("采用PE模型，由滚动市盈率估算ZTE的市值为：" + rollZTEMarketValue + "亿元");
    }
}

```

```
结果输出：
采用DCF模型后，在10年后ZTE的估值为：3908.752099463275亿元
采用PE模型，由静态市盈率估算ZTE的市值为：1729.2260261695644亿元
采用PE模型，由滚动市盈率估算ZTE的市值为：1728.8848878886388亿元
```

## 参考文献<br>

[1]https://www.wallstreetprep.com/knowledge/dcf-model-training-6-steps-building-dcf-model-excel/<br>
[2]https://en.wikipedia.org/wiki/Discounted_cash_flow<br>
[3]https://xueqiu.com/2157290832/72323357<br>
[4]http://www.iwencai.com/stockpick/search?typed=1&preParams=&ts=1&f=3&qs=pc_%7Esoniu%7Estock%7Estock%7Eimagine%7Equery&selfsectsn=&querytype=stock&searchfilter=&tid=stockpick&w=%E4%B8%AD%E5%85%B4%E9%80%9A%E8%AE%AF<br>
[5]https://res-www.zte.com.cn/mediares/zte/Investor/20200828/C3.pdf<br>
[6]https://pdf.dfcfw.com/pdf/H2_AN202003271377073499_1.pdf<br>
[7]https://en.wikipedia.org/wiki/Price%E2%80%93earnings_ratio<br>

