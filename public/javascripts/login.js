
const id = document.querySelector("#floatingInput")
const pw = document.querySelector("#floatingInputPw")
const btn = document.querySelector("#btn1")

btn.addEventListener("click", () => {
    res = fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'id': id.value,
            'pw': pw.value
        })
    }).then(result => {
        return result.json()
    }).then(result => {
        const value = result.result
        
        if(value === undefined){
            alert("실패")
        }else{
            console.log(value.name)
            alert("성공")
            window.localStorage.setItem('name', value.name)
            location.href=("http://localhost:3000/board")
        }
    })
})

