const electron= require("electron");
const url=require("url")
const path=require("path");

const { app,BrowserWindow,Menu,ipcMain} = electron;

let mainWindow;
app.on("ready", () => {



    mainWindow=new BrowserWindow({
        resizable:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            
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
})
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
        resizable:false
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