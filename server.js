const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./news.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const newsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let news = [
    { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
    { id: "2", title: "Note 2", body: "Content 2", postImage: "Post image 2" },
];


function RetrieveAllWeather(call,callback){
    console.log(call);
    console.log("working");
    callback(null,"call");
}

function getAllNews(call,callback){
    console.log(call);
    console.log("working");
    callback(null, { news });
}

server.addService(newsProto.NewsService.service, {
    getAllNews: getAllNews,
    RetrieveAllWeather: RetrieveAllWeather
});

server.bindAsync(
    "127.0.0.1:30303",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if(error){
            console.log({ error, port })
            process.exit(1);
        }
        console.log("Server running at http://127.0.0.1:30303");
        server.start();
    }
);
