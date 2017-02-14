'use strict';

// Uses remote methods to create customize apis

module.exports = function(CoffeeShop) {
  
	// Gets status of coffee shop

  CoffeeShop.status = function(cb) {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var OPEN_HOUR = 6;
    var CLOSE_HOUR = 20;
    console.log('Current hour is %d', currentHour);
    var response;
    if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
      response = 'We are open for business.';
    } else {
      response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
    }
    cb(null, response);
  };
  
  CoffeeShop.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get'
      },
      returns: {
        arg: 'status',
        type: 'string'
      }
    }
  );

  // Shows Coffee Name ny id 

  CoffeeShop.getName = function(shopId, cb) {
    CoffeeShop.findById( shopId, function (err, instance) {
    	if(err)
    	{
    		var response = 'No Coffee with exist with this ID'
    	}
    	else
    	{
	        var response = "Name of coffee shop is " + instance.name;
	        cb(null, response);
	        console.log(response);
    	}
    });
  }

  CoffeeShop.remoteMethod (
        'getName',
        {
          http: {path: '/getname', verb: 'get'},
          accepts: {arg: 'id', type: 'number', http: { source: 'query' } },
          returns: {arg: 'name', type: 'string'}
        }
    );


  CoffeeShop.updateName = function(shopId, name, cb){
  	console.log('shop name', name)
  	CoffeeShop.findById(shopId, function(err, instance){
  		if (err){
  			console.log('Id not found')
  		}
  		else{
  			instance.name = name
  			instance.save(function(err, response){
  				var output = "Name of coffee shop is " + instance.name;
  				cb(null, response)
  		});
  		}
  	});
  }

  CoffeeShop.remoteMethod(
  	'updateName',
  	{
  		http: {path: '/updateName', verb: 'post'},
  		accepts: [{arg: 'id', type: 'number'},
  					{arg: 'name', type: 'string'}], 'http': {source: 'query'},
  		returns: {arg: 'name', type: 'json'}
  	}
  	);

  // remote method before hook
  CoffeeShop.beforeRemote('updateName', function(context, unused, next) {
    console.log('Putting in the car key, starting the engine.');
    next();
  });
  // remote method after hook
  CoffeeShop.afterRemote('updateName', function(context, remoteMethodOutput, next) {
    console.log('Turning off the engine, removing the key.');
    next();
  });

  CoffeeShop.disableRemoteMethod("create", true);
};

