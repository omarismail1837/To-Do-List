const addbutton = document.getElementById("addtask");
addbutton.addEventListener("click", () => add_task());

const clearbutton = document.getElementById("clearall");
clearbutton.addEventListener("click", () => clear_all());

const list = document.getElementById("list");
const buttons = document.getElementById("buttons");
const filters = document.querySelectorAll('input[name="filter"]');
let currentFilter = "All";

pendingTasks = [];
completedTasks = [];

function add_task() {
    if (buttons.lastElementChild.tagName.toLowerCase() == "form") return;

    let form = document.createElement("form");
    let popup = document.createElement("input");
    popup.placeholder = "Enter Task...";
    let submit = document.createElement("input");
    submit.type="submit"
    submit.id="popup";
    form.append(popup);
    form.append(submit);
    buttons.append(form);
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        buttons.removeChild(form);

        msg = popup.value.trim();

        if (!msg) return;

        let newTask = document.createElement("li");
        newTask.className = "unchecked";

        let checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.classList = "check";

        let deletebutton = document.createElement("input");
        deletebutton.type = "button";
        deletebutton.classList = "delete"

        let msgElement = document.createElement("span");
        msgElement.innerHTML = msg;

        newTask.append(checkBox);
        newTask.append(msgElement);
        newTask.append(deletebutton);

        pendingTasks.unshift(newTask);
        
        checkBox.addEventListener("change", () =>{
            if (newTask.className == "checked") {
                newTask.className = "unchecked";
                //remove from completed
                list.removeChild(newTask);
                
                let index = completedTasks.indexOf(newTask);
                
                if (index !== -1) {
                    completedTasks.splice(index, 1);
                }

                //add to pending
                list.prepend(newTask);
                pendingTasks.unshift(newTask);
            }            
            else {
                newTask.className = "checked";
                //remove from pending
                list.removeChild(newTask);
                
                let index = pendingTasks.indexOf(newTask);
                
                if (index !== -1) {
                    pendingTasks.splice(index, 1);
                }

                //add to completed
                list.appendChild(newTask);
                completedTasks.push(newTask);
            }

        })

        deletebutton.addEventListener("click", () => {
            list.removeChild(newTask);
            if (newTask.className == "unchecked") {
                let index = pendingTasks.indexOf(newTask);
                
                if (index !== -1) {
                    pendingTasks.splice(index, 1);
                }
            }
            else {
                let index = completedTasks.indexOf(newTask);
                
                if (index !== -1) {
                    completedTasks.splice(index, 1);
                }
            }
        })
        if (currentFilter == "Completed")
            list.prepend(newTask);
    });
}

function clear_all() {
    list.innerHTML = "";
    pendingTasks = [];
    completedTasks = [];
}

filters.forEach(radio => {
  radio.addEventListener('change', () => {
    const selected = document.querySelector('input[name="filter"]:checked');
    currentFilter = selected.value;
    if (currentFilter == "All") {
        list.innerHTML = "";
        pendingTasks.forEach(pendingTask => {
            list.appendChild(pendingTask);
        })
        completedTasks.forEach(completedTask => {
            list.appendChild(completedTask);
        })

    }
    else if (currentFilter == "Pending") {
        list.innerHTML = "";
        pendingTasks.forEach(pendingTask => {
            list.appendChild(pendingTask);
        })
    }
    else if (currentFilter == "Completed") {
        list.innerHTML = "";
        completedTasks.forEach(completedTask => {
            list.appendChild(completedTask);
        })
    }
  });
});