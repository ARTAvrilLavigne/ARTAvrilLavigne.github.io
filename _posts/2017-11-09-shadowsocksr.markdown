---
layout:     post
title:      "搭建shadowsocksR"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2017-11-09 15:23:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - VPN
---
## 1、租用云服务器  
　　选择digitalocean:https://cloud.digitalocean.com  
　　**我选择的是旧金山机房，ubuntu17.10 X64版本,Server Hostname填写的是avrillavigne,其余均不用填写。**  
## 2、一键安装脚本(python版)  
本脚本适用环境：<br>
系统支持：CentOS，Debian，Ubuntu<br>
内存要求：≥128M<br>

<p><strong>关于本脚本：</strong><br />
一键安装 ShadowsocksR 服务端。<br />
请下载与之配套的客户端程序来连接。<br />
（以下客户端只有 <a href="https://github.com/shadowsocksr-backup/shadowsocksr-csharp/releases">Windows 客户端</a>和 <a href="https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/Python-client">Python 版客户端</a>可以使用 SSR 新特性，其他原版客户端只能以兼容的方式连接 SSR 服务器）</p>
<p><strong>默认配置：</strong><br />
服务器端口：自己设定（如不设定，默认为 8989）<br />
密码：自己设定（如不设定，默认为 teddysun.com）<br />
加密方式：自己设定（如不设定，默认为 aes-256-cfb）<br />
协议（Protocol）：自己设定（如不设定，默认为 origin）<br />
混淆（obfs）：自己设定（如不设定，默认为 plain）</p>
<!--more-->
<p><strong>客户端下载：</strong><br />
<a href="https://github.com/shadowsocksr-backup/shadowsocksr-csharp/releases">Windows</a> / <a href="https://github.com/shadowsocks/shadowsocks-iOS/wiki/Shadowsocks-for-OSX-Help">OS X</a><br />
<a href="https://github.com/librehat/shadowsocks-qt5">Linux</a><br />
<a href="https://github.com/shadowsocks/shadowsocks-android">Android</a> / <a href="https://github.com/shadowsocks/shadowsocks-iOS/wiki/Help">iOS</a><br />
<a href="https://github.com/shadowsocks/openwrt-shadowsocks">OpenWRT</a></p>
<p><strong>使用方法：</strong><br />
使用root用户登录，运行以下命令：</p>
<pre><code>wget --no-check-certificate https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocksR.sh
chmod +x shadowsocksR.sh
./shadowsocksR.sh 2&gt;&amp;1 | tee shadowsocksR.log
</code></pre>
<p>安装完成后，脚本提示如下：</p>
<pre><code>Congratulations, ShadowsocksR server install completed!
Your Server IP        :your_server_ip
Your Server Port      :your_server_port
Your Password         :your_password
Your Protocol         :your_protocol
Your obfs             :your_obfs
Your Encryption Method:your_encryption_method

