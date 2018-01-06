---
layout:     post
title:      "springsource-tool-suite插件安装"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2018-01-06 16:12:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - javaee
---  
## 一、插件版本 ##  
　　插件官网：http://spring.io/tools/sts/all<br>
　　官网页面中Spring Tool Suite™ Downloads是集成springsource-tool-suite插件的eclipse安装包(所以可以使用这种集成插件的eclipse直接搞定)<br>
　　官网页面中Update Site Archives是下载springsource-tool-suite插件的离线安装包栏<br>
　　官网页面中Update Sites是eclipse中在线更新的插件地址栏<br>
  
　　首先找到eclipse的版本号以及适合此版本的springsource-tool-suite插件。<br>
　　我的eclipse版本为Version: Mars.2 Release (4.5.2)<br>
　　适合我的eclipse版本的插件为：3.8.4 (通过在eclipse的Eclipse Marketplace中搜索sts，结果显示适合版本为3.8.4)<br>
  

## 二、安装 ##  
　　方法一：在线安装<br>
　　在eclipse中菜单栏选择Help->Install New Software，点击弹出框右侧的Add按钮，在Location中指定地址为STS官网的在线安装地址(可以按版本推测)，例如我的eclipse版本的安装地址：http://dist.springsource.com/release/TOOLS/update/e4.5/<br>
　　一般只选择带Spring IDE后缀的安装，然后最下面选择不自动更新(去掉勾 contact all update sites during install to find required software)，最后一路next就行了。缺点：在线安装,比较方便,但耗时较长<br>
  
　　方法二：使用Eclipse Marketplace在线安装<br>
　　在Eclipse Marketplace中搜索sts，在搜索结果点击install即可。然后弹出复选框会自动全部选中，直接点击按钮“Confirm”。便开始漫长的安装过程，中间可能会弹出一个对话框，根据提示点击确认即可。缺点：耗时较长<br>
  
　　方法三：离线安装<br>
　　找到"Update Site Archives"一栏，选择一个鼠标右键复制链接进行拼接找到正确的地址。<br>
例如：http://download.springsource.com/release/TOOLS/update/3.9.2.RELEASE/e4.7/springsource-tool-suite-3.9.2.RELEASE-e4.7.2-updatesite.zip<br>
　　由于我的eclipse版本为4.5.2，插件版本为3.8.4。故所需的地址改为：<br>
http://download.springsource.com/release/TOOLS/update/3.8.4.RELEASE/e4.5/springsource-tool-suite-3.8.4.RELEASE-e4.5.2-updatesite.zip<br>

　　在eclipse中菜单栏选择Help->Install New Software，点击弹出框右侧的Add按钮，在Location中指定此zip压缩包的路径，即可进入到安装界面，然后最下面选择不自动更新(去掉勾 contact all update sites during install to find required software)，同样也是一般选择带IDE的项进行安装，最后一路next就行了。<br> 