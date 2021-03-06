"use strict";

var mapUtil = (function () {
    var self = {};

    var _seoulLatLng = new daum.maps.LatLng(37.566535, 126.977969);

    self.createMap = function () {
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div
            mapOption = {
                center: _seoulLatLng, // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

        var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

        return map;
    };

    self.createMarker = function (map, positions) {

        for (var i = 0; i < positions.length; i++) {
            // 마커를 생성합니다
            var marker = new daum.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: positions[i].latlng // 마커의 위치
            });

            // 마커에 표시할 인포윈도우를 생성합니다
            var infowindow = new daum.maps.InfoWindow({
                content: positions[i].content, // 인포윈도우에 표시할 내용
                removable: true
            });

            // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
            // 이벤트 리스너로는 클로저를 만들어 등록합니다
            // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
            daum.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindow));
        }

        function makeClickListener(map, marker, infowindow) {
            return function () {
                infowindow.open(map, marker);
            };
        }
    };

    self.moveToCurrentPosition = function (map) {
        _getCurrentPosition(function (position) {
            map.panTo(position);
        });
    };

    var _getCurrentPosition = function (callback) {
        // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude, // 위도
                    lon = position.coords.longitude; // 경도

                var locPosition = new daum.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

                callback(locPosition);
            });
        }
        // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
        else {
            console.log("geoLocation을 사용할 수 없습니다.");
            callback(_seoulLatLng);
        }
    };

    return self;
})();


var seoulBikeUtil = (function () {
    var self = {};

    self.getStationStatus = function (callback) {

        var url = "/status";
        var successCallback = function (data) {
            console.log(data);

            var rawRealtimeList = data.realtimeList;
            var positions = [];
            for (var idx = 0; idx < rawRealtimeList.length; idx++) {
                var rawPosition = rawRealtimeList[idx];

                var position = {
                    id: rawPosition.stationId,
                    name: rawPosition.stationName,
                    latitude: Number(rawPosition.stationLatitude),
                    longitude: Number(rawPosition.stationLongitude),
                    rackCount: rawPosition.rackTotCnt,
                    bikeCount: rawPosition.parkingBikeTotCnt
                };

                positions.push({
                    content: '<div style="padding:5px;">' + position.name + '<br>' + position.bikeCount + '/' + position.rackCount + '</div>',
                    latlng: new daum.maps.LatLng(position.latitude, position.longitude)
                });
            }

            callback(positions);
        };

        $.getJSON(url, successCallback);
    };

    return self;
})();

(function () {

    var map = mapUtil.createMap();
    seoulBikeUtil.getStationStatus(function (positions) {
        mapUtil.createMarker(map, positions);
    });

    $(".map_current_position_control").on("click", function () {
        mapUtil.moveToCurrentPosition(map);
    });

})();