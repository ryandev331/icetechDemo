$(document).ready(function() {
    //建立Vue實體，連接view&modal
    var vm = new Vue({
        el: "#dataTable",
        data: {
            urlDatas: ["data/data1.json", "data/data2.json", "data/data3.json"],
            jsonDatas: {
                data1: [],
                data2: [],
                data3: {},
            },
            start: "",
            end: "",
        },
        computed: {
            incluAllData: function() {
                var self = this;
                var data1 = self.jsonDatas["data1"]
                var data2 = self.jsonDatas["data2"]
                var data3 = self.jsonDatas["data3"]
                    //比對data1和data2的key值塞入cell8的key/value
                var incluAllData = data1.map(function(data1Item, idx, obj) {
                    data2.find(function(data2Item) {
                        if (data1Item.key === data2Item.key) {
                            data1Item.cell8 = data2Item.cell8
                        }
                    })
                    return data1Item
                }).map(function(data1Item, idx, obj) {
                    //比對data1和data3的cell4值塞入cell9的key/value
                    var data3Keys = Object.keys(data3)
                    data3Keys.find(function(data3Key) {
                        if (data1Item.cell4 === data3[data3Key].cell4) {
                            data1Item.cell9 = data3[data3Key].cell9
                        }
                    })
                    return data1Item
                })
                return incluAllData
            },
            timeSpend: function() {
                var self = this;
                if (self.end && self.start) {
                    return self.end - self.start;
                }
            }
        },
        methods: {
            getData: function(idx, url) {
                var self = this;
                //封裝ajax取得json資料函式
                $.ajax({
                    url: url, //json檔案位置
                    type: "GET", //請求方式為get
                    dataType: "json", //返回資料格式為json
                    success: function(data) { //請求成功完成後要執行的方法 
                        if (idx >= 0) {
                            Vue.set(self.jsonDatas, "data" + (idx + 1), data)
                        }
                        if (idx === (self.urlDatas.length - 1)) {
                            self.start = new Date().getTime();
                            console.log(self.start)
                        }
                    }
                })
            },
            selectRow: function(e) {
                console.log("HIHI")
                    //對先前選取的row恢復預設底色
                if (document.querySelector("tr.selected")) {
                    document.querySelector("tr.selected").className = ""
                }
                //對當前選取的row改變底色
                e.currentTarget.className = "selected"
            },
            toggleStar: function(e) {
                //對選取的star class判斷是否含有selected
                var className = e.target.className
                if (className.indexOf("selected") != -1) {
                    e.target.className = "star"
                } else {
                    e.target.className = "star selected"
                }
            },
        },
        beforeMount() {
            var self = this;
            //綁定前取得畫面所需資料(迴圈取得多個檔案位置資料)
            $.each(self.urlDatas, function(idx, url) {
                self.getData(idx, url);
            })
        },
        beforeUpdate() {
            var self = this;
            self.end = new Date().getTime();
        },
    })
});