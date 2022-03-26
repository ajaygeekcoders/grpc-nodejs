const client = require("./client");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    client.getAllUsers(null, (err, data) => {
        console.log({ err, data })
        if (!err) {
            return res.status(200).send(data.users);
        }
        return res.status(400).send(err);
    });
});

app.get("/:id", (req, res) => {
    client.getSingleUser({id: req.params.id}, (err, data) => {
        console.log({ err, data })
        if (!err) {
            return res.status(200).send({ data });
        }
        return res.status(400).send(err);
    });
});

app.post("/save", (req, res) => {
    let newUser = {
        name: req.body.name,
        phone: req.body.phone,
        pic: req.body.pic
    };

    client.addUser(newUser, (err, data) => {
        if (err) throw err;

        console.log("User created successfully", data);
        res.status(200).send({ data });
    });
});

app.post("/update", (req, res) => {
    const updateUser = {
        id: req.body.id,
        name: req.body.name,
        phone: req.body.phone,
        pic: req.body.pic
    };

    client.updateUser(updateUser, (err, data) => {
        if (err) throw err;

        console.log("User updated successfully", data);
        res.status(200).send({ data })
    });
});

app.post("/remove", (req, res) => {
    client.removeUser({ id: req.body.user_id }, (err, _) => {
        if (err) throw err;

        console.log("User removed successfully");
        res.status(200).send({ message: "User removed successfully" })
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});