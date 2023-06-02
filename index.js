const API = (function () {
  const API_URL = "http://localhost:3000/events";

  const getEvents = async () => {
    try {
      const response = await fetch(`${API_URL}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const postEvent = async (newEvent) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEventById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const updateEventById = async (id, updatedEvent) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getEvents,
    postEvent,
    deleteEventById,
    updateEventById,
  };
})();

// MVC - Model
class EventModel {
  #events = [];

  constructor() {}

  getEvents() {
    return this.#events;
  }

  // Fetch events from API and set them to the model.
  async fetchEvents() {
    try {
      this.#events = await API.getEvents();
    } catch (error) {
      console.log(error);
    }
  }

  // Add new event to the model.
  async addEvent(newEvent) {
    try {
      const event = await API.postEvent(newEvent);
      this.#events.push(event);
      return event;
    } catch (error) {
      console.log(error);
    }
  }

  // Delete event from the model.
  async deleteEvent(id) {
    try {
      await API.deleteEventById(id);
      this.#events = this.#events.filter((event) => event.id !== id);
    } catch (error) {
      console.log(error);
    }
  }

  // Edit existing event in the model.
  async editEvent(id, updatedEvent) {
    try {
      const event = await API.updateEventById(id, updatedEvent);
      this.#events = this.#events.map((e) => (e.id === id ? event : e));
      return event;
    } catch (error) {
      console.log(error);
    }
  }

  // Get event by ID.
  getEventById(id) {
    const eventId = parseInt(id, 10); // Convert the id to a number
    return this.#events.find((event) => event.id === eventId);
  }
}

// MVC - View
class EventView {
  constructor() {
    this.eventTable = document.getElementById("event-table");
    this.addEventButton = document.getElementById("add-event-button");
  }

  // Create new event item.
  createEventItem(event) {
    const row = document.createElement("tr");
    const eventCell = document.createElement("td");
    const startCell = document.createElement("td");
    const endCell = document.createElement("td");
    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    eventCell.textContent = event.eventName;
    startCell.textContent = event.startDate;
    endCell.textContent = event.endDate;
    editButton.textContent = "Edit";
    // editButton.id = `edit-button-${event.id}`;
    editButton.classList.add("edit-button");
    editButton.dataset.eventId = event.id;

    deleteButton.textContent = "Delete";
    // deleteButton.id = `delete-button-${event.id}`;
    deleteButton.classList.add("delete-button");
    deleteButton.dataset.eventId = event.id;

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(eventCell);
    row.appendChild(startCell);
    row.appendChild(endCell);
    row.appendChild(actionsCell);
    row.id = `event-row-${event.id}`;

    return row;
  }

  // Append new event to the DOM.
  appendEvent(event) {
    const eventItem = this.createEventItem(event);
    this.eventTable.appendChild(eventItem);
  }

  renderEvents(events) {
    events.forEach((event) => {
      this.appendEvent(event);
    });
  }

  addEmptyEvent() {
    const row = document.createElement("tr");
    const inputCell = document.createElement("td");
    const startCell = document.createElement("td");
    const endCell = document.createElement("td");
    const actionsCell = document.createElement("td");
    const saveButton = document.createElement("button");
    const cancelButton = document.createElement("button");
    const inputField = document.createElement("input");
    const startDate = document.createElement("input");
    const endDate = document.createElement("input");

    inputField.type = "text";
    startDate.type = "date";
    endDate.type = "date";
    saveButton.textContent = "Save";
    cancelButton.textContent = "Cancel";

    inputCell.appendChild(inputField);
    startCell.appendChild(startDate);
    endCell.appendChild(endDate);
    actionsCell.appendChild(saveButton);
    actionsCell.appendChild(cancelButton);

    row.appendChild(inputCell);
    row.appendChild(startCell);
    row.appendChild(endCell);
    row.appendChild(actionsCell);

    this.eventTable.appendChild(row);

    return { row, inputField, startDate, endDate, saveButton, cancelButton };
  }

  deleteEventItem(id) {
    const row = document.getElementById(`event-row-${id}`);
    this.eventTable.removeChild(row);
  }

  editEventItem(event) {
    const curRow = document.getElementById(`event-row-${event.id}`);
    const { row, inputField, startDate, endDate, saveButton, cancelButton } =
      this.addEmptyEvent();

    // Set input fields to the current event values
    inputField.value = event.eventName;
    startDate.value = event.startDate;
    endDate.value = event.endDate;

    // Replace the current row with the new row
    this.eventTable.replaceChild(row, curRow);

    return { inputField, startDate, endDate, saveButton, cancelButton, row };
  }
}

// MVC - Controller
class EventController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  async init() {
    await this.model.fetchEvents();
    this.view.renderEvents(this.model.getEvents());
    this.setUpEventListeners();
  }

  setUpEventListeners() {
    this.setUpAddEvent();
    // this.setUpDeleteEvent();
    // this.setUpEditEvent();
    this.setUpEventTable();
  }

  setUpAddEvent() {
    this.view.addEventButton.addEventListener("click", () => {
      const { inputField, startDate, endDate, saveButton, cancelButton, row } =
        this.view.addEmptyEvent();

      saveButton.addEventListener("click", async () => {
        // Check if input fields are empty
        if (!inputField.value || !startDate.value || !endDate.value) {
          alert("All fields must be filled out!");

          return;
        }

        const newEvent = {
          eventName: inputField.value,
          startDate: startDate.value,
          endDate: endDate.value,
        };
        // first add event to the model
        const addedEvent = await this.model.addEvent(newEvent);
        // then remove the input fields row from the view
        this.view.eventTable.removeChild(row);
        // then append the newly created event to the table
        this.view.appendEvent(addedEvent);
      });

      cancelButton.addEventListener("click", () => {
        this.view.eventTable.removeChild(row);
      });
    });
  }

  setUpEventTable() {
    this.view.eventTable.addEventListener("click", (event) => {
      if (event.target.matches(".edit-button")) {
        const eventId = event.target.dataset.eventId;
        const eventItem = this.model.getEventById(eventId);

        console.log(eventItem);

        if (eventItem) {
          const {
            inputField,
            startDate,
            endDate,
            saveButton,
            cancelButton,
            row,
          } = this.view.editEventItem(eventItem);

          saveButton.addEventListener("click", async () => {
            const updatedEvent = {
              eventName: inputField.value,
              startDate: startDate.value,
              endDate: endDate.value,
            };

            const editedEvent = await this.model.editEvent(
              eventItem.id,
              updatedEvent
            );
            this.view.eventTable.removeChild(row);
            this.view.appendEvent(editedEvent);
          });

          cancelButton.addEventListener("click", () => {
            this.view.eventTable.removeChild(row);
            this.view.appendEvent(eventItem);
          });
        }
      } else if (event.target.matches(".delete-button")) {
        const eventId = event.target.dataset.eventId;
        const eventItem = this.model.getEventById(eventId);
        if (eventItem) {
          this.model.deleteEvent(eventItem.id);
          this.view.deleteEventItem(eventItem.id);
        }
      }
    });
  }
}

// Driver Code
const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);
