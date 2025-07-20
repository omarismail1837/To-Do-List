// Get buttons and elements from HTML
const addbutton = document.getElementById("addtask");
addbutton.addEventListener("click", () => add_task());

const clearbutton = document.getElementById("clearall");
clearbutton.addEventListener("click", () => clear_all());

const list = document.getElementById("list"); // List container
const formContainer = document.getElementById("buttons"); // Button container
const filters = document.querySelectorAll('input[name="filter"]'); // Radio filter buttons

// State variables
let currentFilter = "All";
let pendingTasks = [];
let completedTasks = [];

// Adds a new task via popup input form
function add_task() {
    // Prevent multiple forms from being added
    if (formContainer.lastElementChild.tagName.toLowerCase() == "form") return;

    let form = document.createElement("form");
    let popup = document.createElement("input");
    popup.placeholder = "Enter Task...";

    let submit = document.createElement("input");
    submit.type = "submit";

    form.append(popup);
    form.append(submit);
    formContainer.append(form);

    // Wait for task message to be entered before creating it
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        formContainer.removeChild(form); // Delete popup

        let msg = popup.value.trim();
        if (!msg) return; // Do nothing if empty

        let newTask_dic = {
            "message": msg,
            "status": "unchecked"
        };

        let newTask_html = dic_to_html(newTask_dic);

        pendingTasks.unshift(newTask_html); // Add to pending list

        if (currentFilter !== "Completed")
            list.prepend(newTask_html); // Show it if filter allows

        save_to_storage();
    });
}

// Clears all tasks
function clear_all() {
    list.innerHTML = "";
    pendingTasks = [];
    completedTasks = [];
    save_to_storage();
}

// Filter switching logic
filters.forEach(radio => {
    radio.addEventListener('change', () => {
        const selected = document.querySelector('input[name="filter"]:checked');
        currentFilter = selected.value;
        
        apply_filter();
        save_to_storage();

    });
});

function apply_filter() {
    // Clear current list
    list.innerHTML = "";

    // If filter is not "Completed", show all pending tasks
    if (currentFilter != "Completed") {
        pendingTasks.forEach(task => list.appendChild(task));
    } 

    // If filter is not "Pending", show all completed tasks
    if (currentFilter != "Pending") {
        completedTasks.forEach(task => list.appendChild(task));
    }
}

// Converts a dictionary to an HTML list item
function dic_to_html(task_dic) {
    let task_element = document.createElement("li");
    task_element.className = task_dic["status"];

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "check";
    checkBox.checked = (task_dic["status"] === "checked");

    let deletebutton = document.createElement("input");
    deletebutton.type = "button";
    deletebutton.className = "delete";

    let msgElement = document.createElement("span");
    msgElement.textContent = task_dic["message"];

    task_element.append(checkBox);
    task_element.append(msgElement);
    task_element.append(deletebutton);

    // Handle checking/unchecking
    add_checkbox_listener(task_element);

    // Handle deletion
    add_delete_listener(task_element);

    return task_element;
}

function add_checkbox_listener(task_element) {
    const checkBox = task_element.querySelector(".check");

    checkBox.addEventListener("change", () => {
        // Toggle status class
        task_element.className = (task_element.className === "checked" ? "unchecked" : "checked");

        if (task_element.className == "checked") {
            // Move from pending -> completed
            let index = pendingTasks.indexOf(task_element);
            if (index !== -1) pendingTasks.splice(index, 1);
            completedTasks.push(task_element);
        } else {
            // Move from completed -> pending
            let index = completedTasks.indexOf(task_element);
            if (index !== -1) completedTasks.splice(index, 1);
            pendingTasks.unshift(task_element);
        }

        // Remove from current position regardless of filter
        list.removeChild(task_element);

        // Re-insert in correct position only if filter is "All"
        if (currentFilter === "All") {
            if (task_element.className === "checked") {
                list.appendChild(task_element);   // Move completed to end
            } else {
                list.prepend(task_element);      // Move pending to top
            }
        }

        save_to_storage();
    });
}

function add_delete_listener(task_element) {
    const deletebutton = task_element.querySelector(".delete")
    deletebutton.addEventListener("click", () => {
    list.removeChild(task_element);

    if (task_element.className === "unchecked") {
        let index = pendingTasks.indexOf(task_element);
        if (index !== -1) pendingTasks.splice(index, 1);
    } 
    else {
        let index = completedTasks.indexOf(task_element);
        if (index !== -1) completedTasks.splice(index, 1);
    }

    save_to_storage();

    });
}

// Converts an HTML task element back into a dictionary
function html_to_dic(task_element) {
    let msg = task_element.querySelector("span").textContent;
    let status = task_element.className;

    return {
        "message": msg,
        "status": status
    };
}

// Saves task state to localStorage
function save_to_storage() {
    const pendingData = pendingTasks.map(html_to_dic);
    const completedData = completedTasks.map(html_to_dic);

    localStorage.setItem("pendingTasks", JSON.stringify(pendingData));
    localStorage.setItem("completedTasks", JSON.stringify(completedData));
    localStorage.setItem("filter", JSON.stringify(currentFilter));
}

// Loads saved state from localStorage
function load_from_storage() {
    const pendingData = JSON.parse(localStorage.getItem("pendingTasks") || "[]");
    const completedData = JSON.parse(localStorage.getItem("completedTasks") || "[]");
    currentFilter = JSON.parse(localStorage.getItem("filter") || '"All"');

    list.innerHTML = "";

    //create tasks arrays
    pendingTasks = pendingData.map(dic_to_html);
    completedTasks = completedData.map(dic_to_html);

    apply_filter() 

    // Set the radio button to match current filter
    filters.forEach(radio => {
        radio.checked = (radio.value == currentFilter);
    });
}

// Start the app
load_from_storage();
