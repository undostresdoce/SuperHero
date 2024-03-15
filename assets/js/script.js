$(function () {
  const btnBusqueda = $("#btnBusqueda");
  const infoSuperheroes = $(".infoSuperheroes");
  const chartContainer = $("#chartContainer");
  const regex = /^[0-9]+$/;

  btnBusqueda.on("click", function (event) {
    event.preventDefault();
    const idSuperheroe = $("#idSuperheroe").val().trim();

    if (!validarNumero(idSuperheroe)) {
      mostrarError(
        "Por favor, ingresa un número entre el 1 y el 731, no letras"
      );
      return;
    }

    if (!validarRango(idSuperheroe)) {
      mostrarError("No existe ese héroe en la lista");
      return;
    }

    infoSuperheroes.html("");
    obtenerSuperheroe(idSuperheroe);
  });

  function validarNumero(numero) {
    return regex.test(numero);
  }

  function validarRango(numero) {
    const valor = parseInt(numero);
    return valor > 0 && valor <= 731;
  }

  function mostrarError(mensaje) {
    alert(mensaje);
  }

  function obtenerSuperheroe(idSuperheroe) {
    $.ajax({
      url: `https://www.superheroapi.com/api.php/4905856019427443/${idSuperheroe}`,
      method: "GET",
      success: function (data) {
        mostrarSuperheroe(data);
        mostrarGrafico(data);
      },
      error: function (err) {
        mostrarError(`Error: ${err.statusText}`);
      },
    });
  }

  function mostrarSuperheroe(data) {
    const alianzas = data.biography.aliases.map((item) => item);
    const html = `
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-6">
              <img src="${data.image.url}" class="img-fluid rounded-start" alt="${data.name}" />
            </div>
            <div class="col-md-6">
              <div class="card-body mt-5">
                <h3>¡Lo encontraste!</h3>
                <h5 class="card-title">Nombre: ${data.name}</h5>
                <p class="card-text">Conexiones: ${data.connections["group-affiliation"]}</p>
                <p class="card-text"><em>Publicado por:</em> ${data.biography.publisher}</p>
                <p class="card-text">Ocupación: ${data.work.occupation}</p>
                <p class="card-text">Primera aparición: ${data.biography["first-appearance"]}</p>
                <p class="card-text">Altura: ${data.appearance.height[1]}</p>
                <p class="card-text">Peso: ${data.appearance.weight[1]}</p>
                <p class="card-text">Alianzas: ${alianzas}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    infoSuperheroes.append(html);
  }

  function mostrarGrafico(data) {
    const options = {
      title: {
        text: `Estadísticas de poder de ${data.name}`,
      },
      data: [
        {
          type: "pie",
          startAngle: 45,
          showInLegend: true,
          legendText: "{label}",
          indexLabel: "{label} ({y})",
          yValueFormatString: "#,##0.#",
          dataPoints: [
            { label: "combate", y: data.powerstats.combat },
            { label: "durabilidad", y: data.powerstats.durability },
            { label: "inteligencia", y: data.powerstats.intelligence },
            { label: "poder", y: data.powerstats.power },
            { label: "velocidad", y: data.powerstats.speed },
            { label: "fuerza", y: data.powerstats.strength },
          ],
        },
      ],
    };

    chartContainer.css({ height: "300px", width: "90%" });
    chartContainer.CanvasJSChart(options);
  }
});
