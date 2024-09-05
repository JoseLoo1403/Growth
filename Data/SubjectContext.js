const {ipcRenderer} = require('electron');

export function CreateSubject(Subject)
{
    ipcRenderer.send("UPDATE",`INSERT INTO Subjects (Name, Description) VALUES ('${Subject.Name}', '${Subject.Description}')`);
    console.log(`Subject ${Subject.Name} created`);
}

export function GetAllSubjects()
{
    console.log('Getting subjects');
    ipcRenderer.send("GET",`SELECT * FROM Subjects`);
}