const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./user.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const userProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let users = [
    { id: 1, name: "Note 1", phone: "Content 1", pic: "Post image 1" },
    { id: 2, name: "Note 2", phone: "Content 2", pic: "Post image 2" },
];


function addUser(call, callback) {
    let user = call.request;
    console.log({call})
    user.id = users[users.length - 1]['id'] + 1;
    users.push(user);
    callback(null, user);
}

function getAllUsers(call, callback) {
    console.log(call);
    console.log("working");
    callback(null, { users });
}

function getSingleUser(call, callback) {
    let user = users.find(n => n.id == call.request.id);
    if (user) {
        callback(null, user);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        });
    }
}

function updateUser(call, callback) {
    let existingUser = users.find(n => n.id == call.request.id);
    if (existingUser) {
        existingUser.name = call.request.name;
        existingUser.phone = call.request.phone;
        existingUser.pic = call.request.pic;
        callback(null, existingUser);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        });
    }
}

function removeUser(call, callback) {
    let existingUserIndex = users.findIndex(
        n => n.id == call.request.id
    );
    if (existingUserIndex != -1) {
        users.splice(existingUserIndex, 1);
        callback(null, {});
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        });
    }
}

server.addService(userProto.UserService.service, {
    addUser: addUser,
    getAllUsers: getAllUsers,
    getSingleUser: getSingleUser,
    updateUser: updateUser,
    removeUser: removeUser
});

server.bindAsync(
    "127.0.0.1:30303",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.log({ error, port })
            process.exit(1);
        }
        console.log("Server running at http://127.0.0.1:30303");
        server.start();
    }
);
