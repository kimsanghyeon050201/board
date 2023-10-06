// const table = document.querySelector(".tg")
const table = document.getElementById("calculator_table")
const delBtn = document.getElementById('delBtn')

fetch("http://localhost:3000/list", {
    method: "GET"
}).then(res => res.json()).then(res => {
    const arr = res.result

    //테이블 초기화
    for (let i = 0; i < Object.keys(arr).length; i++) {
        addRow(arr[i].title, arr[i].name, arr[i].la_time, arr[i].views, arr[i].id)
    }

    //id 컬럼 가리기
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[5].style.display = 'none'
    }
})

delBtn.addEventListener('click', () => {

    let checkBoxs = table.getElementsByTagName('input')

    for (let i = 0; i < checkBoxs.length; i++) {
        if (checkBoxs[i].type === 'checkbox') {
            if (checkBoxs[i].checked) {
                let row = table.rows[i + 1]
                console.log(row.cells[5].innerText)
                fetch("/delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify({
                        'id' : row.cells[5].innerText
                    })
                }).then(res=>res.json()).then(res=>{
                    if(res.message === 'success'){
                        alert('성공')
                    }
                })
            }
        }
    }
})

function addRow(title, name, time, views, id) {
    let newRow = table.insertRow(table.lenght)
    // const cell_length = table.rows[1].cells.length

    for (let i = 0; i < 6; i++) {
        const new_cell = newRow.insertCell(i);
        let temp_html = ``;
        if (i === 0) {
            let checkBox = document.createElement('input')
            checkBox.type = 'checkbox'
            new_cell.appendChild(checkBox)
            continue
        } else if (i === 1) {
            temp_html = `<td class="tg-abip1">${title}</td>`;
        } else if (i === 2) {
            temp_html = `<td class="tg-c3ow1">${name}</td>`;
        } else if (i === 3) {
            temp_html = `<td class="tg-abip1">${time}</td>`;
        } else if (i === 4) {
            temp_html = `<td class="tg-c3ow1">${views}</td>`
        } else if (i === 5) {
            temp_html = `<td class="tg-c3ow1" style="display: none;">${id}</td>`
        };
        new_cell.innerHTML = temp_html

    }

}