Welcome to visit:https://shadowsocks.be/9.html
Enjoy it!
</code></pre>
<p><strong>卸载方法：</strong><br />
使用 root 用户登录，运行以下命令：</p>
<pre><code>./shadowsocksR.sh uninstall
</code></pre>
<p>安装完成后即已后台启动 ShadowsocksR ，运行：</p>
<pre><code>/etc/init.d/shadowsocks status
</code></pre>
<p>可以查看 ShadowsocksR 进程是否已经启动。<br />
本脚本安装完成后，已将 ShadowsocksR 自动加入开机自启动。</p>
<p><strong>使用命令：</strong><br />
启动：/etc/init.d/shadowsocks start<br />
停止：/etc/init.d/shadowsocks stop<br />
重启：/etc/init.d/shadowsocks restart<br />
状态：/etc/init.d/shadowsocks status</p>
<p>配置文件路径：/etc/shadowsocks.json<br />
日志文件路径：/var/log/shadowsocks.log<br />
代码安装目录：/usr/local/shadowsocks</p>
<p><strong>多用户配置示例：</strong></p>
<pre><code>{
&quot;server&quot;:&quot;x.x.x.x&quot;,
&quot;server_ipv6&quot;: &quot;[::]&quot;,
&quot;local_address&quot;:&quot;127.0.0.1&quot;,
&quot;local_port&quot;:1080,
&quot;port_password&quot;:{
    &quot;8989&quot;:&quot;password1&quot;,
    &quot;8990&quot;:&quot;password2&quot;,
    &quot;8991&quot;:&quot;password3&quot;
},
&quot;timeout&quot;:60,
&quot;method&quot;:&quot;aes-256-cfb&quot;,
&quot;protocol&quot;: &quot;origin&quot;,
&quot;protocol_param&quot;: &quot;&quot;,
&quot;obfs&quot;: &quot;plain&quot;,
&quot;obfs_param&quot;: &quot;&quot;,
&quot;redirect&quot;: &quot;&quot;,
&quot;dns_ipv6&quot;: false,
&quot;fast_open&quot;: false,
&quot;workers&quot;: 1
}
</code></pre>
<p>如果你想修改配置文件，请参考：<br />
<a href="https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/Server-Setup">https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/Server-Setup</a><br />
<a href="https://github.com/shadowsocksr-backup/shadowsocks-rss/blob/master/ssr.md">https://github.com/shadowsocksr-backup/shadowsocks-rss/blob/master/ssr.md</a><br />
<a href="https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/config.json">https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/config.json</a></p>
<p><strong>更新日志：</strong><br />
2017 年 07 月 27 日：<br />
1、新增：可选协议（protocol）auth_chain_b 。使用该协议需更新到最新版（4.7.0）<a href="https://github.com/shadowsocksr-backup/shadowsocksr-csharp/releases">ShadowsocksR 版客户端</a>；<br />
2、修改：更新 ShadowsocksR 源码下载地址。</p>
<p>2017 年 07 月 22 日：<br />
1、新增：安装时可选 13 种加密方式的其中之一（none 是不加密）。如下所示：</p>
<pre><code>none
aes-256-cfb
aes-192-cfb
aes-128-cfb
aes-256-cfb8
aes-192-cfb8
aes-128-cfb8
aes-256-ctr
aes-192-ctr
aes-128-ctr
chacha20-ietf
chacha20
rc4-md5
rc4-md5-6
</code></pre>
<p>2、新增：安装时可选 7 种协议（protocol）的其中之一。如下所示：</p>
<pre><code>origin
verify_deflate
auth_sha1_v4
auth_sha1_v4_compatible
auth_aes128_md5
auth_aes128_sha1
auth_chain_a
auth_chain_b
</code></pre>
<p>3、新增：安装时可选 9 种混淆（obfs）的其中之一。如下所示：</p>
<pre><code>plain
http_simple
http_simple_compatible
http_post
http_post_compatible
tls1.2_ticket_auth
tls1.2_ticket_auth_compatible
tls1.2_ticket_fastauth
tls1.2_ticket_fastauth_compatible
</code></pre>
<p>2016 年 08 月 13 日：<br />
1、新增多用户配置示例。注意：如果你新增了端口，也要将该端口从防火墙（iptables 或 firewalld）中打开。</p>
<p>2016 年 05 月 12 日：<br />
1、新增在 CentOS 下的防火墙规则设置。</p>
<p><strong><em>参考链接：</em></strong><br />
<a href="https://github.com/shadowsocksr-backup/shadowsocksr">https://github.com/shadowsocksr-backup/shadowsocksr</a></p>
  
    --------------------------------------------------------------------------------------------<br>

## 3、一键安装脚本<br>
　　首先root管理员身份进入/usr/local/<br>
　　下载ShadowsocksR服务端脚本:  
    wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/ssrmu.sh && chmod +x ssrmu.sh && bash ssrmu.sh  
　　下载运行后会提示你输入数字来选择要做什么  
　　输入 1 ，就会开始安装ShadowsocksR服务端，并且会提示你输入Shadowsocks的 端口/密码/加密方式/ 协议/混淆（混淆和协议是通过输入数字选择的） 等参数来添加用户。  
　　注意：用户名不支持中文，如果输入中文会一直保存下去  
　　(不输入回车就是默认参数)  
　　用户 : xxxxxxxx  
　　端口 : 8388  
　　密码 : password  
　　加密 : aes-256-cfb  
　　协议 : auth_sha1_v4_compatible  
　　混淆 : tls1.2_ticket_auth_compatible  
　　设备数限制: 0(无限)  
　　单线程限速: 0 KB/S (不限速)  
　　端口总限速: 0 KB/S (不限速)  
　　禁止的端口 : 无限制  
　　用户总流量 : XXXXXXXXX  

