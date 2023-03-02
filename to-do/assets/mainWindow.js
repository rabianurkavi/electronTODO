const electron = require("electron")
const { ipcRenderer } = electron

checkTodoCount()

ipcRenderer.on("todo:addItem", (err, todo) => {
    //container
const container= document.querySelector(".todo-container")

//row
const row = document.createElement("div")
row.className = "row"

//col
const col =document.createElement("div")
col.className="todo-item p-2 mb-3 text-light bg-dark col-md-8 offset-2 shadow card d-flex justify-content-center flex-row align-items-center"
//col.style.backgroundColor="#b2e2eb!important"

//p
const p =document.createElement("p")
p.className="m-0 w-100"
p.innerText = todo.text


//Sil Btn
const deleteBtn= document.createElement("button")
deleteBtn.className= "btn btn-sm btn-outline-danger flex-shrink-1"
deleteBtn.innerText= "X"

//deleteBtn e tıklanıldığında event ortaya çıkacak
deleteBtn.addEventListener("click", () =>{
    if(confirm("Bu kaydı silmek istediğinizden emin misiniz?")){
        //TODO
    }
})

col.appendChild(p);
col.appendChild(deleteBtn);

row.appendChild(col);

container.appendChild(row);
checkTodoCount()

})

//alert ile uyarı vermek için verinin olup olmadığı
function checkTodoCount(){
    const container = document.querySelector(".todo-container")
    const alertContainer = document.querySelector(".alert-container")

    if(container.children.length!=0){
        alertContainer.style.display="none"
    }else{
        alertContainer.style.display="block"
    }
}


