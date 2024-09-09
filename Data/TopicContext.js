const {ipcRenderer} = require('electron');

export async function CreateTopic(Topic,Subject)
{
    const SubjectInfo = await ipcRenderer.invoke('GET',`SELECT Id,TotalTopics FROM Subjects WHERE Name = '${Subject}'`);
    
    ipcRenderer.send('UPDATE',`INSERT INTO Topic (Name,Subject_Id) VALUES ('${Topic}',${SubjectInfo[0].Id});`);
    ipcRenderer.send('UPDATE',`UPDATE Subjects SET TotalTopics  = ${SubjectInfo[0].TotalTopics + 1} WHERE Id = ${SubjectInfo[0].Id}`)

    console.log(`Topic ${Topic} created for subject ${SubjectInfo[0].Id} and count is ${SubjectInfo[0].TotalTopics + 1}`);
}

export async function GetAllTopicsBySubjectName(Subject)
{
    const SubjectId = await ipcRenderer.invoke('GET',`SELECT Id FROM Subjects WHERE Name = '${Subject}'`);

    const result = ipcRenderer.invoke('GET',`SELECT * FROM Topic WHERE Subject_Id = ${SubjectId[0].Id}`);

    return result;
}

export async function GetLastTopicId() {
    return await ipcRenderer.invoke('GET',`SELECT * FROM sqlite_sequence where name = 'Topic'`);
}