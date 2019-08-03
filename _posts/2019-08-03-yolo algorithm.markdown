---
layout:     post
title:      "YOLO目标检测算法基本使用"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2019-08-03 20:27:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - AI
---
## 一、YOLO算法介绍<br>
<p>　　人类视觉系统快速且精准，只需瞄一眼（You Only Look Once）即可识别图像中物品及其位置。作者用了You Only Look Once的首字母YOLO来表示其算法，相当有趣。YOLO为一种新的目标检测方法，该方法的特点是实现快速检测的同时还达到较高的准确率。作者将目标检测任务看作目标区域预测和类别预测的回归问题。该方法采用单个神经网络直接预测物品边界和类别概率，实现端到端（end to end）的物品检测。同时，该方法检测速非常快，基础版可以达到45帧/s的实时检测；FastYOLO可以达到155帧/s。与当前最好系统相比，YOLO目标区域定位误差更大，但是背景预测的准确性优于当前最好的方法。</p>

<p>　　它可以检测20个Pascal对象类：<strong>人，鸟，猫，牛，狗，马，羊，飞机，自行车，船，巴士，汽车，摩托车，火车，瓶，椅子，餐桌，盆栽植物，沙发，电视/显示器</strong></p>

<p>　　YOLO的网络结构:模型采用卷积网络来提取特征，然后使用全连接层来得到预测值。网络结构参考GooLeNet模型，包含24个卷积层和2个全连接层，如下图所示。对于卷积层，主要使用1x1卷积来做channle reduction，然后紧跟3x3卷积。对于卷积层和全连接层，采用Leaky ReLU激活函数：max(x,0.1x)。但是最后一层却采用线性激活函数。除了上面这个结构，算法原文还提出了一个轻量级版本Fast Yolo，其仅使用9个卷积层，并且卷积层中使用更少的卷积核。</p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/0.png?raw=true"></p>

## 二、YOLO算法的安装及基本使用<br>
<p>环境：ubuntu14.04-64位</p>
<p><strong>第一步、环境准备。创建YOLO算法的一个目录，在该目录下：</strong><br>
<strong>1、安装git工具</strong><br>

<pre>apt-get install git</pre>

<strong>2、安装bunzip2</strong><br>
<pre>apt-get install -y bzip2</pre>

<strong>3、安装gcc</strong><br>
//安装软件列表，因为gcc，g++一般是自带的，安装了软件列表就自然安装上gcc和g++了<br>
<pre>sudo apt-get install build-essential</pre>   
//查看gcc版本<br>
<pre>gcc --version</pre>                          
//查看g++版本<br>
<pre>g++ --version</pre>                         
</p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/3.png?raw=true"></p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/4.png?raw=true"></p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/5.png?raw=true"></p>

<p><strong>第二步、下载安装包并编译</strong><br>
<pre>sudo git clone https://github.com/pjreddie/darknet
cd darknet
make
</pre></p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/8.png?raw=true"></p>

<p><strong>第三步、下载预训练的权重</strong><br>
<pre>wget https://pjreddie.com/media/files/yolov3.weights</pre>
</p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/6.png?raw=true"></p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/7.png?raw=true"></p>

<p><strong>第四步、执行预测</strong><br>
<pre>./darknet detect cfg/yolov3.cfg yolov3.weights data/IU1.jpg

./darknet detect cfg/yolov3.cfg yolov3.weights data/IU2.jpg
</pre></p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/9.png?raw=true"></p>
<p><img src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-08-03%20yolo%20algorithm/10.png?raw=true"></p>



## 三、YOLO算法执行结果<br>



## 四、参考链接<br>
<p>算法官网：https://pjreddie.com/darknet/yolo/<br>
YOLO算法使用一：https://www.cnblogs.com/minsons/p/7905473.html<br>  
YOLO算法使用二：https://www.cnblogs.com/minsons/p/7905488.html<br>
YOLO算法详解：https://blog.csdn.net/xiaohu2022/article/details/79211732<br>
</p>
