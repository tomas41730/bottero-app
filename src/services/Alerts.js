import Swal from 'sweetalert2' 

export function deleteAlert(msg, name, callback1, callback2) 
{
    Swal.fire({
        title: msg + ' "'+ name +'".',
        text: "Una vez eliminado no se podran revertir los cambios. ¿Desea continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
            createAlert('Eliminacion realizada con exito.')
              callback1()
        }
        else{
            callback2()
        }
      })
}

export function deleteAlertWithImage(msg, description, photo, callback1, callback2) 
{
    Swal.fire({
        title: msg + description,
        text: "Una vez eliminado no se podran revertir los cambios. ¿Desea eliminar el producto?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        imageUrl: photo,
        imageWidth: 400,
        imageHeight: 400,
        imageAlt: 'Custom image',
      }).then((result) => {
        if (result.isConfirmed) {
            createAlert('Eliminacion realizada con exito.')
              callback1()
        }
        else{
            callback2()
        }
      })
}

export function createAlert(msg, type)
{
    if(type === 'success')
    {
      Swal.fire({
        icon: 'success',
        title: msg,
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if(type === 'error')
    {
      Swal.fire({
        icon: 'error',
        title: msg
      });
    }

}

export function showImage(item){
  Swal.fire({
    title: item.name,
    text: item.phone,
    imageUrl: item.photo,
    imageWidth: 400,
    imageHeight: 400,
    imageAlt: 'Custom image',
  })
}

export function uploadAlert(time)
{
  let timerInterval;
  Swal.fire({
    title: 'Subiendo imagen!',
    html: 'Restan <b></b> milisegundos.',
    timer: time,
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  });
}