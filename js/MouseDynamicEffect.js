/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v1.0.1
 * GitHub: https://github.com/hustcc/canvas-nest.js
 * 网页鼠标动态线条效果的js，增加了移动端不加载，否则影响效果
**/
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    	//说明是安卓/iphone/ipad等移动终端，不加载鼠标动态触击式线条特效js，因为会影响页面查看效果
    	
}else{
    //说明是PC，加载这个js
    //document.write('<script src="/js/MouseDynamicEffect.js"></scr'+'ipt>');//后面这个script的+号连接符是为了避免被外层script标签影响加载
    !function() {
    function n(n, e, t) {
        return n.getAttribute(e) || t
    }
    function e(n) {
        return document.getElementsByTagName(n)
    }
    function t() {
        var t = e("script"),
        o = t.length,
        i = t[o - 1];
        return {
            l: o,
            //zIndex：背景的z-index属性，css属性用于控制所在层的位置, 默认: -1
            z: n(i, "zIndex", -1),
            //opacity： 线条透明度（0~1）, 默认: 0.5
            o: n(i, "opacity", .6),
            //color：线条颜色, 默认: '0,0,0' ；三个数字分别为(R,G,B)，注意用,分割
            c: n(i, "color", "0,0,0"),
            //count：线条的总数量, 默认: 150
            n: n(i, "count", 110)
        }
    }
    function o() {
        a = m.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        c = m.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
    function i() {
        r.clearRect(0, 0, a, c);
        var n, e, t, o, m, l;
        s.forEach(function(i, x) {
            for (i.x += i.xa, i.y += i.ya, i.xa *= i.x > a || i.x < 0 ? -1 : 1, i.ya *= i.y > c || i.y < 0 ? -1 : 1, r.fillRect(i.x - .5, i.y - .5, 1, 1), e = x + 1; e < u.length; e++) n = u[e],
            null !== n.x && null !== n.y && (o = i.x - n.x, m = i.y - n.y, l = o * o + m * m, l < n.max && (n === y && l >= n.max / 2 && (i.x -= .03 * o, i.y -= .03 * m), t = (n.max - l) / n.max, r.beginPath(), r.lineWidth = t / 2, r.strokeStyle = "rgba(" + d.c + "," + (t + .2) + ")", r.moveTo(i.x, i.y), r.lineTo(n.x, n.y), r.stroke()))
        }),
        x(i)
    }
    var a, c, u, m = document.createElement("canvas"),
    d = t(),
    l = "c_n" + d.l,
    r = m.getContext("2d"),
    x = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(n) {
        window.setTimeout(n, 1e3 / 45)
    },
    w = Math.random,
    y = {
        x: null,
        y: null,
        max: 2e4
    };
    m.id = l,
    m.style.cssText = "position:fixed;top:0;left:0;z-index:" + d.z + ";opacity:" + d.o,
    e("body")[0].appendChild(m),
    o(),
    window.onresize = o,
    window.onmousemove = function(n) {
        n = n || window.event,
        y.x = n.clientX,
        y.y = n.clientY
    },
    window.onmouseout = function() {
        y.x = null,
        y.y = null
    };
    for (var s = [], f = 0; d.n > f; f++) {
        var h = w() * a,
        g = w() * c,
        v = 2 * w() - 1,
        p = 2 * w() - 1;
        s.push({
            x: h,
            y: g,
            xa: v,
            ya: p,
            max: 6e3
        })
    }
    u = s.concat([y]),
    setTimeout(function() {
        i()
    },
    100)
} ();

}
