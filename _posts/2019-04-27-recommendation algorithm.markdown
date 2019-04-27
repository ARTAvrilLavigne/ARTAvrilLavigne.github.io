---
layout:     post
title:      "常用推荐算法介绍"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2019-04-27 19:50:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - bigdata
---
## 一、余弦公式<br>
<p>　　常用的推荐算法分为：基于内容的推荐、基于内容的协同过滤、基于用户的协同过滤、基于标签的推荐。</p>
<p>　　量化两个事物的相似度,这是推荐系统需要多次面临的问题。我们知道向量的概念，可以形象化地表示为带箭头的线段。二维空间向量表示方法为：<img  src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/1.png?raw=true" alt="" width="60" height="18" /></p>
<p>多维空间向量表示为：<img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/2.png?raw=true" alt="" width="114" height="18" /></p>
<p>　　比如，假设用户有5个维度：</p>
<ol>
<li>对IU的喜欢程度（1~5分）</li>
<li>对佐佐木希的喜欢程度（1~5分）</li>
<li>对Avril Lavigne的喜欢程度（1~5分）</li>
<li>对韩剧的喜欢程度（1~5分）</li>
<li>对996工作制的喜欢程度（1~5分）</li>
</ol>
<ul>  
<!-- 同一行并排三张图片的格式写法 -->
<table>
    <tr>
        <td><center><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/IU.jpg?raw=true" width="170" height="180"></center></td>
        <td><center><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/sasaki.jpg?raw=true" width="180" height="180"></center></td>
        <td><center><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/avril.jpg?raw=true" width="150" height="180"></center></td>
    </tr>
</table>  
<li><strong>一个用户A</strong>：对IU的喜欢程度3，对佐佐木希的喜欢程度1，对Avril Lavigne的喜欢程度4，对韩剧的喜欢程度5，对996工作制的喜欢程度0，用户A可以用向量表示为：<img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/3.png?raw=true" alt="" width="100" height="18" /></li>
<li><strong>一个用户B</strong>：对IU的喜欢程度3，对佐佐木希的喜欢程度4，对Avril Lavigne的喜欢程度5，对韩剧的喜欢程度0，对996工作制的喜欢程度2，用户B可以用向量表示为：<img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/4.png?raw=true" alt="" width="101" height="18" /></li>
</ul>
<p>　　既然我们把这两个用户表示为向量，那么可以考虑向量怎么判断相似性。即看这两个向量的夹角。夹角约小，则相似度越大。</p>
<p>　　对于向量<img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/5.png?raw=true" alt="" width="132" height="18" />和<img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/6.png?raw=true" alt="" width="132" height="18" />而言，他们的在多维空间的夹角可以用向量余弦公式计算：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/7.png?raw=true" alt="" width="218" height="44" /></p>
<p>　　余弦相似度的值本身是一个0~1的值，0代表完全正交，1代表完全一致。就刚才用户A和用户B的例子而言，我们可以知道他们的相似度为：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/8.png?raw=true" alt="" width="384" height="40" /></p>
<p>　　余弦公式本身应用范围很广，量化相似度在搜索推荐，商业策略中都是常见问题，余弦公式是很好的解决方案。就推荐本身而言，计算内容的相似度，计算用户的相似度，计算用户类型的相似度，计算内容类型的相似度，这些都是可以应用的场景。</p>  

## 二、推荐的本质<br>
<p>　　推荐和搜索本质有相似的地方。搜索满足用户从海量数据中迅速找到自己感兴趣内容的需求，属于用户主动获取。推荐则是系统从海量数据中根据获取到的用户数据，猜测用户感兴趣的内容并推荐给用户，属于系统推荐给用户。本质上都是为了在这个信息过载的时代，帮助用户找到自己感兴趣的东西。</p>
<p>　　推荐系统有很多种形式。运营或者编辑筛选出自己认为最好的内容放在首页，广义上讲这也是一种推荐。这里主要介绍四类常见的推荐方法：</p>
<ul>
<li>1、基于内容的推荐</li>
<li>2、基于内容的协同过滤</li>
<li>3、基于用户的协同过滤</li>
<li>4、基于标签的推荐</li>
</ul>  

## 三、基于内容的推荐<br>
<p>　　基于内容的推荐是基础的推荐策略。如果你浏览或购买过某种类型的内容，则给你推荐这种类型下的其他内容。</p>
<p>　　以电影推荐为例。比如我刚看完的漫威系列大结局《复仇者联盟4：终结之战》，则系统会关联数据库中复仇者联盟的信息。系统会推荐安东尼·罗素导演的其他作品，比如《美国队长3》；系统会推荐主演小罗伯特·唐尼的其他作品，比如《钢铁侠3》。</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/15.webp?raw=true" alt=""/></p>
<p>　　如果这个电影系统的数据被很好地分类，那么推荐系统也会给用户推荐这个分类下的其他作品。复仇者联盟如果被归为科幻作品，那么可能会推荐其他科幻作品，比如《阿凡达》。</p>
<p>　　基于内容的推荐好处在于易于理解，但是坏处是推荐方式比较依赖于完整的内容知识库的建立。如果内容格式化比较差，那么基于内容的推荐就无法实行。同时如果用户留下的数据比较少，则推荐效果很差，因为无法扩展。</p>  

