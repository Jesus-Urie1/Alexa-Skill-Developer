/* eslint-disable no-use-before-define */
/* eslint-disable global-require */
var http = require("http");
const Alexa = require("ask-sdk-core");
//api
let api = "https://eb1e-189-254-205-70.ngrok.io/api/alexa";
//Menu
const ayudaMenu =
  "En que mas puedo ayudarte? Para volver a escuchar el menú solo di, ver menú";
const menu =
  "que quieres consultar?, ordenes de servicio, ,contenedores ingresados, ,contenedores desconsolidados, ,partidas desconsolidadas, ,total facturado, ,toneladas ingresadas, ,partidas subdividas, ,partidas separadas, o total ingresos";
const sResultado = `No encontré resultados, ${ayudaMenu}`;
//Variable dialogo de Alexa, opciones y numero
let dialogoAlexa,
  opcion = 0,
  number;
//Variables para ordenes de servicio
let eCodTipoSolicitud = null,
  eCodTipoTramite = null,
  eCodTipoServico = null,
  tCodEstatus = null;
//Variables Mes y Año
let eCodAnio = null,
  eCodMes = null;
const anios = "Que año? 2019, 2020, 2021, 2022";
const meses = "Que mes? Solo di el numero del mes";

//Handler Bienvenida
const BienvenidaHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    dialogoAlexa = `Hola!, Bienvenido a Refis 3 60, ${menu}`;

    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Hanlder Opciones -> FUNCIONAMIENTO PRINCIPAL
const OpcionHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "OpcionIntent"
    );
  },
  async handle(handlerInput) {
    number = Alexa.getSlotValue(handlerInput.requestEnvelope, "number");
    switch (opcion) {
      /*------------------------------Contenedores Ingresados------------------------------*/
      case 1:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(
            `${api}/contenedoresIngresados/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de contenedores son ${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Ordenes de servicio------------------------------*/
      case 2:
        if (eCodTipoSolicitud === null) {
          eCodTipoSolicitud = number;
          if (eCodTipoSolicitud < 1 || eCodTipoSolicitud > 4) {
            eCodTipoSolicitud = null;
          }
        } else if (eCodTipoTramite === null) {
          eCodTipoTramite = number;
          if (eCodTipoTramite === "1") {
            eCodTipoTramite = 1;
          } else if (eCodTipoTramite === "2") {
            eCodTipoTramite = 3;
          } else if (eCodTipoTramite === "3") {
            eCodTipoTramite = 4;
          } else if (eCodTipoTramite === "4") {
            eCodTipoTramite = 7;
          } else if (eCodTipoTramite === "5") {
            eCodTipoTramite = 6;
          } else {
            eCodTipoTramite = null;
          }
        } else if (eCodTipoServico === null) {
          eCodTipoServico = number;
          if (eCodTipoServico === "1") {
            eCodTipoServico = 2;
          } else if (eCodTipoServico === "2") {
            eCodTipoServico = 3;
          } else if (eCodTipoServico === "3") {
            eCodTipoServico = 1;
          } else {
            eCodTipoServico = null;
          }
        } else if (tCodEstatus === null) {
          tCodEstatus = number;
          if (tCodEstatus === "1") {
            tCodEstatus = "AU";
          } else if (tCodEstatus === "2") {
            tCodEstatus = "CA";
          } else if (tCodEstatus === "3") {
            tCodEstatus = "NU";
          } else {
            tCodEstatus = null;
          }
        } else if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodTipoSolicitud === null) {
          dialogoAlexa =
            "Que tipo de solicitud?, 1, Entradas, 2, Salidas, 3, Liberaciones, o 4, Movimiento. Para escoger tu respuesta solo di el numero de tu eleccion, O 0, para repetir";
        } else if (eCodTipoTramite === null) {
          dialogoAlexa =
            "Que tipo de tramite?, 1, Importación, 2, Exportación, 3, Guarda y Custodia, 4, Transbordos, o 5, Vacios";
        } else if (eCodTipoServico === null) {
          dialogoAlexa =
            "Que tipo de servicio?, 1, Carga suelta, 2, carga proyecto, o 3, contenedores";
        } else if (tCodEstatus === null) {
          dialogoAlexa =
            "Que estatus?, 1, autorizado, 2, rechazado, o 3, nuevo";
        } else if (eCodAnio === null) {
          await getRemoteData(
            `${api}/ordenesDeServicio/${eCodTipoSolicitud}/${eCodTipoTramite}/${eCodTipoServico}/${tCodEstatus}/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = `No encontré resultados, Reduce tu busqueda a un año en específico, 2019, 2020, 2021, 2022`;
              } else {
                dialogoAlexa = `El total de ordenes de servicio es ${data}, Reduce tu busqueda a un año en específico, 2019, 2020, 2021, 2022`;
              }
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodTipoSolicitud = null),
                (eCodTipoTramite = null),
                (eCodTipoServico = null),
                (tCodEstatus = null);
              console.log(`ERROR: ${err.message}`);
            });
        } else if (eCodMes === null) {
          await getRemoteData(
            `${api}/ordenesDeServicio/${eCodTipoSolicitud}/${eCodTipoTramite}/${eCodTipoServico}/${tCodEstatus}/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = `No encontre resultados, Reduce tu busqueda a un mes en específico, Solo di el numero del mes`;
              } else {
                dialogoAlexa = `El total de ordenes de servicio es ${data}, Reduce tu busqueda a un mes en específico, Solo di el numero del mes`;
              }
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodTipoSolicitud = null),
                (eCodTipoTramite = null),
                (eCodTipoServico = null),
                (tCodEstatus = null),
                (eCodAnio = null);
              console.log(`ERROR: ${err.message}`);
            });
        } else {
          await getRemoteData(
            `${api}/ordenesDeServicio/${eCodTipoSolicitud}/${eCodTipoTramite}/${eCodTipoServico}/${tCodEstatus}/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de ordenes de servicio es ${data}, ${ayudaMenu}`;
              }

              (eCodTipoSolicitud = null),
                (eCodTipoTramite = null),
                (eCodTipoServico = null),
                (tCodEstatus = null),
                (eCodAnio = null),
                (eCodMes = null),
                (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodTipoSolicitud = null),
                (eCodTipoTramite = null),
                (eCodTipoServico = null),
                (tCodEstatus = null),
                (eCodAnio = null),
                (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Contenedores Desconsolidados------------------------------*/
      case 3:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(
            `${api}/contenedoresDesconsolidados/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de contenedores son ${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Partidas Desconsolidadas----------------------------------*/
      case 4:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(
            `${api}/partidasDesconsolidadas/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de partidas es ${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Total Facturado-------------------------------------------*/
      case 5:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(`${api}/totalFacurado/${eCodAnio}/${eCodMes}`)
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total facturado es $${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Toneladas Ingresadas--------------------------------------*/
      case 6:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(
            `${api}/toneladasIngresadas/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de toneladas ingresadas es ${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Partidas Subdivididas-------------------------------------*/
      case 7:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(
            `${api}/partidasSubdivididas/${eCodAnio}/${eCodMes}`
          )
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de partidas es ${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Partidas Separadas----------------------------------------*/
      case 8:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(`${api}/partidasSeparadas/${eCodAnio}/${eCodMes}`)
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de partidas son ${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Total Ingresos--------------------------------------------*/
      case 9:
        if (eCodAnio === null) {
          eCodAnio = number;
          if (eCodAnio < 2019 || eCodAnio > 2022) {
            eCodAnio = null;
          }
        } else if (eCodMes === null) {
          eCodMes = number;
          if (eCodMes < 1 || eCodMes > 12) {
            eCodMes = null;
          }
        }

        if (eCodAnio === null) {
          dialogoAlexa = anios;
        } else if (eCodMes === null) {
          dialogoAlexa = meses;
        } else {
          await getRemoteData(`${api}/totalIngresos/${eCodAnio}/${eCodMes}`)
            .then((response) => {
              const data = JSON.parse(response);
              if (data === 0) {
                dialogoAlexa = sResultado;
              } else {
                dialogoAlexa = `El total de ingresos son $${data}, ${ayudaMenu}`;
              }
              (eCodAnio = null), (eCodMes = null), (opcion = 0);
            })
            .catch((err) => {
              dialogoAlexa = "Ta apagao";
              (eCodAnio = null), (eCodMes = null);
              console.log(`ERROR: ${err.message}`);
            });
        }
        break;
      /*------------------------------Respuesta default-----------------------------------------*/
      default:
        dialogoAlexa =
          "No seleccionaste ninguna opcion del menú, para escuchar el menú solo di, ver menú";
        break;
    }
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Contenedores Ingresados
const ContenedoresIngresadosHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "ContenedoresIngresadosIntent"
    );
  },
  handle(handlerInput) {
    opcion = 1;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Ordenes de servicio
const OrdenesServicioHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "OrdenesServicioIntent"
    );
  },
  handle(handlerInput) {
    opcion = 2;
    dialogoAlexa =
      "Que tipo de solicitud?, 1, Entradas, 2, Salidas, 3, Liberaciones , o 4, Movimiento. Para escoger tu respuesta solo di el numero de tu eleccion. ,O 0,para repetir";
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Contenedores Desconsolidados
const ContenedoresDesconsolidadosHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "ContenedoresDesconsolidadosIntent"
    );
  },
  handle(handlerInput) {
    opcion = 3;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Partidas Desconsolidadas
const PartidasDesconsolidadasHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "PartidasDesconsolidadasIntent"
    );
  },
  handle(handlerInput) {
    opcion = 4;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Total Facturado
const TotalFacturadoHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "TotalFacturadoIntent"
    );
  },
  handle(handlerInput) {
    opcion = 5;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Toneladas Ingresadas
const ToneladasIngresadasHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "ToneladasIngresadasIntent"
    );
  },
  handle(handlerInput) {
    opcion = 6;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Partidas Subdivididas
const PartidasSubdivididasHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "PartidasSubdivididasIntent"
    );
  },
  handle(handlerInput) {
    opcion = 7;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Partidas Separadas
const PartidasSeparadasHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "PartidasSeparadasIntent"
    );
  },
  handle(handlerInput) {
    opcion = 8;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Total Ingresos
const TotalIngresosHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "TotalIngresosIntent"
    );
  },
  handle(handlerInput) {
    opcion = 9;
    dialogoAlexa = anios;
    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

//Handler Menu Inicio
const MenuInicioHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "MenuInicioIntent"
    );
  },
  handle(handlerInput) {
    dialogoAlexa = menu;

    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

/////////////////////////////////////////////////////////////////////////////////////////////////
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const dialogoAlexa = "En que puedo ayudarte?";

    return handlerInput.responseBuilder
      .speak(dialogoAlexa)
      .reprompt(dialogoAlexa)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const dialogoAlexa = "Adios!";

    return handlerInput.responseBuilder.speak(dialogoAlexa).getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `La sesión terminó con la razón: ${handlerInput.requestEnvelope.request.reason}`
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Lo siento, no puedo entender el mensaje, repite de nuevo.")
      .reprompt("Lo siento, no puedo entender el mensaje, repite de nuevo.")
      .getResponse();
  },
};

const getRemoteData = (url) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(
          new Error(`Error con el código de estado: ${response.statusCode}`)
        );
      }
      const body = [];
      response.on("data", (chunk) => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", (err) => reject(err));
  });

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    CancelAndStopIntentHandler,
    BienvenidaHandler,
    OpcionHandler,
    ContenedoresIngresadosHandler,
    OrdenesServicioHandler,
    ContenedoresDesconsolidadosHandler,
    PartidasDesconsolidadasHandler,
    TotalFacturadoHandler,
    ToneladasIngresadasHandler,
    PartidasSubdivididasHandler,
    PartidasSeparadasHandler,
    TotalIngresosHandler,
    MenuInicioHandler,
    HelpIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
