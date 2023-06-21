const express = require("express");

const app = express(); //this line
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`server is listening on port:${PORT}`);
});
app.get("/", (req, res) => {
  res.json("welcome");
});
var doTask = (taskName) => {
  var begin = Date.now();
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      var end = Date.now();
      var timeSpent = end - begin + "ms";
      console.log(
        "\x1b[36m",
        "[TASK] FINISHED: " + taskName + " in " + timeSpent,
        "\x1b[0m"
      );
      resolve(true);
    }, Math.random() * 200);
  });
};
const getTime = (startTime, endTime) => {
  var today = new Date().getHours();

  if (today >= startTime && today <= endTime) {
    return 10;
  } else {
    return 150;
  }
};
async function init() {
  numberOfTasks = getTime(9, 17);
  const concurrencyMax = 4;
  const taskList = [...Array(numberOfTasks)].map(() =>
    [...Array(~~(Math.random() * 10 + 3))]
      .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
      .join("")
  );
  const counter = 0;
  const concurrencyCurrent = 0;
  console.log("[init] Concurrency Algo Testing...");
  console.log("[init] Tasks to process: ", taskList.length);
  console.log("[init] Task list: " + taskList);
  console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n");
  await manageConcurrency(
    taskList,
    counter,
    concurrencyMax,
    concurrencyCurrent
  );
}

const manageConcurrency = async (
  taskList,
  counter,
  concurrencyMax,
  concurrencyCurrent
) => {
  // made asynchronous task list
  const tasks = taskList.map(
    (task) =>
      new Promise((res, rej) => {
        res(task);
      })
  );
  // generator functions for divide concurrency of tasks
  async function* batchTasks(tasks, limit) {
    for (let i = counter; i < tasks.length; i = i + limit) {
      // grab the batch of tasks for current iteration
      const batch = tasks.slice(i, i + limit);

      // wait for them to resolve concurrently

      yield batch;
    }
  }
  //   execute function for concurrent requests
  async function Execute() {
    for await (const batch of batchTasks(tasks, concurrencyMax)) {
      //   promise.race when any of them resolved it executed
      Promise.race(
        batch.map((task, index) =>
          task.then((r) => {
            console.log("Concurrency:", index + 1 + " of " + concurrencyMax);
            console.log("Task Started:", r);
            doTask(r);
          })
        )
      );
    }
  }
  Execute();
};

init();
// Server
