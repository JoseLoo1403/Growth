const {ipcRenderer} = require('electron');

export function CreateSubject(Subject)
{
    ipcRenderer.send("UPDATE",`INSERT INTO Subjects (Name, Description) VALUES ('${Subject.Name}', '${Subject.Description}')`);
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

export async function UpdateLastReviewById(SubjectId)
{
    const Dates = await ipcRenderer.invoke('GET',`SELECT DISTINCT Date FROM Review WHERE Topic_Id IN (SELECT Id FROM Topic WHERE Subject_Id = ${SubjectId})`);
    let MaxDate = new Date(Dates[0].Date);
    Dates.shift();
    let comp;

    Dates.forEach(d => {
        comp = new Date(d.Date);

        if(comp > MaxDate)
        {
            MaxDate = comp;
        }
    });

    ipcRenderer.send('UPDATE',`UPDATE Subjects SET LastReview = '${MaxDate.getFullYear()}/${(MaxDate.getMonth()+1).toString().padStart(2, '0')}/${MaxDate.getDate().toString().padStart(2, '0')}' WHERE Id = ${SubjectId}`);
}

export async function GetSubjectByName(Name)
{
    const rows = await ipcRenderer.invoke('GET',`SELECT * FROM Subjects WHERE Name = '${Name}'`);
    return rows[0];
}

export function DeleteFullSubjectById(Id)
{
    //Eliminating reviews
    ipcRenderer.send('UPDATE',`DELETE FROM Review WHERE Topic_Id IN(SELECT Id FROM Topic WHERE Subject_Id = ${Id})`);

    //Delete topics
    ipcRenderer.send('UPDATE',`DELETE FROM Topic WHERE Subject_Id = ${Id}`);

    //Delete exam
    ipcRenderer.send('UPDATE',`DELETE FROM Exam WHERE Id = (SELECT Exam_Id FROM Subjects WHERE Id = ${Id})`);

    //Delete subject
    ipcRenderer.send('UPDATE',`DELETE FROM Subjects WHERE Id = ${Id}`);
}

export function EditSubjectById(Id,NewName,NewDesc){
    ipcRenderer.send('UPDATE',`UPDATE Subjects SET name = '${NewName}', Description = '${NewDesc}' WHERE Id = ${Id}`);
}

export async function GetLastSubjectId(){
    return await ipcRenderer.invoke('GET',"SELECT * FROM sqlite_sequence WHERE name = 'Subjects'");
}