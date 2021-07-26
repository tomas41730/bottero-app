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

export function createAlert(msg)
{
    Swal.fire({
        icon: 'success',
        title: msg,
        showConfirmButton: false,
        timer: 1500
      })
}