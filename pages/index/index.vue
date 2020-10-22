<template>
    <map id="allmap" class="allmap" :latitude="latitude" :longitude="longitude" :markers="covers" :scale="5"
         @regionchange="regionChange">
    </map>
</template>
<script>
    import mapUtils from "../../static/js/mapUtils";

    export default {
        data() {
            return {
                id: 0, // 使用 marker点击事件 需要填写id
                title: 'map',
                latitude: 32.041544,
                longitude: 118.767413,
                covers: [{
                    latitude: 39.909,
                    longitude: 116.39742,
                    iconPath: '../../static/map/marker.png',
                    width: '30px',
                    height: '30px',
                }, {
                    latitude: 39.90,
                    longitude: 116.39,
                    iconPath: '../../static/map/marker.png',
                    width: '30px',
                    height: '30px',
                }],
                allmap: null,
                mapInfo: {},
                lastEvent: '',

            }
        },
        onReady() {
            this.mapContext = uni.createMapContext('allmap');
        },
        onLoad() {
            // let event = {type: 'end', causedBy: 'drag'};
            // this.regionChange(event);
        },
        methods: {
            regionChange(e) {
                console.log('index.vue regionChange type:', e.type, ', causedBy:', e.causedBy, ', centerLocation:', e.target.centerLocation);
                if (e.type == 'end') {
                    if (e.causedBy == 'drag') {//这里直接从e参数中获取当前中心点的经纬度，并更新地图的latitude和longitude
                        this.mapInfo.lat = e.target.centerLocation.latitude.toFixed(6);//经纬度保留6位小数，避免小数点过多导致的地图重复刷新
                        this.mapInfo.lng = e.target.centerLocation.longitude.toFixed(6);
                    }
                    //只有当地图缩放或者前一次事件为update且当前事件为update时，才调用markerCluster函数
                    // if ((this.lastEvent == 'update' && e.causedBy == 'update') || e.causedBy == 'scale') {
                    mapUtils.clusterFunc.call(this);//防抖函数，调用了markerCluster
                    // }
                    this.lastEvent = e.causedBy;
                }
            },
        }
    }
</script>

<style>
    .allmap {
        width: 100vw;
        height: 100vh;
    }
</style>