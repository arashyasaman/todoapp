//Call
const showMostCountVideo = () => {
  setShowModal(true);
  axios("https://jsonplaceholder.typicode.com/albums/1/photos").then(
    (response) => {
      const data = response.data;
      const maxNumber = data.reduce(
        (max, data) => (max = max > data.id ? max : data.id),
        0
      );
      console.log("All Data:", data);
      console.log("max Number:", maxNumber);

      const mostCountVideo = data.find((item) => {
        if (item.id === maxNumber) {
          return console.log(item.title);
        }
      });
      console.log("res:", mostCountVideo.title);
    }
  );
};
//Call



