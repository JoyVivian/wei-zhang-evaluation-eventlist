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

  return {
    getEvents,
    postEvent,
    deleteEventById,
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
}

// MVC - View
class EventView {
  constructor() {
    this.eventTable = document.getElementById("event-table");
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
    deleteButton.textContent = "Delete";

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(eventCell);
    row.appendChild(startCell);
    row.appendChild(endCell);
    row.appendChild(actionsCell);

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
    this.setUpDeleteEvent();
  }

  setUpAddEvent() {}
  setUpDeleteEvent() {}
}

// Driver Code
const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);
