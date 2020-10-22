/**
* scale 当前地图的缩放等级
* col 网格的列数
* defaultIcon 聚合点的图标路径
* southwest 可视区域的西南角经纬度
* northeast 可视区域的东北角经纬度
* sourceList marker对象数组
* res 聚合后的marker对象数组
*/
function markerCluster(scale, col, defaultIcon, southwest, northeast, sourceList) {
    if (scale == 5) {//微信小程序的地图scale是3-20，20为最大缩放尺度，不聚合
        return sourceList.map((item, index) => {
            return {
                ...item,
                type: 'single',
                id: new Date().getTime() + index
            }
        })
    }
    let map = new Map();
    let threshold = (northeast.longitude - southwest.longitude) / col;//网格间距
    let x = 0,
        y = 0;
    let cur = null;
    let key = '';
    //遍历marker
    sourceList.forEach(item => {
        x = Math.floor((item.longitude - southwest.longitude) / threshold)//网格列坐标
        y = Math.floor((item.latitude - southwest.latitude) / threshold)//网格行坐标
        key = [x, y].join('_')//以x_y的形式作为key值
        cur = map.get(key)
        if (cur) {
            map.set(key, cur.concat(item))//key值存在则存入marker数组
        } else {
            map.set(key, [item])//key值不存在则创建marker数组
        }
    });
    let res = [];
    let index = 0;
    for (let [k, v] of map) {
        if (v.length == 1) {//该网格只有一个marker，直接推入res
            res.push({
                ...v[0],
                type: 'single',//区分marker是单独点还是聚合点
                id: new Date().getTime() + index
            })
        } else {//多个marker，合并为一个marker
            [x, y] = k.split('_').map(item => parseInt(item))//根据key解析出x和y
            res.push({
                id: new Date().getTime() + index,
                latitude: v.reduce((acc, cur) => {
                    return acc + cur.latitude
                }, 0) / v.length,//平均纬度
                longitude: v.reduce((acc, cur) => {
                    return acc + cur.longitude
                }, 0) / v.length,//平均经度
                type: 'cluster',
                label: {//聚合数量用label显示，通用的属性也可以作为对象出入该函数，看具体需求
                    content: v.length.toString(),//聚合点数量
                    fontSize: 16,
                    padding: 0,
                    color: '#fff000',
                    textAlign: 'left',
                    anchorX: -v.length.toString().length * (16 + 2) / 2 / 2,//为了保证居中，需要往左偏移字体总宽度的一半，而字体宽度大致等于字体高度的一半，但也不是很准确，所以我这边+2
                    anchorY: -34,
                },
                iconPath: defaultIcon,
                width: 40,
                height: 40,
                anchor: {
                    x: .5,
                    y: 1
                }
            })
        }
        index++
    }
    return res;
}

//防抖函数
function rebounce(fn, timeout) {
    let st = null;
    return function () {
        st && clearTimeout(st);
        st = setTimeout(() => {
            st = null;
            fn.call(this, ...arguments);
        }, timeout);
    }
}

const clusterFunc = rebounce(function() {
    this.mapContext.getRegion({//获取可视区域
        success: region => {
            this.mapContext.getScale({//获取缩放等级
                success: res => {
                    let cur = [].concat(this.covers)
                    console.log('mapInfo.markers:', this.covers, ',, res:', res)
                    this.covers.splice(0, this.covers.length);//清空marker
                    markerCluster(res.scale, 5, '/static/map/marker_active.png', region.southwest, region.northeast, cur)
                        .forEach(it => {
                            this.covers.push(it)
                        })
                }
            })
        }
    })
}, 500);


export default {
    rebounce,
    markerCluster,
    clusterFunc,
}