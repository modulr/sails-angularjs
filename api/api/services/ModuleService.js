module.exports = {
  items: function(collection, authorizations){
    var myArray = [];
    var arraySubCollection;
    addAccess();

    function addAccess(){
      collection.forEach(function(val, key) {
        if (authorizations !== null) {
          authorizations.forEach(function (v, k) {
            if (val.id == v.module_id) {
              val['access'] = v.access;
              return false;
            }
          });
        }else{
          val['access'] = false;
        }
      });
      init();
    }

    function init(){
      collection.forEach(function(val, key){
        if (authorizations !== null) {
          if (val.access) {
            if (val.parent_id === '') {
              arraySubCollection = filterCollection(val.id);
              myArray.push(makeModel(val, arraySubCollection));
            }
          }
        }else{
          if (val.parent_id === '') {
            arraySubCollection = filterCollection(val.id);
            myArray.push(makeModel(val, arraySubCollection));
          }
        }
      });
    }

    function subItems(arraySubItems) {
      var myArray = [];
      var arraySubCollection;
      arraySubItems.forEach(function(val, key){
        arraySubCollection = filterCollection(val.id);
        myArray.push(makeModel(val, arraySubCollection));
      });
      return myArray;
    }

    function makeModel(module, arraySubItems) {
      module.children = subItems(arraySubItems);
      return module;
    }

    function filterCollection(id) {
      var newArray = [];
      collection.forEach(function (val, key) {
        if (authorizations !== null) {
          if (val.parent_id == id && val.access) {
            newArray.push(val);
          }
        }else{
          if (val.parent_id == id) {
            newArray.push(val);
          }
        }
      });
      return newArray;
    }
    return myArray;
  },

  getModules: function(next) {
    sails.models.module.find({sort: 'order ASC'}).exec(function (err,response) {
      next(err,response);
    });
  },

  getModulesForAccess: function(modules, access) {
    modules.forEach(function (val, key) {
      if (val.children.length > 0){
        ModuleService.getModulesForAccess(val.children, access);
      }
      access.push(
        {
          module_id: val.id,
          url: val.url,
          access: val.access,
          permissions: []
        }
      );
    });
    return access;
  }


};
