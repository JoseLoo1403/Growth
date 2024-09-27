import {GetExamById,DeleteExamById} from "../../Data/ExamContext.js"

async function OpenExamInfo(Exam_Id)
{
    const exam = await GetExamById(Exam_Id);
    const InfoForm = elementFromHtml(`
    <div class="Cover-Screen">
        <div class="Show-Exam">
            <div class="width:100%">
                <button class="Exam-Close" onclick="CloseAddExam(this)">x</button>
            </div>
            <H2>${localStorage.getItem('Current-Subject')} Exam</H2>
            <h3>
                Date: ${exam.Date}
            </h3>
            <p>
                ${exam.Description}
            </p>
            <div style="width: 100%; margin-top: auto; margin-bottom: 10px;">
                <button class="Btn-Del" style="display: block; margin-left: 70%;" onclick="DeleteExam(${Exam_Id})">Remove</button>
            </div>
        </div>
    </div>`);

    document.body.appendChild(InfoForm);
}

window.OpenExamInfo = OpenExamInfo;

function DeleteExam(Id)
{
    DeleteExamById(Id);
    location.reload();
}

window.DeleteExam = DeleteExam;

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}
