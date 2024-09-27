const {ipcRenderer} = require('electron');
import {CleanSqlString} from "../Helpers/SqlCleaner.js"


export function CreateNewExam(Description, Date, SubjectName) {
    //Description = CleanSqlString(Description);
    ipcRenderer.send('UPDATE',`INSERT INTO Exam (Description,Date) VALUES ('${CleanSqlString(Description)}','${Date}')`);
    ipcRenderer.send('UPDATE', `UPDATE Subjects SET Exam_Id = (SELECT seq FROM sqlite_sequence WHERE name = 'Exam') WHERE Name = '${SubjectName}'`);
}

export async function GetExamById(Id)
{
    const rows = await ipcRenderer.invoke('GET',`SELECT * FROM Exam WHERE Id = ${Id}`);
    return rows[0];
}

export function DeleteExamById(Id)
{
    ipcRenderer.send('UPDATE',`UPDATE Subjects SET Exam_Id = NULL WHERE Exam_Id = ${Id}`);
    ipcRenderer.send('UPDATE',`DELETE FROM Exam WHERE Id = ${Id}`);
}