**运行脚本**<br>
    bash ssrmu.sh  

界面如下：  
  ShadowsocksR MuJSON一键管理脚本 [vX.X.X]  
  ---- Toyo | doub.io/ss-jc60 ----  
 
  1. 安装 ShadowsocksR  
  2. 更新 ShadowsocksR  
  3. 卸载 ShadowsocksR  
  4. 安装 libsodium(chacha20)  
————————————  
  5. 查看 账号信息  
  6. 显示 连接信息  
  7. 设置 用户配置  
  8. 手动 修改配置  
  9. 清零 已用流量  
————————————  
 10. 启动 ShadowsocksR  
 11. 停止 ShadowsocksR  
 12. 重启 ShadowsocksR  
 13. 查看 ShadowsocksR 日志  
————————————  
 14. 其他功能(安装BBR和速锐等功能)  
 15. 升级脚本  
 
 当前状态: 已安装 并 已启动  
 
请输入数字 [1-15]：  

**所有操作只用这个一键脚本即可完成**  

**其中安装BBR在14中可以安装、启动、停止**  

　　注意：添加/删除/修改用户配置后，无需重启ShadowsocksR服务端，ShadowsocksR服务端会定时读取数据库文件内的信息，不过修改用户配置后，可能要等个十几秒才能应用最新的配置（因为ShadowsocksR不是实时读取数据库的，所以有间隔时间）。  
　　ShadowsocksR安装后，自动设置为系统服务，所以支持使用服务来启动/停止等操作，同时支持开机启动。  

**不用脚本手动操作**<br>
    启动 ShadowsocksR：/etc/init.d/ssrmu start  
    停止 ShadowsocksR：/etc/init.d/ssrmu stop  
    重启 ShadowsocksR：/etc/init.d/ssrmu restart  
    查看 ShadowsocksR状态：/etc/init.d/ssrmu status  
    
　　ShadowsocksR 默认支持UDP转发，服务端无需任何设置  

　　开始BBR加速：  
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/bbr.sh && chmod +x bbr.sh && bash bbr.sh  

　　下载并运行脚本后，会自动检测并开始安装，首先会提示你输入要下载的内核版本，可以安装自定义版本的内核，也可以直接回车安装最新版本的内核（内核版本获取）！  
　　一直选择keep the local version currently installed。如果没有出错，内核更换完毕后，会提示是否立即重启VPS，直接回车或者输入 Y   

　　需要重启VPS后，才能开启BBR，是否现在重启 ? [Y/n] : y  
　　[注意]  重启VPS后，请重新运行脚本查看BBR是否加载成功 bash bbr.sh status  
　　[信息]  VPS 重启中...  
　　等待十几秒，VPS启动后，重新通过SSH连接VPS，进入 bbr.sh 脚本的目录，然后执行下面这个命令查看BBR是否加载成功。  
    bash bbr.sh status  
　　然后就会自动开启BBR。  

**启动BBR**  
bash bbr.sh start  
 
**关闭BBR**  
bash bbr.sh stop  
 
**查看BBR状态**  
bash bbr.sh status  

注意：关闭BBR，需要重启VPS，所以脚本会提醒是否立即重启VPS  

### 参考教程  
　　『原创』ShadowsocksR MudbJSON模式多用户一键脚本：https://doub.io/ss-jc60/  
　　『原创』Debian/Ubuntu TCP-BBR 一键安装脚本：https://doub.io/wlzy-16/  

　　谷歌学术不能访问问题解决：  
            https://www.polarxiong.com/archives/%E9%80%9A%E8%BF%87VPS%E4%BD%BF%E7%94%A8VPN%E6%88%96ShadowSocks%E8%AE%BF%E9%97%AEGoogle%E6%88%96Google-Schoolar%E5%87%BA%E7%8E%B0%E9%AA%8C%E8%AF%81%E7%A0%81%E7%AD%89%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95.html  

    https://blog.finaltheory.me/note/Solve-Google-Problems.html  

　　使用过上述网址方法但还是不能访问谷歌学术。只能通过谷歌学术镜像访问：http://ac.scmor.com/


