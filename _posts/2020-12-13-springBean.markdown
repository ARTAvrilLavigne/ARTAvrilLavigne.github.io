---
layout:     post
title:      "Spring之Bean的加载过程"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-12-13 19:42:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - javaee
---
## 一、概述<br>

### 1.1、说明<br>

　　Spring 作为 Ioc 框架，实现了依赖注入，由一个中心化的 Bean 工厂来负责各个 Bean 的实例化和依赖管理。各个 Bean 可以不需要关心各自的复杂的创建过程，达到了很好的解耦效果。对Spring 的工作流进行一个粗略的概括，主要为两大环节：<br>
* `解析`:读 xml 配置，扫描类文件，从配置或者注解中获取 Bean 的定义信息，注册一些扩展功能。<br>
* `加载`:通过解析完的定义信息获取 Bean 实例。<br>

## 二、流程概括<br>

　　为了能够很好地理解 Bean 加载流程，省略一些异常、日志和分支处理和一些特殊条件的判断，流程图如下所示：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/1.png?raw=true">
            <img id="springBean" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/1.png?raw=true" alt="springBean"/>
	</a>
</div>

　　从上面的流程图中，可以看到一个 Bean 加载会经历这么几个阶段（用绿色标记）：<br>

* `获取 BeanName`：对传入的 name 进行解析，转化为可以从 Map 中获取到 BeanDefinition 的 bean name。<br>
* `合并 Bean 定义`：对父类的定义进行合并和覆盖，如果父类还有父类，会进行递归合并，以获取完整的 Bean 定义信息。<br>
* `实例化`：使用构造或者工厂方法创建 Bean 实例。<br>
* `属性填充`：寻找并且注入依赖，依赖的 Bean 还会递归调用 getBean 方法获取。<br>
* `初始化`：调用自定义的初始化方法。<br>
* `获取最终的Bean`：如果是 FactoryBean 需要调用 getObject 方法，如果需要类型转换调用 TypeConverter 进行转化。<br>

　　整个流程最为复杂的是对循环依赖的解决，下一节会进行细节分析。<br>
  
## 三、细节分析<br>

### 3.1、转化BeanName<br>

　　解析完配置文件后创建的Map，使用的是 beanName 作为 key。如下DefaultListableBeanFactory：<br>
  
```
/** Map of bean definition objects, keyed by bean name */
private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<String, BeanDefinition>(256);
```

　　BeanFactory.getBean 中传入的 name，有可能是这几种情况：<br>
* `bean name`，可以直接获取到定义 BeanDefinition。<br>
* `alias name`，别名，需要转化。<br>
* `factorybean name, 带 & 前缀`，通过它获取 BeanDefinition 的时候需要去除 & 前缀。<br>

　　为了能够获取到正确的BeanDefinition，需要先对 name 做一个转换，得到 beanName。如下所示：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/2.png?raw=true">
            <img id="beanName" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/2.png?raw=true" alt="beanName"/>
	</a>
</div>

转化类：AbstractBeanFactory.doGetBean如下所示：<br>

```
protected <T> T doGetBean ... {
    ...
    
    // 转化工作 
    final String beanName = transformedBeanName(name);
    ...
}
```

如果是`alias name`，在解析阶段，alias name 和 bean name 的映射关系被注册到 SimpleAliasRegistry 中。从该注册器中取到 beanName。如下SimpleAliasRegistry.canonicalName：<br>

```
public String canonicalName(String name) {
    ...
    resolvedName = this.aliasMap.get(canonicalName);
    ...
}
```

如果是`factorybean name`，表示这是个工厂 bean，有携带前缀修饰符 & 的，直接把前缀去掉。如下BeanFactoryUtils.transformedBeanName：<br>

```
public static String transformedBeanName(String name) {
    Assert.notNull(name, "'name' must not be null");
    String beanName = name;
    while (beanName.startsWith(BeanFactory.FACTORY_BEAN_PREFIX)) {
        beanName = beanName.substring(BeanFactory.FACTORY_BEAN_PREFIX.length());
    }
    return beanName;
}
```

### 3.2、合并RootBeanDefinition<br>

　　从配置文件读取到的 BeanDefinition 是 GenericBeanDefinition。它的记录了一些当前类声明的属性或构造参数，但是对于父类只用了一个`parentName`来记录。<br>

```
public class GenericBeanDefinition extends AbstractBeanDefinition {
    ...
    private String parentName;
    ...
}
```

　　接下来会发现一个问题，在后续实例化 Bean 的时候，使用的 BeanDefinition 是 RootBeanDefinition 类型而非 GenericBeanDefinition。这是为什么？<br>
　　答案很明显，GenericBeanDefinition 在有继承关系的情况下，定义的信息不足：<br>

* 如果不存在继承关系，GenericBeanDefinition 存储的信息是完整的，可以直接转化为 RootBeanDefinition。<br>
* 如果存在继承关系，GenericBeanDefinition 存储的是 增量信息 而不是 全量信息。<br>

　　为了能够正确初始化对象，需要完整的信息才行。需要递归`合并父类的定义`：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/3.png?raw=true">
            <img id="BeanDefinition" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/3.png?raw=true" alt="BeanDefinition"/>
	</a>
</div>

　　如下`AbstractBeanFactory.doGetBean`：<br>

```
protected <T> T doGetBean ... {
    ...
    
    // 合并父类定义
    final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
        
    ...
        
    // 使用合并后的定义进行实例化
    bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
        
    ...
}
```

　　在判断`parentName`存在的情况下，说明存在父类定义，启动合并。如果父类还有父类怎么办？递归调用，继续合并。如下`AbstractBeanFactory.getMergedBeanDefinition`方法：<br>

```
    protected RootBeanDefinition getMergedBeanDefinition(
            String beanName, BeanDefinition bd, BeanDefinition containingBd)
            throws BeanDefinitionStoreException {

        ...
        
        String parentBeanName = transformedBeanName(bd.getParentName());

        ...
        
        // 递归调用，继续合并父类定义
        pbd = getMergedBeanDefinition(parentBeanName);
        
        ...

        // 使用合并后的完整定义，创建 RootBeanDefinition
        mbd = new RootBeanDefinition(pbd);
        
        // 使用当前定义，对 RootBeanDefinition 进行覆盖
        mbd.overrideFrom(bd);

        ...
        return mbd;
    
    }
```

　　每次合并完父类定义后，都会调用`RootBeanDefinition.overrideFrom`对父类的定义进行覆盖，获取到当前类能够正确实例化的**全量信息**。<br>

### 3.3、处理循环依赖<br>




## 参考文献<br>

[1].https://www.jianshu.com/p/9ea61d204559<br>
[2].https://www.cnblogs.com/wyq178/p/11415877.html<br>
[3].https://blog.csdn.net/whp404/article/details/81412417<br>
