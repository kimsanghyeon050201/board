
const id = document.querySelector("#floatingInput")
const pw = document.querySelector("#floatingInputPw")
const btn = document.querySelector("#btn1")

btn.addEventListener("click", ()=>{
    const res = fetch("/login", {
        method : "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body : JSON.stringify({
            'id': id.value,
            'pw' : pw.value
        })
    }).then(reuslt => reuslt.json).then(reuslt => {
        alert(reuslt)
    })
})

