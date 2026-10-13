require("dotenv").config();

const express = require("express");
const session = require("express-session");
const db = require("./db");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/signin");
    }
    next();
}
app.get("/", async function (req, res) {
        const result = await db.query(
        'SELECT blog_id AS id, creator_name AS creator, creator_user_id, title, body AS content, date_created AS "createdAt" FROM blogs ORDER BY date_created DESC, blog_id DESC'
    );
    res.render("index", {
        posts: result.rows,
        user: req.session.user || null
    });
});
app.get("/signup", function (req, res) {
    res.render("signup", { error: null });
});
app.post("/signup", async function (req, res) {
    const userId = (req.body.user_id || "").trim();
    const password = req.body.password || "";
    const name = (req.body.name || "").trim();

    if (!userId || !password || !name) {
        return res.render("signup", {
            error: "Please complete all fields."
        });
    }

    const existingUser = await db.query(
        "SELECT user_id FROM users WHERE user_id = $1",
        [userId]
    );

    if (existingUser.rows.length > 0) {
        return res.render("signup", {
            error: "That user ID is already taken."
        });
    }
    const result = await db.query(
        "INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING",
        [userId, password, name]
    );
    if (result.rowCount === 0) {
        return res.render("signup", {
            error: "That user ID is already taken."
        });
    }

    res.redirect("/signin");
});
app.get("/signin", function (req, res) {
    res.render("signin", { error: null });
});
app.post("/signin", async function (req, res, next) {
    const result = await db.query(
        "SELECT user_id, name FROM users WHERE user_id = $1 AND password = $2",
        [
            (req.body.user_id || "").trim(),
            req.body.password || ""
        ]
    );
    if (result.rows.length === 0) {
        return res.render("signin", {
            error: "Incorrect user ID or password."
        });
    }
    req.session.regenerate(function (error) {
        if (error) return next(error);

        req.session.user = result.rows[0];

        req.session.save(function (error) {
            if (error) return next(error);
            res.redirect("/");
        });
    });
});

app.post("/signout", function (req, res, next) {
    req.session.destroy(function (error) {
        if (error) return next(error);
        res.clearCookie("connect.sid");
        res.redirect("/signin");
    });
});

app.post("/posts", requireLogin, async function (req, res) {
    const title = (req.body.title || "").trim();
    const content = (req.body.content || "").trim();
    const user = req.session.user;

    if (!title || !content || title.length > 255) {
        return res.status(400).send(
            "Enter a title under 256 characters and a blog post."
        );
    }

    await db.query(
        "INSERT INTO blogs (creator_name, creator_user_id, title, body) VALUES ($1, $2, $3, $4)",
        [user.name, user.user_id, title, content]
    );
    res.redirect("/");
});

app.get("/edit/:id", requireLogin, async function (req, res) {
    const result = await db.query(
        "SELECT blog_id AS id, creator_name AS creator, title, body AS content FROM blogs WHERE blog_id = $1 AND creator_user_id = $2",
        [req.params.id, req.session.user.user_id]
    );
    if (result.rows.length === 0) {
        return res.status(404).send(
            "Post not found, or this post is not yours."
        );
    }

    res.render("edit", { post: result.rows[0] });
});

app.post("/edit/:id", requireLogin, async function (req, res) {
    const title = (req.body.title || "").trim();
    const content = (req.body.content || "").trim();

    if (!title || !content || title.length > 255) {
        return res.status(400).send(
            "Enter a title under 256 characters and a blog post."
        );
    }
    const result = await db.query(
        "UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3 AND creator_user_id = $4",
        [title, content, req.params.id, req.session.user.user_id]
    );
    if (result.rowCount === 0) {
        return res.status(404).send(
            "Post not found, or this post is not yours."
        );
    }
    res.redirect("/");
});
app.post("/delete/:id", requireLogin, async function (req, res) {
    const result = await db.query(
        "DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2",
        [req.params.id, req.session.user.user_id]
    );
    if (result.rowCount === 0) {
        return res.status(404).send(
            "Post not found, or this post is not yours."
        );
    }
    res.redirect("/");
});
app.use(function (error, req, res, next) {
    console.error(error.message);
    res.status(500).send("Something went wrong. Please try again.");
});

app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000");
});