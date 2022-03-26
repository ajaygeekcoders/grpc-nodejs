const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./news.proto";

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const NewsService = grpc.loadPackageDefinition(packageDefinition).NewsService;

console.log({NewsService})

const client = new NewsService(
    "localhost:30303",
    grpc.credentials.createInsecure()
);

console.log({client});

client.getAllNews({}, (error, news) => {
    console.log({error, news})
    if (error) throw error
    console.log(news);
});

client.RetrieveAllWeather({},(err,res)=>{
    console.log({err, res})
    if(err){
        return err;
    }
    console.log("working");
    console.log(JSON.stringify(res));
});