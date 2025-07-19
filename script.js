const addbutton = document.getElementById("addtask");
addbutton.addEventListener("click", () => add_task());

const clearbutton = document.getElementById("clearall");
clearbutton.addEventListener("click", () => clear_all());

const list = document.getElementById("list");
const buttons = document.getElementById("buttons");

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
        
        checkBox.addEventListener("change", () =>{
            if (newTask.className == "checked")
                newTask.className = "unchecked";
            else 
                newTask.className = "checked";
        })

        deletebutton.addEventListener("change", () => {
            list.removeChild(newTask);
        })

        list.append(newTask);
    });
}

function clear_all() {
    list.innerHTML = "";
}