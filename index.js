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

  createEventItem(event) {
    const row = document.createElement("tr");

    // Set the style of the row.
    row.setAttribute(
      "style",
      "background-color: #e6e2d3; margin-bottom: 10px;"
    );

    const eventCell = document.createElement("td");
    const startCell = document.createElement("td");
    const endCell = document.createElement("td");
    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    editButton.setAttribute(
      "style",
      "background-color: #008cba; border: none; padding: 0; border-radius: 4px; cursor: pointer; margin-left: 1px; margin-right: 1px; width: 24px; height: 24px;"
    );

    const svgIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    eventCell.textContent = event.eventName;
    startCell.textContent = event.startDate;
    endCell.textContent = event.endDate;

    svgIcon.setAttribute("focusable", "false");
    svgIcon.setAttribute("aria-hidden", "true");
    svgIcon.setAttribute("viewBox", "0 0 24 24");
    svgIcon.setAttribute("data-testid", "EditIcon");
    svgIcon.setAttribute("aria-label", "fontSize small");
    svgIcon.setAttribute("fill", "white");

    path.setAttribute(
      "d",
      "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
    );

    // editButton.id = `edit-button-${event.id}`;
    editButton.classList.add("edit-button");
    editButton.dataset.eventId = event.id;
    svgIcon.appendChild(path);
    editButton.appendChild(svgIcon);

    // deleteButton.textContent = "Delete";
    // deleteButton.classList.add("delete-button");
    // deleteButton.dataset.eventId = event.id;

    deleteButton.setAttribute(
      "style",
      "background-color: #dc3545; border: none; padding: 0; border-radius: 4px; cursor: pointer; margin-left: 1px; margin-right: 1px; width: 24px; height: 24px;"
    );

    const svgIconDelete = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const pathDelete = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    svgIconDelete.setAttribute("focusable", "false");
    svgIconDelete.setAttribute("aria-hidden", "true");
    svgIconDelete.setAttribute("viewBox", "0 0 24 24");
    svgIconDelete.setAttribute("data-testid", "DeleteIcon");
    svgIconDelete.setAttribute("aria-label", "fontSize small");
    svgIconDelete.setAttribute("fill", "white");

    pathDelete.setAttribute(
      "d",
      "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
    );

    deleteButton.classList.add("delete-button");
    deleteButton.dataset.eventId = event.id;
    svgIconDelete.appendChild(pathDelete);
    deleteButton.appendChild(svgIconDelete);

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

    // Style the save button
    saveButton.style.backgroundColor = "#008cba";
    saveButton.style.border = "none";
    saveButton.style.padding = "0";
    saveButton.style.borderRadius = "4px";
    saveButton.style.cursor = "pointer";
    saveButton.style.marginLeft = "1px";
    saveButton.style.marginRight = "1px";
    saveButton.style.width = "24px";
    saveButton.style.height = "24px";
    saveButton.style.display = "flex";
    saveButton.style.justifyContent = "center";
    saveButton.style.alignItems = "center";
    saveButton.innerHTML =
      '<svg focusable viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // Style the save button
    saveButton.style.display = "inline-flex";
    saveButton.style.marginRight = "8px";

    // Style the cancel button
    cancelButton.style.backgroundColor = "transparent";
    cancelButton.style.border = "none";
    cancelButton.style.padding = "0";
    cancelButton.style.width = "24px";
    cancelButton.style.height = "24px";
    cancelButton.style.display = "flex";
    cancelButton.style.justifyContent = "center";
    cancelButton.style.alignItems = "center";
    cancelButton.style.backgroundColor = "#dc3545";

    // cancelButton.innerHTML =
    //   '<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>';

    cancelButton.innerHTML =
      '<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z" fill="#ffffff"></path></svg>';

    // Style the cancel button
    cancelButton.style.display = "inline-flex";

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

  // setUpEventTable() {
  //   this.view.eventTable.addEventListener("click", (event) => {
  //     if (event.target.matches(".edit-button")) {
  //       const eventId = event.target.dataset.eventId;
  //       const eventItem = this.model.getEventById(eventId);

  //       console.log(eventItem);

  //       if (eventItem) {
  //         const {
  //           inputField,
  //           startDate,
  //           endDate,
  //           saveButton,
  //           cancelButton,
  //           row,
  //         } = this.view.editEventItem(eventItem);

  //         saveButton.addEventListener("click", async () => {
  //           const updatedEvent = {
  //             eventName: inputField.value,
  //             startDate: startDate.value,
  //             endDate: endDate.value,
  //           };

  //           const editedEvent = await this.model.editEvent(
  //             eventItem.id,
  //             updatedEvent
  //           );
  //           this.view.eventTable.removeChild(row);
  //           this.view.appendEvent(editedEvent);
  //         });

  //         cancelButton.addEventListener("click", () => {
  //           this.view.eventTable.removeChild(row);
  //           this.view.appendEvent(eventItem);
  //         });
  //       }
  //     } else if (event.target.matches(".delete-button")) {
  //       const eventId = event.target.dataset.eventId;
  //       const eventItem = this.model.getEventById(eventId);
  //       if (eventItem) {
  //         this.model.deleteEvent(eventItem.id);
  //         this.view.deleteEventItem(eventItem.id);
  //       }
  //     }
  //   });
  // }

  setUpEventTable() {
    this.view.eventTable.addEventListener("click", (event) => {
      let targetElement = event.target;

      // Check if the clicked element is a button or its parent is a button
      while (targetElement !== null) {
        if (targetElement.matches(".edit-button")) {
          const eventId = targetElement.dataset.eventId;
          const eventItem = this.model.getEventById(eventId);

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

            return; // Exit the event listener since the button was found
          }
        } else if (targetElement.matches(".delete-button")) {
          const eventId = targetElement.dataset.eventId;
          const eventItem = this.model.getEventById(eventId);

          if (eventItem) {
            this.model.deleteEvent(eventItem.id);
            this.view.deleteEventItem(eventItem.id);

            return; // Exit the event listener since the button was found
          }
        }

        // Move up to the parent element
        targetElement = targetElement.parentElement;
      }
    });
  }
}

// Driver Code
const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);
