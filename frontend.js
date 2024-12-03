const protocolo = "http://"
const baseURL = "api.openweathermap.org"
const APIKey = "ef0b0973b783e0614ac87612ec04344b"

async function obterCoordenadas(nomeDaCidade)
{
  if(!nomeDaCidade)
    return -1

  const limite = 1

  const coordenadasEndPoint = `/geo/1.0/direct?q=${nomeDaCidade}&limit=${limite}&appid=${APIKey}`
  const URLCompleta = `${protocolo}${baseURL}${coordenadasEndPoint}`

  try
  {
    const dadosDaCidade = (await axios.get(URLCompleta)).data

    try
    {
      const latitude = dadosDaCidade[0]["lat"]
      const longitude = dadosDaCidade[0]["lon"]

      const coordenadas = {"latitude": latitude, "longitude": longitude}

      return coordenadas
    }
    catch(error2)
    {
      return -3
    }
  }
  catch(error1)
  {
    return -2
  }
}

async function obterInformacoesClimaticas(coordenadas)
{
  const latitude = coordenadas["latitude"]
  const longitude = coordenadas["longitude"]
  const unidade = "metric"
  const idioma = "pt_br"

  const informacoesClimaticasEndPoint = `/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unidade}&lang=${idioma}&appid=${APIKey}`
  const URLCompleta = `${protocolo}${baseURL}${informacoesClimaticasEndPoint}`

  try
  {
    const informacoesClimaticas = (await axios.get(URLCompleta)).data
    return informacoesClimaticas
  }
  catch(error)
  {
    return -1
  }
}

async function exibirInformacoesClimaticas()
{
  const cidadeInput = document.querySelector("#cidade")
  const cidade = cidadeInput.value

  const coordenadas = await obterCoordenadas(cidade)

  switch(coordenadas)
  {
    case -1:
      console.log("Preencha o campo cidade")
      return -1
    case -2:
      console.log("Serviço indisponível")
      return -1
    case -3:
      console.log("Cidade não encontrada")
      return -1
    default:
      break;
    }
    
  const informacoesClimaticas = await obterInformacoesClimaticas(coordenadas)
  if(informacoesClimaticas == -1)
  {
    console.log("Serviço indisponível")
    return -1
  }

  const sensacaoTermica = informacoesClimaticas["main"]["feels_like"]
  const descricao = informacoesClimaticas["weather"][0]["description"]

  console.log(`Sensação térmica: ${sensacaoTermica}°C`)
  console.log(`Descrição: ${descricao}`)  
}
