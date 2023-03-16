const electron= require("electron");
const url=require("url")
const path=require("path");
const db=require("./lib/connection").db;


const { app,BrowserWindow,Menu,ipcMain} = electron;

let mainWindow, addWindow;


app.on("ready", () => {
    mainWindow=new BrowserWindow({
        resizable:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            enableRemoteModule:true
        }
     });
     mainWindow.on("close", ()=>{
        app.quit();
     })
    //PENCERE
     mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol: "file:",
            slashes: true
        })
    );
    //MENÜ
    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate) //templateinden bir menü üret 
    Menu.setApplicationMenu(mainMenu);

    //NEW TODO PENCERESİ EVENTLERİ

    ipcMain.on("newTodo:close", ()=>{
        addWindow.close();
        addWindow=null;
    })
    ipcMain.on("close", ()=>{
        app.quit();
    })

    ipcMain.on("newTodo:save", (err,data)=>{
        if(data){          
            db.query("INSERT INTO todos SET text = ?", data.todoValue, (e,r,f) =>{
                if(r.insertId > 0){
                    mainWindow.webContents.send("todo:addItem", {
                        id: r.insertId,
                        text: data.todoValue
                    })
                }
            })


           // mainWindow.webContents.send("todo:addItem", todo);
            if(data.ref=="new"){
                addWindow.close();
                addWindow.null;
            }
        }
        
    });
    //webcontentimin bulunduğu dom yüklenmişse bu fonksiyonu çalıştır.
    mainWindow.webContents.once("dom-ready", () => {
        db.query("select * from todos", (error,results,fields) => {
            mainWindow.webContents.send("initApp",results)//uygulama açıldığında kayıtların listelenmesi
        })
    })

    ipcMain.on("remove:todo", (e,id) => {
          db.query("DELETE FROM todos WHERE id =?", id, (e,r,f) =>{
            if(r.affectedRows>1){
                console.log("Silme işlemi başarılı.")
            }
          })
    })
});
const mainMenuTemplate=[
    {
      label: "Dosya",
      submenu: [
        {
            label: "Yapılacak İş Ekle",
            click(){
                createWindow();
            }
        },
        {
            label: "Tümünü sil"
        },
        {
            label: "Çıkış",
            accelerator: process.platform=="darwin" ? "Command+Q" : "Ctrl+Q", //kısa yol tuşu atamak için
            role: "quit"
        }
      ]
    }
]
if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push({
        label: "Geliştirici Araçları",
        submenu: [
            {
                label: "Geliştirici Ayarları", //f12 ayrıntılı
                click(item,focusedWindow){
                    //başka bir sayfayı açmak için butona bastığında hangi sayfada açacağını söyleyen focus
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: "Yenile",
                role: "reload" //Yenilemek için rolü
            }
        ]
    })
}

function createWindow(){
    addWindow = new BrowserWindow({
        frame:false,
        width: 480,
        height: 175,
        title: "Yeni Bir Pencere",
        resizable:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            enableRemoteModule:true
        }
    })
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "pages/newTodo.html"),
        protocol: "file:",
        slashes:true
    }));

    addWindow.on('close', () =>{
        addWindow=null;
    })

    
}
