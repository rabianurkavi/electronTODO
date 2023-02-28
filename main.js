const electron= require("electron");
const url=require("url")
const path=require("path");

const { app,BrowserWindow,Menu,ipcMain} = electron;

let mainWindow;//anasayfa

//uygulama hazır olduğu zaman bu fonksiyonu çalıştır
app.on('ready', () => {

    //pencerenin özelliklerine constructor ile imkan veriyor(boyutu,sağ,solu)
    mainWindow=new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
        }
     });
    console.log(process.platform)

    //pencereyi üretiyoruz nasıl? Html dosyasından
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "main.html"),
            protocol: "file:",
            slashes: true
        })
    );

    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate) //templateinden bir menü üret 
    Menu.setApplicationMenu(mainMenu);

    //ipcrenderer etkinlikleri eğer key isimli bir event gelirse fonk çalıştır
    //bu event bize iki tane argüman gönderir err ve veri veri html kısmında yazdığımız stringitr.
    ipcMain.on("key", (err,data) => {
        console.log(data);

    })
    ipcMain.on("key:inputValue", (err,data) => {
        console.log(data);
    })

});


//template her menü elemanımız arrayin objesidir arrayimiz mainmenutemplate
const mainMenuTemplate=[
    {
      label: "Dosya",
      submenu: [
        {
            label: "Yeni TODO EKLE"
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
//eğer production değilse o zaman mainmenu templatesine bu arkadaşı ekle objeyi
if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push({
        label: "Dev Tools",
        submenu: [
            {
                label: "Geliştirici Penceresini Aç", //f12 ayrıntılı
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