const {ipcRenderer} = require('electron');

export async function CreateTopic(Topic,Subject)
{
    const SubjectId = await ipcRenderer.invoke('GET',`SELECT Id FROM Subjects WHERE Name = '${Subject}'`);
    
    ipcRenderer.send('UPDATE',`INSERT INTO Topic (Name,Subject_Id) VALUES ('${Topic}',${SubjectId[0].Id});`);

    console.log(`Topic ${Topic} created for subject ${SubjectId[0].Id}`);
}

export async function GetAllTopicsBySubjectName(Subject)
{
    const SubjectId = await ipcRenderer.invoke('GET',`SELECT Id FROM Subjects WHERE Name = '${Subject}'`);

    const result = ipcRenderer.invoke('GET',`SELECT * FROM Topic WHERE Subject_Id = ${SubjectId[0].Id}`);

    console.log(result);

    return result;
}

export async function GetLastTopicId() {
    return await ipcRenderer.invoke('GET',`SELECT * FROM sqlite_sequence where name = 'Topic'`);
}