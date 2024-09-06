const {ipcRenderer} = require('electron');

export function CreateReview(Date,Color,TopicId) {
    ipcRenderer.send('UPDATE',`INSERT INTO Review (Date,Color,Topic_Id) VALUES ('${Date}','${Color}',${TopicId})`);
}

export async function GetReviewsByTopicId(TopicId) {
    const result = await ipcRenderer.invoke('GET',`SELECT * FROM Review WHERE Topic_Id = ${TopicId}`);

    return result;
}