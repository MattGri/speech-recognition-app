window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

const inputValue = document.querySelector('.inputValue');
const btn = document.querySelector('.startBtn');
const resultsDiv = document.querySelector('.results');
const indexId = '1aea39a03a7b0321ba0235873067c0de1688376571';
const trackingCode = 'FEE539C0-D206-A685-88F8-0E433FCDFD1D';

const clearResults = () => {
  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }
};

const renderResults = (data) => {
  data.forEach((result) => {
    const itemWrapper = document.createElement('div');
    const imageUrl = document.createElement('img');
    const productName = document.createElement('p');
    const productPrice = document.createElement('p');
    itemWrapper.classList.add('itemWrapper');
    imageUrl.classList.add('imageUrl');
    productName.classList.add('productName');
    productPrice.classList.add('productPrice');
    imageUrl.src = result.image;
    productName.textContent = `${result.name}`;
    productPrice.textContent = `${parseFloat(result.price).toString()} PLN`;
    resultsDiv.appendChild(itemWrapper);
    itemWrapper.appendChild(imageUrl);
    itemWrapper.appendChild(productName);
    itemWrapper.appendChild(productPrice);
  });
};

const fetchData = async (query) => {
  const apiUrl = `https://api.synerise.com/search/v2/indices/${indexId}/query?query=${query}`;
  const response = await fetch(apiUrl, {
    headers: {
      'x-api-key': trackingCode,
    },
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  const data = await response.json();
  return data.data;
};

const searchWithQuery = async (query) => {
  clearResults();
  try {
    const data = await fetchData(query);
    renderResults(data);
  } catch (error) {
    console.log(error);
  }
};

const toggleSpeechRecognition = () => {
  if (recognition) {
    recognition.stop();
    recognition = null;
    btn.textContent = 'Start';
  } else {
    recognition = new window.SpeechRecognition();
    recognition.interimResults = true;

    recognition.onstart = () => {
      btn.textContent = 'Stop';
      inputValue.value = '';
    };

    recognition.onend = () => {
      recognition = null;
      btn.textContent = 'Start';
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      inputValue.value = speechResult;
      searchWithQuery(speechResult);
    };

    recognition.start();
  }
};

btn.addEventListener('click', toggleSpeechRecognition);

inputValue.addEventListener('keyup', () => {
  const searchQuery = inputValue.value;
  searchWithQuery(searchQuery);
});
