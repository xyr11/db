## a simple CRUD api that's basically a wrapper for my mongodb database

Endpoint URL: https://db.xyr11.repl.co

The token is some kind of password and is required for all API actions. Add the token to your `Authorization` header (see the examples below).

Endpoints | Methods | Req Body | Description | Returns
-- | :--: | :--: | -- | --
/ | `?time=` | N/A | Get the one-way ping in ms. No need for authorization. | String
/`collection` | `GET` | N/A | Get all documents of `collection`. | { status: `"exists"`/`"empty"`, <br> data: Array, <br> time: Unix time }
/`collection` | `POST` | `data` | Add a new document on `collection`. | { time: Unix time }
/`collection`/ids | `GET` | N/A | Fetch all IDs of `collection`. | status: `"exists"`/`"empty"`, <br> data: Array, <br> { time: Unix time }
/`collection`/`id` | `GET` | N/A | Get the data of one document of `collection` using the id. | { status: `"exists"`/`"empty"`, <br> data: Object, <br> time: Unix time }
/`collection`/`id` | `DELETE` | None | Delete one document of `collection` using the `id`. | { time: Unix time }

*will add more in the future ofc*

### sample code (more or less)
#### ping
```js
fetch('http://localhost:3000?time='+Date.now())
  .then(res => res.text()).then(console.log)
```

#### get collection
```js
const headers = {
  'Authorization': 'nicePasscode12345679'
}
fetch('http://localhost:3000/test', {
  method: 'GET',
  headers
}).then(res => res.json()).then(console.log)
```

#### add document to collection
```js
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'nicePasscode12345679'
}
fetch('http://localhost:3000/test', {
  method: 'POST',
  headers,
  body: JSON.stringify({ foo: 'bar', data: 'youtube.com/watch?v=dQw4w9WgXcQ' })
}).then(res => res.json()).then(console.log)
```
