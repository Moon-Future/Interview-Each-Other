# Interview-Each-Other
我来面试你，你来面试我，模拟面试一对一

## vue-socket.io
vue-socket.io@3.0.9，vue-socket.io@3.0.8 在 sockets 中的事件无法触发，切换为 vue-socket.io@3.0.7 即可，若直接在 package.json 中更改版本号后安装，有可能因为缓存原因还是会安装为 vue-socket.io@3.0.9，这时将 node_modules 文件夹删除，把 vue-socket.io 从 package.json 中删除，npm i 安装完其它包后再 npm i vue-socket.io@3.0.7 -S 即可。
