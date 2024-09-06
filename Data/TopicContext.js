const {ipcRenderer} = require('electron');

export async function CreateTopic(Topic,Subject)
{
    const SubjectId = await ipcRenderer.invoke('GET',`SELECT Id FROM Subjects WHERE Name = '${Subject}'`);
    
    ipcRenderer.send('UPDATE',`INSERT INTO Topic (Name,Subject_Id) VALUES ('${Topic}',${SubjectId[0].Id});`);

    console.log(`Topic ${Topic} created for subject ${SubjectId[0].Id}`);
}