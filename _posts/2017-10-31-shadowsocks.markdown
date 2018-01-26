---
layout:     post
title:      "搭建shadowsocks"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2017-10-31 14:41:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - VPN
---
## 1、租用云服务器  
　　选择vultr:https://my.vultr.com/  
　　备注：Vultr是一家提供日本、美国、欧洲等多个国家和地区机房的VPS主机商，硬盘都是采用SSD，VPS主机都是KVM架构，VPS配置最少的内存512MB、硬盘为15GB的VPS只要2.5美元/月（2017.3.2修改），vultr是根据VPS使用小时来计费（0.007/h,折合人民币4分6/小时）的，使用多长时间就算多长时间，计费对应的款。Vultr是KVM系统架构，目前已开通15个机房，比较适合国内的是日本东京（tokyo）,美国洛杉矶（ Los Angeles ），美国西雅图（ Seattle ）这三个机房相对国内线路较好。vultr支持使用支付宝（Alipay）付款。  
　　**我选择的是洛杉矶机房，ubuntu17.10 X64版本,Server Hostname & Label填写的是avrillavigne,其余均不用填写。**  
　　**推荐**:如果是学生，可以使用github学生包。用学校的学生邮箱进行github认证就可以得到DigitalOcean的优惠码--50刀(要预先给digitalocean账户充值5美元)。  
　　DigitalOcean官网:https://cloud.digitalocean.com  
## 2、连接VPS  
　　使用xshell登录服务器，新建用户对话，填入服务器IP地址，用户名root,密码服务器所给的password。首先进入测试工具地址：http://ping.chinaz.com ping一下服务器IP是否被墙(如果被墙重新删掉换一个服务器IP)。这些都正常的话，出现connection failed连接失败，则关闭windows下的防火墙即可成功登录。  

## 3、一键安装脚本(python版)<br>
本脚本适用环境：<br>
系统支持：CentOS 6，7，Debian，Ubuntu<br>
内存要求：≥128M<br>

默认配置：<br>
服务器端口：自己设定（如不设定，默认为 8989）<br>
密码：自己设定（如不设定，默认为 teddysun.com）<br>
加密方式：自己设定（如不设定，默认为 aes-256-gcm）<br>
备注：脚本默认创建单用户配置文件，如需配置多用户，安装完毕后参照下面的教程示例手动修改配置文件后重启即可。<br>

Shadowsocks for Windows 客户端下载：<br>
https://github.com/shadowsocks/shadowsocks-windows/releases<br>

<p><strong>使用方法：</strong><br />
使用root用户登录，运行以下命令：</p>
<pre><code>wget --no-check-certificate -O shadowsocks.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh
chmod +x shadowsocks.sh
./shadowsocks.sh 2&gt;&amp;1 | tee shadowsocks.log
</code></pre>

<p>安装完成后，脚本提示如下：</p>
<pre><code>Congratulations, ShadowsocksR server install completed!
Your Server IP        :your_server_ip
Your Server Port      :your_server_port
Your Password         :your_password
Your Protocol         :your_protocol
Your obfs             :your_obfs
Your Encryption Method:your_encryption_method

Welcome to visit:https://teddysun.com/342.html
Enjoy it!
</code></pre>

<p><strong>卸载方法：</strong><br />
使用 root 用户登录，运行以下命令：</p>
<pre><code>./shadowsocks.sh uninstall
</code></pre>

<p>单用户配置文件示例：<br />
配置文件路径：/etc/shadowsocks.json </p>
<pre><code>{
    "server":"x.x.x.x",
    "server_port":your_server_port,
    "local_address":"127.0.0.1",
    "local_port":1080,
    "password":"your_password",
    "timeout":60,
    "method":"your_encryption_method",
    "fast_open": false
}</code></pre>

<p>多用户多端口配置文件示例：<br />
配置文件路径：/etc/shadowsocks.json </p>
<pre><code>{
    "server":"x.x.x.x",
    "local_address":"127.0.0.1",
    "local_port":1080,
    "port_password":{
         "8989":"password0",
         "9001":"password1",
         "9002":"password2",
         "9003":"password3",
         "9004":"password4"
    },
    "timeout":60,
    "method":"your_encryption_method",
    "fast_open": false
}<code></pre>  

