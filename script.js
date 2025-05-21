const preguntas = [
    // Eje económico
    { texto: "El Estado debe intervenir fuertemente en la economía", eje: "economía" },
    { texto: "Los impuestos altos son necesarios para una mejor redistribución", eje: "economía" },
    { texto: "Los servicios públicos deben ser totalmente estatales", eje: "economía" },
    { texto: "La privatización ha dañado al país", eje: "economía" },
    { texto: "El salario mínimo debería aumentar incluso si afecta al empleo", eje: "economía" },
    // Eje autoridad
    { texto: "Se necesitan penas más fuertes para reducir el crimen", eje: "autoridad" },
    { texto: "La policía debe tener más autoridad en las calles", eje: "autoridad" },
    { texto: "Colombia necesita mano dura para avanzar", eje: "autoridad" },
    { texto: "Las protestas deben tener límites estrictos", eje: "autoridad" },
    { texto: "El orden es más importante que la libertad individual", eje: "autoridad" },
    // Eje sociedad
    { texto: "Se deben garantizar más derechos a las minorías", eje: "sociedad" },
    { texto: "El matrimonio igualitario debe estar protegido por ley", eje: "sociedad" },
    { texto: "El aborto debe ser legal en todos los casos", eje: "sociedad" },
    { texto: "Se debe invertir más en educación pública", eje: "sociedad" },
    { texto: "El Estado debe combatir activamente el machismo", eje: "sociedad" },
    // Preguntas mixtas
    { texto: "Las FFAA deben tener más presupuesto", eje: "autoridad" },
    { texto: "Los empresarios son responsables de la desigualdad", eje: "economía" },
    { texto: "Los derechos humanos deben estar por encima de la seguridad", eje: "sociedad" },
    { texto: "El mercado debe autorregularse sin intervención estatal", eje: "economía" },
    { texto: "Debemos proteger nuestras tradiciones frente a la globalización", eje: "sociedad" }
  ];
  
  const partidos = {
    "Pacto Histórico":      { economía: 100, autoridad: 30, sociedad: 90 },
    "Centro Democrático":   { economía: 20,  autoridad: 90, sociedad: 30 },
    "Partido Liberal":      { economía: 60,  autoridad: 50, sociedad: 60 },
    "Partido Conservador":  { economía: 40,  autoridad: 80, sociedad: 40 },
    "Verde / Alianza":      { economía: 70,  autoridad: 40, sociedad: 80 }
  };
  
  const respuestas = [];
  
  window.onload = () => {
    const form = document.getElementById("quizForm");
    preguntas.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "mb-3";
      div.innerHTML = `
        <label class="form-label">${i + 1}. ${p.texto}</label>
        <select class="form-select" onchange="guardarRespuesta(${i}, this.value)">
          <option value="">Selecciona una opción</option>
          <option value="1">Muy en desacuerdo</option>
          <option value="2">En desacuerdo</option>
          <option value="3">Neutral</option>
          <option value="4">De acuerdo</option>
          <option value="5">Muy de acuerdo</option>
        </select>
      `;
      form.appendChild(div);
      respuestas.push(null);
    });
  };
  
  function guardarRespuesta(index, valor) {
    respuestas[index] = parseInt(valor);
  }
  
  function calcularResultados() {
    if (respuestas.includes(null)) {
      alert("Responde todas las preguntas antes de continuar.");
      return;
    }
  
    const puntajes = { economía: 0, autoridad: 0, sociedad: 0 };
    const conteo = { economía: 0, autoridad: 0, sociedad: 0 };
  
    respuestas.forEach((res, i) => {
      const eje = preguntas[i].eje;
      puntajes[eje] += res;
      conteo[eje]++;
    });
  
    const resultados = {
      economía: Math.round((puntajes.economía - conteo.economía) / (conteo.economía * 4) * 100),
      autoridad: Math.round((puntajes.autoridad - conteo.autoridad) / (conteo.autoridad * 4) * 100),
      sociedad: Math.round((puntajes.sociedad - conteo.sociedad) / (conteo.sociedad * 4) * 100),
    };
  
    const radar = document.getElementById("resultChart").getContext("2d");
    if (window.chartInstance) window.chartInstance.destroy();
  
    // Dataset del usuario
    const datasets = [{
      label: "Tú",
      data: [resultados.economía, resultados.autoridad, resultados.sociedad],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2
    }];
  
    // Agregar cada partido político al gráfico
    for (const [nombre, valores] of Object.entries(partidos)) {
      datasets.push({
        label: nombre,
        data: [valores.economía, valores.autoridad, valores.sociedad],
        fill: false,
        borderColor: getRandomColor(),
        borderDash: [5, 5],
        pointRadius: 3
      });
    }
  
    window.chartInstance = new Chart(radar, {
      type: "radar",
      data: {
        labels: ["Economía (izq-der)", "Autoridad (lib-aut)", "Sociedad (progres-trad)"],
        datasets: datasets
      },
      options: {
        elements: {
          line: {
            tension: 0.3
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { display: true },
            ticks: { stepSize: 20 }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  
    // Encuentra el partido más cercano
    let partidoCercano = null;
    let menorDistancia = Infinity;
  
    for (const [nombre, valores] of Object.entries(partidos)) {
      const distancia = Math.sqrt(
        Math.pow(resultados.economía - valores.economía, 2) +
        Math.pow(resultados.autoridad - valores.autoridad, 2) +
        Math.pow(resultados.sociedad - valores.sociedad, 2)
      );
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        partidoCercano = nombre;
      }
    }
  
    document.getElementById("partidoResultado").innerHTML = `
      <h4 class="mt-4">Te pareces más a: <span class="text-primary">${partidoCercano}</span></h4>
      <p>Compara tu perfil con los principales partidos políticos colombianos en el gráfico de arriba.</p>
    `;
  }
  
  // Función para colores aleatorios
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  