angular.module('cif-constants',[])
  .constant('DB', {
    local: '@@localDB',
    remote: '@@remoteDB',
    changeLog: '@@changeLogDB'
  })
  .constant('API', {
    host: '@@host'
  })
