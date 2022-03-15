const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://radf-dev.ibacz.cz:8081/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("invoice", async function ({ task, taskService }) {
  // Put your business logic
  const coffee1 = task.variables.get("coffee1");
  const coffeeQuantity1 = task.variables.get("quantity1");

  const coffee2 = task.variables.get("coffee2");
  const coffeeQuantity2 = task.variables.get("quantity2");

  const coffeePrice = {
    espresso: 3,
    lattes: 5,
    macchiatos: 7,
    americanos: 4,
  };

  const processVariables = new Variables();
  processVariables.set(
    "invoice",
    coffeePrice[coffee1] * coffeeQuantity1 +
      coffeePrice[coffee2] * coffeeQuantity2
  );

  taskService.complete(task, processVariables);
});

client.subscribe("payment", async function ({ task, taskService }) {
  // Put your business logic

  const random = Math.floor(Math.random() * 10);

  const errorPay = "Sorry! Check you payment data again, please!";
  const processVariables = new Variables();
  processVariables.set("randomPay", random);

  if (random > 4) {
    // complete the task
    await taskService.complete(task, processVariables);
  } else {
    // throw a BPMN error
    await taskService.handleBpmnError(
      task,
      "payError",
      "Sorry! Check you payment data again, please!",
      processVariables
    );
  }
});

client.subscribe("checkCoffee", async function ({ task, taskService }) {
  // Put your business logic
  const getCoffee = Math.floor(Math.random() * 10);

  const coffee1 = task.variables.get("coffee1");
  const coffee2 = task.variables.get("coffee2");

  const coffeeList = [coffee1, coffee2];

  const noCoffee = Math.round(Math.random());

  const processVariables = new Variables();
  processVariables.set("getCoffee", getCoffee);
  processVariables.set("noCoffee", coffeeList[noCoffee]);

  if (getCoffee > 5) {
    // complete the task
 taskService.complete(task, processVariables);
  } else {
    // throw a BPMN error
    await taskService.handleBpmnError(
      task,
      "coffeeError",
      "Sorry! We havn't enough coffee!",
      processVariables
    );
  }
});
