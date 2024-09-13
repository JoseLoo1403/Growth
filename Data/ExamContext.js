const {ipcRenderer} = require('electron');


export function CreateNewExam(Description, Date, SubjectName) {
    ipcRenderer.send('UPDATE',`INSERT INTO Exam (Description,Date) VALUES ('${Description}','${Date}')`);
    ipcRenderer.send('UPDATE', `UPDATE Subjects SET Exam_Id = (SELECT seq FROM sqlite_sequence WHERE name = 'Exam') WHERE Name = '${SubjectName}'`);
}

export async function GetExamById(Id)
{
    const rows = ipcRenderer.invoke('GET',`SELECT * FROM Exam WHERE Id = ${Id}`);
    return rows[0];
}