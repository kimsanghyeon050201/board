const exampleModal = document.getElementById('exampleModal')
const btn = document.getElementById('saveBtn')
const title = document.getElementById('title-name')
const content = document.getElementById('message-text')

btn.addEventListener('click', () => {

  fetch('http://localhost:3000/list/post', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "title" : title.value,
      "content": content.value,
      "name":window.localStorage.getItem('name')
    })
  }).then(res => res.json()).then((res)=>{
    if(res.message === 'success'){
      alert("완료")
    }
  }).catch((err)=>{
    console.log(`err : ${err}`)
    alert('error')
  })
})

if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalBodyInput = exampleModal.querySelector('.modal-body input')

    modalTitle.textContent = `New message to ${recipient}`
    modalBodyInput.value = recipient
  })
}