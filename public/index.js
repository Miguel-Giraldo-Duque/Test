let button = document.getElementById("btn");
const recognition = new window.webkitSpeechRecognition();
recognition.interimResults = true;
recognition.lang = "es-ES";
let result;

let silenceTimeout;

let arrTexts = []
let interimText = ""

recognition.onresult = (event) => {
    interimText = "";
    let finalText = ""
    for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
        } else {
            interimText += event.results[i][0].transcript;
        }
    }

    if (finalText) {
        arrTexts.push({
            id: Math.random() * 100,
            content : finalText
        })        

        console.log(arrTexts)
    }


    updateTextArea();
    resetSilenceTimeout();
};

console.log(arrTexts)
recognition.onspeechend = () => {
    resetSilenceTimeout();
};

recognition.onerror = (event) => {
    clearTimeout(silenceTimeout);
    console.error("Error en el reconocimiento de voz:", event.error);
};

recognition.onend = () => {
    clearTimeout(silenceTimeout);
    if (!pressed) {
        console.log("Reconocimiento de voz finalizado");
    } else {
        startRecognition();
    }
};

console.log(recognition);
let pressed = false;
let intervalId;

console.log(window.addEventListener("pointerdown", detectInputType, false))

window.addEventListener("pointerdown", detectInputType, false);

function detectInputType(event) {
    switch(event.pointerType) {
        case "mouse":
            console.log("mouse")
            button.addEventListener("mousedown", onPressStart);
            button.addEventListener("mouseup", onPressEnd);
            break;
        case "pen":
            // pen/stylus input detected
            break;
        case "touch":
             console.log("Phone")
            button.addEventListener("touchstart", onPressStart);
            button.addEventListener("touchend", onPressEnd);
            break;
        default:
            // pointerType is empty (could not be detected) or UA-specific custom type
    }
}

function onPressStart() {
    button.style.backgroundColor = "green";
    pressed = true;
    startRecognition();
    intervalId = setInterval(whilePressed, 1000);
}

function onPressEnd() {
    recognition.stop();
    button.style.backgroundColor = "white";
    console.log("dejando de escuchar");
    pressed = false;
    clearInterval(intervalId); // Detiene el intervalo cuando se suelta el botón
    clearTimeout(silenceTimeout);
}



function whilePressed() {
    if (pressed) {
        
        btn.style.backgroundColor  = "green"
        console.log("botón sigue presionado");
    } else {

        clearInterval(intervalId);
    }
}

function startRecognition() {
    recognition.start();
    resetSilenceTimeout();
}

function resetSilenceTimeout() {
    clearTimeout(silenceTimeout);
    silenceTimeout = setTimeout(() => {
        recognition.stop();
        console.log("Deteniendo el reconocimiento de voz por inactividad");
    }, 5000); // 5 segundos de inactividad
}

function updateTextArea() {
    let textArea = document.getElementById("area");
    textArea.textContent = arrTexts.map(textObj => textObj.content).join(' ') + interimText;
}