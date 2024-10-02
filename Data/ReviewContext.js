const {ipcRenderer} = require('electron');

export function CreateReview(Date,Color,TopicId) {
    ipcRenderer.send('UPDATE',`INSERT INTO Review (Date,Color,Topic_Id) VALUES ('${Date}','${Color}',${TopicId})`);
}

export async function GetReviewsByTopicId(TopicId) {
    const result = await ipcRenderer.invoke('GET',`SELECT * FROM Review WHERE Topic_Id = ${TopicId}`);

    return result;
}

export function DeleteReviewById(Id)
{
    ipcRenderer.send('UPDATE',`DELETE FROM Review WHERE Id = ${Id}`);
    console.log(`${Id} deleted from database`);
}

export async function GetLastReviewId() {
    return await ipcRenderer.invoke('GET',"SELECT * FROM sqlite_sequence WHERE name = 'Review'");
}

export function UpdateReviewById(Id,date,color)
{
    ipcRenderer.send('UPDATE',`UPDATE Review SET Date = '${date}', Color = '${color}' WHERE Id = ${Id}`);
}

export async function GetDistinctDates()
{
    return await ipcRenderer.invoke('GET','SELECT DISTINCT(Date)  FROM Review');    
}