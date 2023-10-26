// partes do html
const divCam = document.getElementById('camera');
const divSnap = document.getElementById('snapshot');
const divControles = document.getElementById('controles');
const divEmotion1 = document.getElementById('emotion1');
const divEmoji1 = document.getElementById('emoji1');
const divEmotion2 = document.getElementById('emotion2');
const divEmoji2 = document.getElementById('emoji2');

// AI config
const URL = "https://teachablemachine.withgoogle.com/models/NQ3-8Yvxk/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";
const classifier = ml5.imageClassifier(modelURL, modelReady);

const emocoes = {
    "feliz": "&#128522;",
    "triste": "&#128532;",
    "irritado": "&#128548;"
}

Webcam.set({
    width: 350,
    height: 300,
    imageFormat: 'png',
    pngQuality: 90
})

Webcam.attach(divCam);

function modelReady() {
    console.log('Model Ready');
    divControles.style.display = "block";
}

function speak(previsao1, previsao2) {
    const synth = speechSynthesis;
    const frase1 = "a primeira previsão é " + previsao1;
    const frase2 = " e a segunta previsão é " + previsao2;
    const utterThis = new SpeechSynthesisUtterance(frase1 + frase2);
    synth.speak(utterThis);
}

function begin() {
    Webcam.snap(dataURI => {
        const ibagem = document.createElement("img");
        ibagem.id = "captura";
        ibagem.src = dataURI;
        divSnap.innerHTML = "";
        divSnap.appendChild(ibagem);
        divControles.style.display = "none";
        classifier.classify(ibagem, gotResult);
    });
}

function gotResult(error, result) {
    if (error) {
        console.error(error);
    } else {
        console.log(result);
        const resultado1 =  result[0].label;
        const resultado2 =  result[1].label;
        console.log(resultado1, resultado2);
        speak(resultado1, resultado2);
        preenchePrevisao(resultado1, divEmotion1, divEmoji1);
        preenchePrevisao(resultado2, divEmotion2, divEmoji2);
    }
    divControles.style.display = "block";
}

function preenchePrevisao(previsao, divEmotion, divEmoji) {
    divEmotion.textContent = previsao;
    const emocao = previsao.toLowerCase();
    const emoji = emocoes[emocao];
    divEmoji.innerHTML = emoji;
}