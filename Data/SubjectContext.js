const {ipcRenderer} = require('electron');

export function CreateSubject(Subject)
{
    ipcRenderer.send("UPDATE",`INSERT INTO Subjects (Name, Description) VALUES ('${Subject.Name}', '${Subject.Description}')`);
    console.log(`Subject ${Subject.Name} created`);
}

export async function GetAllSubjects()
{
    console.log('Getting subjects');
    const rows = await ipcRenderer.invoke('GET',`SELECT * FROM Subjects`);
    return rows;
}

export function UpdateLastReviewByTopicId(Date,TopicId)
{
    console.log('LAST REVIEW UPDATED');
    ipcRenderer.send('UPDATE',`UPDATE Subjects SET LastReview = '${Date}' WHERE Id = (SELECT Subject_Id FROM Topic WHERE Topic.Id = ${TopicId})`);
}