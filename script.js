const submitBtn = document.getElementById("submit-btn");

const generateGif = () => {
  const loader = document.querySelector(".loader");
  loader.style.display = "block";
  document.querySelector(".wrapper").style.display = "none";
  const q = document.getElementById("search-box").value || "laugh";

  let gifCount = 10;

  const apiKey = 'kBwuk2NNxoaSwbMPQfnPO6bMDvxARSNL';
  const finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;
  document.querySelector(".wrapper").innerHTML = "";

  fetch(finalURL)
    .then((resp) => resp.json())
    .then((info) => {
      console.log(info.data);

      const gifsData = info.data;
      gifsData.forEach((gif) => {
        const container = document.createElement("div");
        container.classList.add("container");

        const img = document.createElement("img");
        console.log(gif);
        img.setAttribute("src", gif.images.downsized_medium.url);

        img.onload = () => {
          gifCount--;
          if (gifCount === 0) {
            loader.style.display = "none";
            document.querySelector(".wrapper").style.display = "grid";
          }
        };

        container.append(img);

        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy Link";
        copyBtn.onclick = () => {
          const copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;

          navigator.clipboard.writeText(copyLink)
            .then(() => {
              alert("GIF copied to clipboard");
            })
            .catch(() => {
              alert("GIF copied to clipboard");

              const hiddenInput = document.createElement("input");
              hiddenInput.setAttribute("type", "text");
              document.body.appendChild(hiddenInput);
              hiddenInput.value = copyLink;

              hiddenInput.select();
              document.execCommand("copy");
              document.body.removeChild(hiddenInput);
            });
        };

        container.append(copyBtn);

        // Create the Like button
        const likeBtn = document.createElement("button");
        likeBtn.innerText = "Like";
        let liked = false;

        likeBtn.onclick = () => {
          liked = !liked;
          likeBtn.innerText = liked ? "Liked" : "Like";
          likeBtn.style.backgroundColor = liked ? "green" : ""; // Change button color if liked
          
          if (liked) {
            addLikedGif(gif.images.downsized_medium.url);
          } else {
            removeLikedGif(gif.images.downsized_medium.url);
          }
        };

        container.append(likeBtn);

        document.querySelector(".wrapper").append(container);
      });
    });
};

const addLikedGif = (gifUrl) => {
  const likedGifsContainer = document.querySelector(".liked-gifs");
  const likedContainer = document.createElement("div");
  likedContainer.classList.add("liked-container");

  const img = document.createElement("img");
  img.setAttribute("src", gifUrl);
  img.classList.add("liked-gif");

  const removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove";
  removeBtn.onclick = () => {
    likedGifsContainer.removeChild(likedContainer);
  };

  likedContainer.appendChild(img);
  likedContainer.appendChild(removeBtn);
  likedGifsContainer.appendChild(likedContainer);
};

const removeLikedGif = (gifUrl) => {
  const likedGifsContainer = document.querySelector(".liked-gifs");
  const likedContainers = likedGifsContainer.querySelectorAll(".liked-container");
  likedContainers.forEach((container) => {
    const img = container.querySelector("img");
    if (img.getAttribute("src") === gifUrl) {
      likedGifsContainer.removeChild(container);
    }
  });
};

submitBtn.addEventListener("click", generateGif);
window.addEventListener("load", generateGif);
