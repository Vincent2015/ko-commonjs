module.exports = {
    init: function(){
     var app,viewModel;
      var data={
        "rows": [
                  {
                    "status": "nrm",
                    "data": {
                      "enterprise": "用友",
                      "depart": "UE",
                      "name": "张紫琼",
                      "sex": "male"
                    }
                  }, 
                  {
                    "status": "nrm",
                    "data": {
                      "enterprise": "阿里巴巴",
                      "depart": "测试",
                      "name": "张丽丹",
                      "sex": "female"
                    }
                  }
          ],
          "pageIndex": 1,
          "pageSize": 10
      };
      viewModel={
        infoData:new u.DataTable({
          meta:{
            enterprise:{},
            depart:{},
            name:{},
            sex:{}
          }
        }),
        listData:new u.DataTable({
          meta:{
            enterprise:{},
            depart:{},
            name:{},
            sex:{}
          }
        }),
        addAction:function(){
          var _meta=viewModel["listData"].meta;
          var addInfo=viewModel["infoData"].getAllRows();
          addInfo.forEach(function(row){
            var r=viewModel['listData'].createEmptyRow();
            for(var key in _meta){
              r.setValue(key,row.getValue(key));
            } 
          })
        }
      };
      ko.cleanNode($('body')[0]);
      app=u.createApp({
        el:'body',
        model:viewModel 
      });
      var r = viewModel.infoData.createEmptyRow();
      viewModel.infoData.setRowSelect(0);
      viewModel['listData'].setData(data);
      window.app=app;

    }
};
