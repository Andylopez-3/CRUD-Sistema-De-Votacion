
// JAVASCRIPT PURO - Maneja interacciones del lado del cliente

// Función para votar por un tema
function votarTema(idTema) {
  fetch(`/topics/${idTema}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(respuesta => respuesta.json())
  .then(datos => {
    if (datos.success) {
      // Actualizar el contador en tiempo real
      const elementoVotos = document.getElementById(`topic-votes-${idTema}`);
      elementoVotos.textContent = datos.votes;
      
      // Animación visual
      elementoVotos.classList.add('animacion-voto');
      setTimeout(() => {
        elementoVotos.classList.remove('animacion-voto');
      }, 500);

      // Recargar la página para reordenar los temas
      setTimeout(() => {
        location.reload();
      }, 600);
    }
  })
  .catch(error => {
    console.error('Error al votar:', error);
    alert('Error al registrar el voto');
  });
}

// Función para votar por un enlace
function votarEnlace(idTema, idEnlace) {
  fetch(`/topics/${idTema}/links/${idEnlace}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(respuesta => respuesta.json())
  .then(datos => {
    if (datos.success) {
      // Actualizar el contador en tiempo real
      const elementoVotos = document.getElementById(`link-votes-${idTema}-${idEnlace}`);
      elementoVotos.textContent = datos.votes;
      
      // Animación visual
      elementoVotos.classList.add('animacion-voto');
      setTimeout(() => {
        elementoVotos.classList.remove('animacion-voto');
      }, 500);

      // Recargar para reordenar enlaces
      setTimeout(() => {
        location.reload();
      }, 600);
    }
  })
  .catch(error => {
    console.error('Error al votar:', error);
    alert('Error al registrar el voto');
  });
}

// Función para mostrar/ocultar formulario de edición de tema
function alternarEditarTema(idTema) {
  const formularioEdicion = document.getElementById(`edit-topic-${idTema}`);
  if (formularioEdicion.style.display === 'none') {
    formularioEdicion.style.display = 'block';
  } else {
    formularioEdicion.style.display = 'none';
  }
}

// Función para mostrar/ocultar formulario de agregar enlace
function alternarAgregarEnlace(idTema) {
  const formularioAgregar = document.getElementById(`add-link-${idTema}`);
  if (formularioAgregar.style.display === 'none') {
    formularioAgregar.style.display = 'block';
  } else {
    formularioAgregar.style.display = 'none';
  }
}

// Función para mostrar/ocultar formulario de edición de enlace
function alternarEditarEnlace(idTema, idEnlace) {
  const formularioEdicion = document.getElementById(`edit-link-${idTema}-${idEnlace}`);
  if (formularioEdicion.style.display === 'none') {
    formularioEdicion.style.display = 'block';
  } else {
    formularioEdicion.style.display = 'none';
  }
}
