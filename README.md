
# Run

```
    docker run --rm -p 3000:3000 cc861010/robot_wechat
```

## HTTP API

```
{
  "/me": {
    "desc": "check out current user information",
    "result": [
      {
        "status": 0,
        "desc": "get current user information"
      },
      {
        "status": 1,
        "desc": "no user is logged in "
      }
    ]
  },
  "/logout": {
    "desc": "get current user to log out and clear the cache of users and rooms ",
    "result": [
      {
        "status": 0,
        "desc": "log out successfully"
      },
      {
        "status": 1,
        "desc": "no user is logged in"
      }
    ]
  },
  "/login": {
    "desc": "return a QR code url and scan it with ios (android) wechat to login ",
    "result": [
      {
        "status": 0,
        "desc": "QR code url"
      },
      {
        "status": 1,
        "desc": "QR code has not been generated and try again after seconds"
      }
    ]
  },
  "/users_force_reload": {
    "desc": "force reload the cache of all of user's contact, we should reduce the operation because it's very costly  ",
    "result": [
      {
        "status": 0,
        "desc": "return all of the contacts"
      },
      {
        "status": 1,
        "desc": "fail to reload"
      }
    ]
  },
  "/rooms_force_reload": {
    "desc": "force reload the cache of all of user's room information, we should reduce the operation because it's very costly  ",
    "result": [
      {
        "status": 0,
        "desc": "return all of the rooms"
      },
      {
        "status": 1,
        "desc": "fail to reload"
      }
    ]
  },
  "/users/:reg": {
    "desc": "get users information from cache by specify regexp",
    "result": [
      {
        "status": 0,
        "desc": "return users information match the regexp"
      },
      {
        "status": 1,
        "desc": "Illegal request"
      }
    ]
  },
  "/users/:reg/:message": {
    "desc": "get one user information from cache by specify regexp and send a message to it",
    "result": [
      {
        "status": 0,
        "desc": "send  message to a user successfully"
      },
      {
        "status": 1,
        "desc": "Illegal request"
      },
      {
        "status": 2,
        "desc": "send unsuccessfully because of a exception"
      },
      {
        "status": 3,
        "desc": "cant find any user by this id"
      },
      {
        "status": 4,
        "desc": "find many users by this RegExp"
      }
    ]
  },
  "/rooms/:reg": {
    "desc": "get rooms information from cache by specify regexp",
    "result": [
      {
        "status": 0,
        "desc": "return rooms information match the regexp"
      },
      {
        "status": 1,
        "desc": "Illegal request"
      }
    ]
  },
  "/rooms/:reg/:message": {
    "desc": "get one room information from cache by specify regexp and send a message to it",
    "result": [
      {
        "status": 0,
        "desc": "send  message to a room successfully"
      },
      {
        "status": 1,
        "desc": "Illegal request"
      },
      {
        "status": 2,
        "desc": "send unsuccessfully because of a exception"
      },
      {
        "status": 3,
        "desc": "cant find any room by this RegExp"
      },
      {
        "status": 4,
        "desc": "find many users by this RegExp"
      }
    ]
  },
  "/msg/:id/:message": {
    "desc": "send a message to a room or a user by id",
    "result": [
      {
        "status": 0,
        "desc": "send user(room) message successfully"
      },
      {
        "status": 1,
        "desc": "Illegal request"
      },
      {
        "status": 2,
        "desc": "send user message unsuccessfully because of a exception"
      },
      {
        "status": 3,
        "desc": "send room message unsuccessfully because of a exception"
      },
      {
        "status": 4,
        "desc": "cant find room or user by id"
      }
    ]
  }
}

```



## Message subscription

```

 new WebSocket("ws://127.0.0.1:3000/").onmessage = (event) => {
        console.info(event.data);
 };


    or


 ws = new WebSocket("ws://127.0.0.1:3000/")

 ws.onopen = function(event) {
    console.log("WebSocket is open now.");
 };

 ws.onclose = function(event) {
  console.log("WebSocket is closed now.");
 };

 ws.onmessage = function(event) {
  console.info(event.data);
 };


```
