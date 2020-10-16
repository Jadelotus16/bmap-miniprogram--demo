<template>
    <!--<view>
        <view class="map_container">
            <map class="map" id="map" :longitude="longitude" :latitude="latitude" scale="14" show-location="true"
                 :markers="markers" @markertap="makertap"></map>
        </view>
        <view class="rgc_info">
            <text>{{rgcData.address}}</text>
            <text>{{rgcData.desc}}</text>
            <text>{{rgcData.business}}</text>
        </view>
    </view>-->
    <web-view src="../mapWeb/map-web.html"></web-view>
</template>

<script>
    // 引用百度地图微信小程序JSAPI模块
    var bmap = require('../../libs/bmap-wx.js');
    var wxMarkerData = [];

    export default {
        name: 'map',
        data() {
            return {
                markers: [],
                latitude: '',
                longitude: '',
                rgcData: {}
            }
        },
        onLoad() {
            var that = this;
            // 新建百度地图对象
            var BMap = new bmap.BMapWX({
                ak: this.$mayKey
            });
            var fail = function (data) {
                console.log(data)
            };
            var success = function (data) {
                wxMarkerData = data.wxMarkerData;
                that.markers = wxMarkerData;
                that.latitude = wxMarkerData[0].latitude;
                that.longitude = wxMarkerData[0].longitude;
            };
            // 发起regeocoding检索请求
            BMap.regeocoding({
                fail: fail,
                success: success,
                iconPath: '../../static/map/marker.png',
                iconTapPath: '../../static/map/marker_active.png',
                width: '30px',
                height: '30px',
            });
        },
        methods: {
            makertap: function (e) {
                var that = this;
                var id = e.markerId;
                that.showSearchInfo(wxMarkerData, id);
            },
            showSearchInfo: function (data, i) {
                var that = this;
                that.rgcData = {
                    address: '地址：' + data[i].address + '\n',
                    desc: '描述：' + data[i].desc + '\n',
                    business: '商圈：' + data[i].business
                };
            },
        }
    }

</script>

<style>
    .map_container {
        height: 100vh;
        width: 100vw;
    }

    .map {
        height: 100%;
        width: 100%;
    }
</style>
