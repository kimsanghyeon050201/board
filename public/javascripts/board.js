// const table = document.querySelector(".tg")
const table = document.getElementById("calculator_table")

const result = fetch("http://localhost:3000/list", {
    method: "GET"
}).then(res => res.json()).then(res => {
    const arr = res.result

    for (let i = 0; i < Object.keys(arr).length; i++) {
        // addRow(arr[i].title, arr[i].name, arr[i].la_time, arr[i].views)
    }
})

addRow = (title, name, time, views) => {
    let newRow = table.insertRow(table.lenght)
    const cell_length = table.rows[1].cells.length

    for (let i = 0; i < cell_length; i++) {
        const new_cell = new_row.insertCell(i);
        let temp_html = ``;
        if (i === 0) {
            temp_html = `<td class="tg-c3ow1"><input type="checkbox" name="ch1" ></td>`;
        } else if (i === 1) {
            temp_html = `<td class="tg-abip1">${title}</td>`;
        } else if (i === 2) {
            temp_html = `<td class="tg-c3ow1">${name}</td>`;
        } else if (i === 3) {
            temp_html = `<td class="tg-abip1">${time}</td>`;
        } else if (i === 4) {
            temp_html = `<td class="tg-c3ow1">${views}</td>`
        };
        new_cell.insertAdjacentHTML('afterbegin', temp_html);
    }
}