<p>使用命令：<br />
启动：/etc/init.d/shadowsocks start<br />
停止：/etc/init.d/shadowsocks stop<br />
重启：/etc/init.d/shadowsocks restart<br />
状态：/etc/init.d/shadowsocks status</p>  

<p>更多版本 Shadowsocks 服务端一键安装脚本：<br />
<a href="https://shadowsocks.be/9.html" target="_blank">ShadowsocksR 版一键安装脚本（CentOS，Debian，Ubuntu）</a><br />
<a href="https://teddysun.com/357.html" target="_blank">CentOS 下 Shadowsocks-libev 一键安装脚本</a><br />
<a href="https://teddysun.com/358.html" target="_blank">Debian 下 Shadowsocks-libev 一键安装脚本</a><br />
<a href="https://teddysun.com/392.html" target="_blank">Shadowsocks-go 一键安装脚本（CentOS，Debian，Ubuntu）</a></p>  
<p>参考链接：<br />
<a href="https://teddysun.com/339.html">https://teddysun.com/339.html</a></p>  

        -------------------------------------------------------------------------------<br>
## 4、按照github说明安装shadowsocks-libev  
　　github官网地址：https://github.com/shadowsocks/shadowsocks-libev  
　　在VPS上部署shadowsocks，推荐使用C语言编写的基于libev的shadowsocks-libev的服务端。下面介绍在Linux系统的VPS上安装并配置的方法。由于shadowsocks-libev变动频繁，请以shadowsocks-libev的Github页面的readme为准。  
### 4.1、apt-get安装shadowsocks-libev：  
　　#对于Ubuntu 16.10及以上版本则可以直接从Ubuntu的官方repo安装：  
    sudo apt update  
    sudo apt install shadowsocks-libev  
　　#对于Ubuntu 14.04/16.04 版本需要添加作者的PPA：  
    sudo apt-get install software-properties-common -y  
    sudo add-apt-repository ppa:max-c-lv/shadowsocks-libev -y  
    sudo apt-get update  
    sudo apt install shadowsocks-libev  
### 4.2、配置与启动服务  
　　#Edit the configuration file编辑配置文件：  
    sudo vim /etc/shadowsocks-libev/config.json  
    
　　格式说明：  
　　{  
　　"server":"租用服务器IP地址",  
　　"server_port":服务器监听端口(可设为8388),  
　　"local_port":1080(默认本地端口),  
　　"password":"密码",  
　　"method":"aes-256-cfb(可以设置为其它)",  
　　"timeout":60  
　　}  
  
　　#Start the service启动服务端：  
    sudo /etc/init.d/shadowsocks-libev start  

## 5、开启TCP的BBR拥塞算法加速  
    wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh  
    chmod +x bbr.sh  
    ./bbr.sh  

## 可选项  
　　一、使用基于KCP的shadowsocks加速：  
　　#Setup your server  
    server_linux_amd64 -l :21 -t 127.0.0.1:443 --crypt none --mtu 1200 --nocomp --mode normal --dscp 46 & ss-server -s 0.0.0.0 -p 443 -k passwd -m chacha20 -u  
　　#Setup your client  
    client_linux_amd64 -l 127.0.0.1:1090 -r <服务器IP>:21 --crypt none --mtu 1200 --nocomp --mode normal --dscp 46 & ss-local -s 127.0.0.1 -p 1090 -k passwd -m chacha20 -l 1080 -b 0.0.0.0 & ss-local -s <服务器IP> -p 443 -k passwd -m chacha20 -l 1080 -U -b 0.0.0.0  


　　二、设置最大连接数：  
　　#Security Tips  
　　#Although shadowsocks-libev can handle thousands of concurrent connections nicely, we still recommend setting up your server's 
firewall rules to limit connections from each user:  
　　#Up to 32 connections are enough for normal usage：  
    iptables -A INPUT -p tcp --syn --dport ${SHADOWSOCKS_PORT} -m connlimit --connlimit-above 32 -j REJECT --reject-with tcp-reset  

　　中文博客参考地址：https://cokebar.info/archives/767<br>
　　Ubuntu TCP BBR 改进版/增强版：https://moeclub.org/2017/06/24/278/<br>


