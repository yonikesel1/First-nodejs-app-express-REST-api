const Joi = require("joi");
const express = require("express");
const { get } = require("http");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  console.log("Got request on root");
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    // 404 - Object not found
    res
      .status(404)
      .send(
        `404 - the course with the given id: ${req.params.id} was not found!`
      );
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body); // result.error

  if (error) {
    //400 Bad request
    res.status(400).send(error.message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Look for the specified course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    // 404 - Object not found
    res
      .status(404)
      .send(
        `404 - the course with the given id: ${req.params.id} was not found!`
      );

  // const result = validateCourse(req.body);

  const { error } = validateCourse(req.body); // result.error

  if (error) {
    //400 Bad request
    res.status(400).send(error.message);
    return;
  }

  // update course after req validation
  course.name = req.body.name;

  // return the updated course
  res.send(course);
});

const port = /*process.env.PORT ||*/ 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));

function validateCourse(course) {
  // check if the request is valid
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}
