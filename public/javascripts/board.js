
const result = fetch("http://localhost:3000/list", {
    method: "GET"
}).then(res => res.json()).then(res => {
    const arr = res.result
    
    console.log(arr[0])
    console.log(arr[0].title)
})