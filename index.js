const API = (function () {
  const API_URL = "http://localhost:3000/events";

  const getEvents = async () => {
    try {
      const response = await fetch(`${API_URL}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      return data;
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
class EventView {}

// MVC - Controller
class EventController {}

// Driver Code
const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);
