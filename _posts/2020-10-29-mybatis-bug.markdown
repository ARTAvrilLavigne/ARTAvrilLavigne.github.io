---
layout:     post
title:      "mybatis踩坑记录"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-10-29 22:45:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - javaee
---
## 一、mybatis遇坑记录<br>

### 1.1、问题说明<br>

　　这两周做维保平台的报表记录模块的需求，遇到mybatis的一个隐藏的大坑BUG。一一检查数据库以及mybatis的xml配置与mapper文件都是正确的，并且别人写的配置查询模块的sql方法都正常执行，我写的报表模块就是出问题，在断点下运行到执行mapper的sql方法时一直都是报错，不管是增删改查的方法都会报错，报错记录例如为：org.apache.ibatis.binding.BindingException:Invalid  bound  statement  (not found):  com.huawei.neteco.reportManagement.ds.reportVoMapper.insert<br>

```
dao_services.xml中配置数据库mapper、数据源以及事务管理等信息
mybatis-config.xml中配置数据库连接插件

mybatis-config.xml为：
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD SQL MAP Config 3.1//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="callSettersOnNulls" value="true"/>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

    <plugins>
        <plugin interceptor="com.huawei.neteco.plat.persistence.plugin.mybatis.DasInterceptor"></plugin>
    </plugins>

</configuration>
===============================================================================================
dao_services.xml为：
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/tx
    http://www.springframework.org/schema/tx/spring-tx.xsd" default-lazy-init="false" default-autowire="byName">

    <bean id="reportDataSource" class="com.huawei.bsp.mybatis.datasource.BspDataSource"></bean>

    <bean id="reportSqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="reportDataSource"/>
        <property name="configLocation" value="classpath:META-INF/mybatis/mybatis-config.xml"/>
        <property name="mapperLocations" value="classpath:META-INF/mybatis/zenith/ReportTaskVoMapper.xml"/>
    </bean>

    <bean id="reportSqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg index="0" ref="reportSqlSessionFactoryBean"/>
    </bean>

    <bean id="reportTaskVoMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
        <property name="mapperInterface" value="com.huawei.neteco.warranty.reportmanagement.ds.mapper.ReportTaskVoMapper"/>
        <property name="sqlSessionTemplate" ref="reportSqlSessionTemplate"/>
    </bean>


    <!--事务管理-->
    <bean id="reportTransactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="reportDataSource"/>
    </bean>

    <tx:annotation-driven transaction-manager="reportTransactionManager"/>

</beans>
```

### 1.2、问题原因<br>

　　网上直接查找这种报错相关很多博客五花八门，试了很多都没有解决。最终在有经验的同事的帮助下，找到了问题的原因，由于项目工程是maven构建的多模块工程，mybatis配置文件没有选择集中配置在service模块或者deployment模块中，而是选择分别在两个子业务模块报表模块和配置查询模块中各自配置mybatis的mapper类与mapper.xml和mybatis-config.xml，问题就出在mybatis-config.xml中配置的classpath路径问题，在报表模块中此处配置的是classpath:xxxxx/\*.xml扫描此模块中resource路径下的各mapper.xml文件，但是另一个配置查询模块也是这样配置的。但这两处classpath配置在微服务运行后，报表模块就是会出问题扫描不到该模块的mapper.xml文件导致运行一直报错找不到有效语句。<br>

### 1.3、问题解决<br>

　　解决办法就是不用星号通配符，将报表模块mybatis-config.xml中classpath配置改为classpath:META-INF/mybatis/zenith/ReportTaskVoMapper.xml，使用具体的xml文件名即可。<br>
　　我又继续尝试将两个子模块的dao_services.xml中classpath后增加一个星号使用通配符格式成功执行了，说明应该是子模块加载时配置查询模块先加载其路径下mapper.xml后续下一个模块就不生效了，因为classpath后没有星号只扫描该模块导致出现这种情况，如下所示：<br>

```
<property name="mapperLocations" value="classpath*:META-INF/mybatis/zenith/*"/>
```

## 参考文献<br>
[1]https://blog.csdn.net/baidu_41885330/article/details/82110686<br>
[2]https://blog.csdn.net/Yaoman753/article/details/102881047<br>
[3]https://blog.csdn.net/qq_44823091/article/details/99663548<br>
[4]https://blog.csdn.net/rocklee/article/details/95727507<br>