## 四、基于内容的协同过滤<br>
<p>　　协同过滤（Collaborative Filtering）与传统的基于内容过滤直接分析内容进行推荐不同，协同过滤会分析系统已有数据，并结合用户表现的数据，对该指定用户对此信息的喜好程度预测。</p>
<p>　　基于内容的协同过滤（item-based CF），通过用户对不同内容的评分来评测内容之间的相似性，基于内容之间的相似性做出推荐；最典型的例子是著名的“啤酒加尿布”，就是通过分析知道啤酒和尿布经常被米国爸爸们一起购买，于是在尿布边上推荐啤酒，增加了啤酒销量。</p>
<p>　　需要计算用户u对物品j的兴趣，公式如下：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/9.png?raw=true" alt="" width="125" height="39" /></p>
<p>　　这里N(u)表示用户有关联的商品的集合，wji表示物品j和i的相似度，rui表示用户u对物品i的打分，示例如下：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/10.png?raw=true" alt="" width="600" height="309" /></p>
<p>　　这里还有两个问题没有仔细描述，如何打分，如何计算相似度。</p>
<p>　　打分的话需要根据业务计算，如果有打分系统最好，没有打分系统，则需要根据用户对这个物品的行为得到一个分数。</p>
<p>　　计算相似度除了之前我们提到的余弦公式，还可以根据其他的业务数据。比如对于网易云音乐而言，两首歌越多的被加入两个歌单，可以认为两首歌越相似。对于亚马逊而言，两个商品越多的被同时购买，则认为两个商品相似。这里其实是需要根据产品的具体情况进行调整。</p>  

## 五、基于用户的协同过滤<br>
<p>　　基于用户的协同过滤（user-based CF），通过用户对不同内容的行为，来评测用户之间的相似性，基于用户之间的相似性做出推荐。这部分推荐本质上是给相似的用户推荐其他用户喜欢的内容，一句话概括就是：和你类似的人还喜欢下列内容。</p>
<p>　　需要计算用户u对物品i的兴趣，公式如下（可以和基于物品的协同过滤仔细对比）：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/11.png?raw=true" alt="" width="126" height="39" /></p>
<p>　　这里N(i)表示对物品i有过行为的用户集合，w_uv使用用户u和用户v的相似度，r_vi表示用户v对物品i的打分，示例如下：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/12.png?raw=true" alt="" width="600" height="305" /></p>
<p>　　同样的，这里计算相似度如果用到余弦公式，其实最主要的是选好维度。对于音乐而言，可能是每首歌都作为一个维度，对于电商而言，也可以是每个商品都是一个维度。当然，用一些可理解的用户标签作为维度也是可以的。</p>  

## 六、基于标签的推荐<br>
<p>　　标签系统相对于之前的用户维度和产品维度的推荐，从结构上讲，其实更易于理解一些，也更容易直接干预结果一些。关于tag和分类，基本上是互联网有信息架构以来就有的经典设计结构。内容有标签，用户也会因为用户行为被打上标签。通过标签去关联内容。</p>
<p>　　需要计算用户u对物品i的兴趣，公式如下（可以和基于物品的协同过滤仔细对比）：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/13.png?raw=true" alt="" width="137" height="39" /></p>
<p>　　这里N(u.,i)表示用户u和物品i共有的标签，w_uk使用用户u和标签k的关联度，r_ki表示标签k和物品i的关联性分数，示例如下：</p>
<p align="center"><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-04-27-recommendation%20algorithm/14.png?raw=true" alt="" width="600" height="304" /></p>
<p>　　标签查找的方法这里有很大可以发挥的空间，比如，通过知识库进行处理，或者语义分析处理。而对于一些设计之初就有标签概念的网站，就比较容易，比如豆瓣和知乎。对于知乎而言，公共编辑的标签是天然的标签内容，对于知乎的用户而言，浏览回答关注等行为则是天然的用户标签素材。</p>  

## 七、总结<br>
<p>　　对于推荐而言，这几种基本的方法彼此之前都有些应用场景的差别：比如基于知识的推荐，这是比较老旧的推荐方法，但是对于系统和结构比较好的内容，则低成本且高效。比如基于内容的协同过滤，就适用于内容比较有限，但是用户数特别多的情况，比如电商公司。比如基于用户的协同过滤，则比较容易根据用户的兴趣点，发觉热点内容，比如新闻门户。对于基于标签的推荐，有标签系统的很占便宜，它在灵活性和可控制性上都好一些，但是做好很难。</p>  
