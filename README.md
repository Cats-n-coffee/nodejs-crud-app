# Pure NODEJS CRUD app

This project is an exercise using NodeJs without any framework and using only minimal libraries. 
The goal was to get a deeper understanding of NodeJs, and all the mechanisms involved in creating a CRUD app (CORS, using request body data, ...).
This backend is a REST API working with a (playground) frontend in a [different repository](https://github.com/Cats-n-coffee/nodejs-crud-frontend).

## Code organization

The entry file is `app.js`. It connects to the database and creates a server which holds the routes (routes are imported). <br>
Routes are exported in the `appRoutes` function from `./routes/newRoutes.js` and import all the controllers from `./controllers/authControllers.js` and `./controllers/invoiceControllers.js`.<br>
Controllers use the database functions from the `db` directory. 

## Routing

Routing is handled by identifying the method attached to the `req` object (request parameter from the server passed to the routes). <br> 
Once the method is identified, it identifies the `pathname` from the `url` property on the `req` (`req.url`). To obtain all the information passed on `req.url`, we create an instance of the `URL` class. <br>
After both the method and the pathname are matched, the corresponding controller function is called.

## Using GET parameters

To use the parameters passed to a GET request, we can use the `searchParams` from the instance of the `URL` class created. A helper function `convertParams` formats the parameters in a way they can be used in database requests (a basic Js object).

## Using data from the request body (no body-parser library)

In order to use the data sent with POST, PUT and DELETE requests, we need to listen for the `data` event on the `req` (request). `req` (request) being an `IncomingMessage` object, it is a readable stream, so we need to convert the buffer to a string to use it.

## Solving CORS issues (no CORS library)

To make this API interact with a frontend, it needs to be "browser compliant". Because this backend API and the frontend run on different ports, the origin is not the same raising cross-origin errors. <br>
An `OPTIONS` request needs to be sent with every request (all POST, PUT and DELETE will need it), so this server needs to handle an `OPTIONS` request and send headers back to allow origin, headers, methods and max age (for the result of this preflight request to be cached 600 seconds in the case of this project). <br>
Two headers are sent with every response: `Access-Control-Allow-Origin` and `Content-Type`.

## Performing DB operations (MongoDb Native library)

This API uses MongoDb, and its native library. The data to be inserted/modified is prepared in the controllers requiring no formatting in the databases functions. <br>
This API performs basic operations: insert, find, delete and update. All these operations are simple to perform when following the documentation, only the `find` method requires to call `toArray` right after it and before the `.then` in the promise. The `find` method returns a cursor (points to the data), so by transforming the cursor to an array we can actually retrieve the data. 

## Encrypting passwords (using crypto module)

Hashing and verifying passwords uses the built-in crypto module. <br>
In the `hash` function we first create a salt, and use the `scrypt` function to encrypt the password using the salt and the specified length. <br> 
The `verify` function destructures the salt and the key by splitting at the `:`. It can then verify the password provided using the same `scrypt` function by matching the key (destructured earlier) and the `derivedKey` in the callback.  